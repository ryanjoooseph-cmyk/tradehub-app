'use client';

import { useState, useEffect, useCallback, useRef, useMemo, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { search, addRecentSearch, getRecentSearches, type SearchResult } from '@/lib/search';

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Lazy initialization for recent searches (SSR-safe)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => 
    typeof window !== 'undefined' ? getRecentSearches() : []
  );
  
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedQueryRef = useRef('');

  // Debounce query updates
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      debouncedQueryRef.current = query;
    }, 150);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Derive results from query using useMemo (no setState in effect)
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return search(query);
  }, [query]);

  // Global keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset state when opening (wrapped in startTransition)
  useEffect(() => {
    if (isOpen) {
      startTransition(() => {
        setQuery('');
        setSelectedIndex(0);
        setRecentSearches(getRecentSearches());
      });
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      addRecentSearch(query);
      router.push(result.route);
      setIsOpen(false);
      setQuery('');
      setSelectedIndex(0);
    },
    [query, router]
  );

  const setQueryAndReset = useCallback((next: string) => {
    setQuery(next);
    setSelectedIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;

        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
          break;

        case 'Enter':
          e.preventDefault();
          if (results.length > 0 && selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelect(results[selectedIndex]);
          }
          break;

        default:
          break;
      }
    },
    [isOpen, results, selectedIndex, handleSelect]
  );

  const handleRecentSearchClick = useCallback((recentQuery: string) => {
    setQuery(recentQuery);
    setSelectedIndex(0);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    query,
    results,
    selectedIndex,
    recentSearches,
    setQuery: setQueryAndReset,
    setSelectedIndex,
    handleKeyDown,
    handleSelect,
    handleRecentSearchClick,
    open,
    close,
  };
}
