// Command Palette Search Logic with Mock Data

export type SearchResultType = 'job' | 'client' | 'invoice' | 'escrow' | 'team' | 'page';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  route: string;
  icon: string;
  score: number;
}

// Mock data - seeded for search
const mockJobs = [
  { id: 'J-1403', title: 'High-rise touch-up', client: 'Carlton Strata', site: 'CBD', status: 'scheduled' },
  { id: 'J-1404', title: 'Balcony sealing', client: 'Bayside Strata', site: 'St Kilda', status: 'completed' },
  { id: 'J-1406', title: 'Heritage restoration', client: 'South Yarra Owners', site: 'South Yarra', status: 'scheduled' },
  { id: 'J-1402', title: 'Tower A repaint', client: 'Acme Body Corp', site: 'Southbank', status: 'in-progress' },
  { id: 'J-1408', title: 'Roof deck repair', client: 'Docklands Mgmt', site: 'Docklands', status: 'scheduled' },
  { id: 'J-1409', title: 'Façade inspection', client: 'Melbourne Property', site: 'Richmond', status: 'scheduled' },
  { id: 'J-1411', title: 'Strata QA check', client: 'Brunswick Estates', site: 'Brunswick', status: 'completed' },
  { id: 'J-1421', title: 'Balcony inspection', client: 'Richmond Owners', site: 'Richmond', status: 'scheduled' },
  { id: 'J-1422', title: 'Roof repairs', client: 'South Yarra', site: 'South Yarra', status: 'in-progress' },
  { id: 'J-1429', title: 'Waterproofing', client: 'Brunswick Dev', site: 'Brunswick', status: 'in-progress' },
];

const mockClients = [
  { id: 'C-1001', name: 'Acme Body Corp', contact: 'John Smith', type: 'Strata', status: 'active' },
  { id: 'C-1002', name: 'Carlton Strata', contact: 'Sarah Johnson', type: 'Strata', status: 'active' },
  { id: 'C-1003', name: 'Bayside Strata', contact: 'Michael Chen', type: 'Strata', status: 'active' },
  { id: 'C-1004', name: 'South Yarra Owners', contact: 'Emma Wilson', type: 'Owners Corp', status: 'active' },
  { id: 'C-1005', name: 'Docklands Mgmt', contact: 'David Lee', type: 'Property Mgmt', status: 'active' },
  { id: 'C-1006', name: 'Melbourne Property', contact: 'Lisa Brown', type: 'Real Estate', status: 'active' },
  { id: 'C-1007', name: 'Brunswick Estates', contact: 'Tom Anderson', type: 'Strata', status: 'active' },
  { id: 'C-1008', name: 'Richmond Owners', contact: 'Kate Murphy', type: 'Owners Corp', status: 'active' },
  { id: 'C-1009', name: 'Brighton Towers', contact: 'James Taylor', type: 'Strata', status: 'active' },
  { id: 'C-1010', name: 'Brunswick Dev', contact: 'Alex Martin', type: 'Developer', status: 'active' },
];

const mockInvoices = [
  { id: 'INV-1042', client: 'Acme Body Corp', amount: 8500, status: 'pending', date: '2025-01-15' },
  { id: 'INV-1043', client: 'Carlton Strata', amount: 5200, status: 'paid', date: '2025-01-18' },
  { id: 'INV-1044', client: 'Bayside Strata', amount: 12000, status: 'paid', date: '2025-01-20' },
  { id: 'INV-1045', client: 'South Yarra Owners', amount: 18500, status: 'pending', date: '2025-01-22' },
  { id: 'INV-1046', client: 'Docklands Mgmt', amount: 7800, status: 'overdue', date: '2025-01-10' },
  { id: 'INV-1047', client: 'Melbourne Property', amount: 9200, status: 'pending', date: '2025-01-25' },
  { id: 'INV-1048', client: 'Brunswick Estates', amount: 6500, status: 'paid', date: '2025-01-28' },
  { id: 'INV-1049', client: 'Richmond Owners', amount: 14200, status: 'pending', date: '2025-01-30' },
  { id: 'INV-1050', client: 'Brighton Towers', amount: 11000, status: 'paid', date: '2025-02-01' },
  { id: 'INV-1051', client: 'Brunswick Dev', amount: 22000, status: 'pending', date: '2025-02-05' },
];

