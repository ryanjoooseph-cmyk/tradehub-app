'use client';

import { useCommandPalette } from '@/hooks/useCommandPalette';
import { Search, Clock, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function CommandPalette() {
  const {
    isOpen,
    query,
    results,
    selectedIndex,
    recentSearches,
    setQuery,
    handleKeyDown,
    handleSelect,
    handleRecentSearchClick,
    close,
  } = useCommandPalette();

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Autofocus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;

    const selectedElement = resultsContainerRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const showRecent = query.trim().length === 0 && recentSearches.length > 0;
  const showResults = query.trim().length > 0 && results.length > 0;
  const showEmpty = query.trim().length > 0 && results.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 animate-in fade-in duration-150"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-700">
          <Search className="h-5 w-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, clients, invoices, pages..."
            className="flex-1 bg-transparent text-base text-neutral-100 placeholder-neutral-500 outline-none"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <div className="flex items-center gap-2 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-neutral-400 bg-neutral-800 border border-neutral-700 rounded">
              ESC
            </kbd>
            <button
              onClick={close}
              className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div
          ref={resultsContainerRef}
          className="max-h-[60vh] overflow-y-auto overscroll-contain"
        >
          {/* Recent Searches */}
          {showRecent && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Recent Searches
              </div>
              {recentSearches.map((recentQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(recentQuery)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors text-left group"
                >
                  <Clock className="h-4 w-4 text-neutral-500 shrink-0" />
                  <span className="flex-1 text-sm text-neutral-300 group-hover:text-neutral-100">
                    {recentQuery}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <div className="p-2">
              {results.map((result, index) => {
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={result.id}
                    data-index={index}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => {
                      // Update selected index on hover for keyboard nav sync
                      if (selectedIndex !== index) {
                        // This is handled by the parent component
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left ${
                      isSelected
                        ? 'bg-primary-500/15 border border-primary-500/30'
                        : 'hover:bg-neutral-800 border border-transparent'
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-800 shrink-0 text-base">
                      {result.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${
                          isSelected ? 'text-primary-400' : 'text-neutral-100'
                        }`}
                      >
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-xs text-neutral-500 truncate mt-0.5">
                          {result.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Type Badge */}
                    <div className="shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          result.type === 'job'
                            ? 'bg-info-500/15 text-info-400 border border-info-500/30'
                            : result.type === 'client'
                            ? 'bg-success-500/15 text-success-400 border border-success-500/30'
                            : result.type === 'invoice'
                            ? 'bg-warning-500/15 text-warning-400 border border-warning-500/30'
                            : result.type === 'escrow'
                            ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                            : result.type === 'team'
                            ? 'bg-neutral-500/15 text-neutral-400 border border-neutral-500/30'
                            : 'bg-neutral-700/50 text-neutral-400 border border-neutral-600/30'
                        }`}
                      >
                        {result.type}
                      </span>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/30 rounded">
                        ↵
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {showEmpty && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm font-medium text-neutral-400">
                No results found for &quot;{query}&quot;
              </div>
              <div className="text-xs text-neutral-600 mt-2">
                Try different keywords or check spelling
              </div>
            </div>
          )}

          {/* Default State (no query, no recent) */}
          {!showRecent && !showResults && !showEmpty && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">⌘K</div>
              <div className="text-sm font-medium text-neutral-400 mb-2">
                Quick Search & Navigation
              </div>
              <div className="text-xs text-neutral-600 space-y-1">
                <div>Search jobs, clients, invoices, and more</div>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-xs bg-neutral-800 border border-neutral-700 rounded">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 text-xs bg-neutral-800 border border-neutral-700 rounded">
                      ↓
                    </kbd>
                    <span className="text-neutral-600">navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-xs bg-neutral-800 border border-neutral-700 rounded">
                      ↵
                    </kbd>
                    <span className="text-neutral-600">select</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-700 bg-neutral-900/50">
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded">
                ⌘K
              </kbd>
              to open
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded">
                ESC
              </kbd>
              to close
            </span>
          </div>
          <div className="text-xs text-neutral-600">
            {results.length > 0 && `${results.length} result${results.length === 1 ? '' : 's'}`}
          </div>
        </div>
      </div>
    </div>
  );
}