const mockEscrow = [
  { id: 'ESC-501', job: 'J-1402', client: 'Acme Body Corp', amount: 8500, status: 'held' },
  { id: 'ESC-502', job: 'J-1403', client: 'Carlton Strata', amount: 5200, status: 'held' },
  { id: 'ESC-503', job: 'J-1404', client: 'Bayside Strata', amount: 12000, status: 'released' },
  { id: 'ESC-504', job: 'J-1406', client: 'South Yarra Owners', amount: 18500, status: 'held' },
  { id: 'ESC-505', job: 'J-1429', client: 'Brunswick Dev', amount: 22000, status: 'held' },
];

const mockTeam = [
  { id: 'T-1', name: 'Ryan J', role: 'Project Manager', email: 'ryan@fieldwork.com', status: 'active' },
  { id: 'T-2', name: 'Crew A', role: 'Painting Crew', email: 'crew-a@fieldwork.com', status: 'active' },
  { id: 'T-3', name: 'Crew B', role: 'Painting Crew', email: 'crew-b@fieldwork.com', status: 'active' },
  { id: 'T-4', name: 'Crew C', role: 'Painting Crew', email: 'crew-c@fieldwork.com', status: 'active' },
  { id: 'T-5', name: 'QA Team', role: 'Quality Assurance', email: 'qa@fieldwork.com', status: 'active' },
];

const staticPages: SearchResult[] = [
  { id: 'page-dashboard', type: 'page', title: 'Dashboard', subtitle: 'Overview & metrics', route: '/app/dashboard', icon: '📊', score: 0 },
  { id: 'page-jobs', type: 'page', title: 'Jobs', subtitle: 'All jobs', route: '/app/jobs', icon: '🔨', score: 0 },
  { id: 'page-calendar', type: 'page', title: 'Calendar', subtitle: 'Schedule & dispatch', route: '/app/calendar', icon: '📅', score: 0 },
  { id: 'page-clients', type: 'page', title: 'Clients', subtitle: 'Client directory', route: '/app/clients', icon: '👥', score: 0 },
  { id: 'page-invoices', type: 'page', title: 'Invoices', subtitle: 'Billing & payments', route: '/app/invoices', icon: '💰', score: 0 },
  { id: 'page-escrow', type: 'page', title: 'Escrow', subtitle: 'Escrow management', route: '/app/escrow', icon: '🔒', score: 0 },
  { id: 'page-team', type: 'page', title: 'Team', subtitle: 'Team members', route: '/app/team', icon: '👷', score: 0 },
  { id: 'page-market', type: 'page', title: 'Marketplace', subtitle: 'Find & post jobs', route: '/app/market', icon: '🏪', score: 0 },
  { id: 'page-settings', type: 'page', title: 'Settings', subtitle: 'Account & preferences', route: '/app/settings', icon: '⚙️', score: 0 },
];

// Simple fuzzy scoring
function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  
  if (t === q) return 100; // Exact match
  if (t.startsWith(q)) return 80; // Starts with
  if (t.includes(q)) return 60; // Contains
  
  // Check if all query chars appear in order
  let qIndex = 0;
  for (let i = 0; i < t.length && qIndex < q.length; i++) {
    if (t[i] === q[qIndex]) qIndex++;
  }
  if (qIndex === q.length) return 40; // Sequential match
  
  return 0; // No match
}

function searchJobs(query: string): SearchResult[] {
  return mockJobs
    .map(job => {
      const titleScore = fuzzyScore(query, job.title);
      const idScore = fuzzyScore(query, job.id);
      const clientScore = fuzzyScore(query, job.client) * 0.7;
      const siteScore = fuzzyScore(query, job.site) * 0.5;
      const score = Math.max(titleScore, idScore, clientScore, siteScore);
      
      return {
        id: job.id,
        type: 'job' as SearchResultType,
        title: `${job.id} - ${job.title}`,
        subtitle: `${job.client} • ${job.site}`,
        route: `/app/jobs/${job.id}`,
        icon: '🔨',
        score,
      };
    })
    .filter(r => r.score > 0);
}

function searchClients(query: string): SearchResult[] {
  return mockClients
    .map(client => {
      const nameScore = fuzzyScore(query, client.name);
      const idScore = fuzzyScore(query, client.id);
      const contactScore = fuzzyScore(query, client.contact) * 0.6;
      const score = Math.max(nameScore, idScore, contactScore);
      
      return {
        id: client.id,
        type: 'client' as SearchResultType,
        title: client.name,
        subtitle: `${client.type} • ${client.contact}`,
        route: `/app/clients`,
        icon: '👥',
        score,
      };
    })
    .filter(r => r.score > 0);
}

function searchInvoices(query: string): SearchResult[] {
  return mockInvoices
    .map(invoice => {
      const idScore = fuzzyScore(query, invoice.id);
      const clientScore = fuzzyScore(query, invoice.client) * 0.7;
      const amountStr = `$${invoice.amount.toLocaleString()}`;
      const amountScore = fuzzyScore(query, amountStr) * 0.5;
      const score = Math.max(idScore, clientScore, amountScore);
      
      return {
        id: invoice.id,
        type: 'invoice' as SearchResultType,
        title: `${invoice.id} - $${invoice.amount.toLocaleString()}`,
        subtitle: `${invoice.client} • ${invoice.status}`,
        route: `/app/invoices`,
        icon: '💰',
        score,
      };
    })
    .filter(r => r.score > 0);
}

function searchEscrow(query: string): SearchResult[] {
  return mockEscrow
    .map(escrow => {
      const idScore = fuzzyScore(query, escrow.id);
      const jobScore = fuzzyScore(query, escrow.job);
      const clientScore = fuzzyScore(query, escrow.client) * 0.7;
      const score = Math.max(idScore, jobScore, clientScore);
      
      return {
        id: escrow.id,
        type: 'escrow' as SearchResultType,
        title: `${escrow.id} - $${escrow.amount.toLocaleString()}`,
        subtitle: `${escrow.job} • ${escrow.client}`,
        route: `/app/escrow`,
        icon: '🔒',
        score,
      };
    })
    .filter(r => r.score > 0);
}

function searchTeam(query: string): SearchResult[] {
  return mockTeam
    .map(member => {
      const nameScore = fuzzyScore(query, member.name);
      const idScore = fuzzyScore(query, member.id);
      const roleScore = fuzzyScore(query, member.role) * 0.6;
      const score = Math.max(nameScore, idScore, roleScore);
      
      return {
        id: member.id,
        type: 'team' as SearchResultType,
        title: member.name,
        subtitle: `${member.role} • ${member.email}`,
        route: `/app/team`,
        icon: '👷',
        score,
      };
    })
    .filter(r => r.score > 0);
}

function searchPages(query: string): SearchResult[] {
  return staticPages
    .map(page => {
      const titleScore = fuzzyScore(query, page.title);
      const subtitleScore = page.subtitle ? fuzzyScore(query, page.subtitle) * 0.5 : 0;
      const score = Math.max(titleScore, subtitleScore);
      
      return { ...page, score };
    })
    .filter(r => r.score > 0);
}

export function search(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const results: SearchResult[] = [
    ...searchPages(query),
    ...searchJobs(query),
    ...searchClients(query),
    ...searchInvoices(query),
    ...searchEscrow(query),
    ...searchTeam(query),
  ];
  
  // Sort by score (descending) and return top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

// Recent searches storage
const RECENT_SEARCHES_KEY = 'commandPalette_recentSearches';
const MAX_RECENT = 10;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query || query.trim().length === 0) return;
  
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(q => q !== query);
    const updated = [query, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore storage errors
  }
}
