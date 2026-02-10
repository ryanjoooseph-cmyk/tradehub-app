# TradeHub PR Implementation Checklists


This document contains detailed, actionable checklists for each PR in the development roadmap.

<!-- AUTO-STATUS:START -->
### AUTO-STATUS (generated)

| PR | Title | Status | Branch |
|---:|---|---|---|
| PR1 | Shell Stability Hardening | ⚪ UNKNOWN | `feature/pr1-shell-hardening` |
| PR2 | Dashboard Density + Actions | ⚪ UNKNOWN | `feature/pr2-dashboard-density` |
| PR3 | Jobs List Enhancement | ⚪ UNKNOWN | `feature/pr3-jobs-list` |
| PR4 | Job Detail with Escrow Preview | ⚪ UNKNOWN | `feature/pr4-job-detail` |
| PR5 | Clients, Invoices, Calendar | ⚪ UNKNOWN | `feature/pr5-core-pages` |
| PR6 | Marketplace MVP | ⚪ UNKNOWN | `feature/pr6-marketplace` |
| PR7 | Escrow v1 | ⚪ UNKNOWN | `feature/pr7-escrow-v1` |
| PR8 | Automation Agents v1 | ⚪ UNKNOWN | `feature/pr8-agents-v1` |
| PR10 | Shell Aesthetics v1 (100M SaaS upgrade) | ⚪ UNKNOWN | `feature/pr10-shell-aesthetics` |
| PR11 | Calendar Upgrade v2 (Premium Scheduler) | 🟡 OPEN | `feature/pr11-calendar-v2` |
| PR12 | Marketplace Link in Topbar | ⚪ UNKNOWN | `feature/pr12-topbar-marketplace-link` |
| PR13 | Marketplace ↔ App Integration v1 (optional) | ⚪ UNKNOWN | `feature/pr13-marketplace-app-integration` |

If a PR is missing here, add a PR section below so it can be tracked.
<!-- AUTO-STATUS:END -->

---

## PR1: Shell Stability Hardening

**Branch:** `feature/pr1-shell-hardening`  
**Allowed Files:** AppShell.tsx, TopbarActions.tsx, app/layout.tsx  
**Estimated Time:** 1 day

### Pre-Work Checklist
- [ ] Create feature branch from main
- [ ] Pull latest changes
- [ ] Run `pnpm dev` to verify local environment
- [ ] Open all target files in editor

### Implementation Checklist

#### Sidebar Navigation
- [ ] Test each NAV link by clicking
- [ ] Verify active state highlights correctly
- [ ] Ensure active route matches URL
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Test sidebar collapse/expand
- [ ] Verify collapsed state persists on navigation
- [ ] Test collapsed icons render correctly
- [ ] Verify "Premium shell locked" message toggles

#### Topbar Actions
- [ ] Test search shortcut (⌘K)
- [ ] Verify search modal opens
- [ ] Test theme toggle (light/dark)
- [ ] Ensure theme persists on reload
- [ ] Test notification bell (if implemented)
- [ ] Verify current page title displays
- [ ] Test responsive behavior (mobile)

#### Hydration & Performance
- [ ] Open browser dev console
- [ ] Check for hydration warnings
- [ ] Fix any "Text content does not match" errors
- [ ] Verify no layout shift on load
- [ ] Test theme toggle has no flash
- [ ] Measure initial render time
- [ ] Check for console errors

#### Mobile Behavior
- [ ] Open in mobile viewport (375px)
- [ ] Test hamburger menu toggle
- [ ] Verify sidebar auto-closes after nav
- [ ] Test touch targets (min 44px)
- [ ] Verify topbar doesn't overflow
- [ ] Test landscape orientation

#### Accessibility
- [ ] All nav links have proper labels
- [ ] Keyboard focus visible
- [ ] Skip to content link works
- [ ] ARIA labels on icon buttons
- [ ] Color contrast passes WCAG AA

### Testing Checklist
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile device

### PR Submission Checklist
- [ ] Commit with descriptive message
- [ ] Push to feature branch
- [ ] Create PR with template
- [ ] Add screenshots (before/after)
- [ ] Request review from team
- [ ] Link to issue/task

### Done Criteria (All Must Pass)
- [ ] Zero hydration errors in console
- [ ] All 10 NAV links navigate correctly
- [ ] Sidebar collapse state persists
- [ ] Theme toggle instant (no flash)
- [ ] Mobile sidebar auto-closes
- [ ] Keyboard shortcuts work

---

## PR2: Dashboard Density + Actions

**Branch:** `feature/pr2-dashboard-density`  
**Allowed Files:** app/dashboard/page.tsx, kpi.tsx, charts.tsx, section.tsx  
**Estimated Time:** 2 days

### Pre-Work Checklist
- [ ] Merge PR1 to main
- [ ] Create feature branch from main
- [ ] Design seeded data structure
- [ ] Identify chart library (Recharts)

### Implementation Checklist

#### KPI Grid Enhancement
- [ ] Add trend indicators (↑↓) to KPIs
- [ ] Calculate percentage change
- [ ] Color-code trends (green/red)
- [ ] Make KPIs clickable
- [ ] Link KPIs to relevant pages:
  - Open Jobs → /app/jobs?filter=open
  - Revenue → /app/invoices
  - Outstanding Invoices → /app/invoices?filter=overdue
  - Escrow Holds → /app/escrow
- [ ] Add loading skeletons
- [ ] Implement error states

#### Revenue Trend Chart
- [ ] Install Recharts if needed
- [ ] Create seeded revenue data (7 days)
- [ ] Build LineChart component
- [ ] Add axis labels (dates, amounts)
- [ ] Style chart with Tailwind
- [ ] Add hover tooltips
- [ ] Make responsive (mobile)
- [ ] Show $31.2k label
- [ ] Add "Last 7 days performance curve" subtitle

#### Crew Utilization Chart
- [ ] Create seeded utilization data (weekly)
- [ ] Build BarChart component
- [ ] Show 69% circular progress
- [ ] Add target line at 75%
- [ ] Color-code: green (good), yellow (tight), red (over)
- [ ] Add labels for each day
- [ ] Make responsive

#### Today's Focus Section
- [ ] Create priority list component
- [ ] Seed with 3 priorities:
  - Quote approvals (count: 3)
  - Jobs at risk (count: 1)
  - Payments to reconcile (count: 0)
- [ ] Add status badges
- [ ] Make items clickable
- [ ] Add "auto-generated priorities" label

#### Live Feed Section
- [ ] Create event feed component
- [ ] Seed with recent events:
  - New job booked (success badge)
  - Invoice sent (default badge)
  - Quote approved (success badge)
- [ ] Add timestamps (relative time)
- [ ] Add event type icons
- [ ] Make scrollable (max 5 items)
- [ ] Add "Events, updates, agent actions" subtitle

### Seeded Data Structure
```typescript
const seededData = {
  kpis: {
    openJobs: { current: 18, change: +3, trend: 'up' },
    revenue: { current: 184200, change: +12.4, trend: 'up' },
    invoices: { current: 42900, overdue: 2, pending: 7 },
    escrow: { current: 61500, disputes: 0, status: 'healthy' }
  },
  revenueTrend: [
    { date: '2026-01-26', amount: 28500 },
    { date: '2026-01-27', amount: 31200 },
    // ... 7 days
  ],
  crewUtilization: [
    { day: 'Mon', util: 0.82 },
    { day: 'Tue', util: 0.67 },
    // ... week
  ],
  priorities: [
    { type: 'quote_approvals', count: 3, severity: 'medium' },
    { type: 'jobs_at_risk', count: 1, severity: 'high' },
    { type: 'payments', count: 0, severity: 'low' }
  ],
  liveFeed: [
    { type: 'job_booked', message: 'New job booked', time: '5m ago', status: 'success' },
    // ... events
  ]
}
```

### Testing Checklist
- [ ] All KPIs render correctly
- [ ] Trends show accurate direction
- [ ] Charts render without errors
- [ ] Charts responsive on mobile
- [ ] All links navigate correctly
- [ ] No empty sections
- [ ] Loading states work
- [ ] Error states styled
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds

### Done Criteria
- [ ] KPIs show trend arrows
- [ ] Revenue chart renders with 7-day data
- [ ] Crew utilization shows 69% with bars
- [ ] Today's Focus has 3 actionable items
- [ ] Live Feed shows 3+ recent events
- [ ] Zero empty sections
- [ ] All sections link to pages

---

## PR3: Jobs List Enhancement

**Branch:** `feature/pr3-jobs-list`  
**Allowed Files:** app/jobs/page.tsx, filled/page.tsx  
**Estimated Time:** 2 days

### Pre-Work Checklist
- [ ] Merge PR2 to main
- [ ] Create feature branch
- [ ] Design job table schema
- [ ] Prepare seeded data (15+ jobs)

### Implementation Checklist

#### Table Structure
- [ ] Create table component
- [ ] Add columns:
  - Job Number
  - Client
  - Site
  - Status
  - Next Action
  - Value
  - Risk
- [ ] Make table sortable
- [ ] Add column visibility toggles
- [ ] Make responsive (horizontal scroll on mobile)

#### Search & Filters
- [ ] Build search input
- [ ] Search by: job number, client, site, strata plan
- [ ] Add status filters (buttons):
  - All
  - On Track
  - Waiting
  - At Risk
  - Complete
- [ ] Filter by risk level
- [ ] Filter by date range
- [ ] Show active filter count
- [ ] Add "Clear filters" button

#### Row Interactions
- [ ] Make rows clickable
- [ ] Hover state styling
- [ ] Click navigates to /app/jobs/[id]
- [ ] Add row selection checkboxes
- [ ] Track selected rows
- [ ] Show selection count

#### Bulk Actions
- [ ] Create bulk actions toolbar
- [ ] Show when 1+ rows selected
- [ ] Add actions:
  - Assign team
  - Update status
  - Export selected
  - Send reminders
- [ ] Confirm destructive actions

#### Risk Indicators
- [ ] Add risk column with icons/badges
- [ ] Color-code:
  - Low: green
  - Medium: yellow
  - High: red
- [ ] Show risk tooltip on hover
- [ ] Calculate risk from: schedule, overdue tasks, disputes

#### Empty State
- [ ] Design empty state component
- [ ] Add illustration/icon
- [ ] Show "No jobs yet" message
- [ ] Add "Create Job" CTA
- [ ] Show when no search results

### Seeded Data
```typescript
const jobs = [
  {
    id: 'J-1402',
    client: 'Acme Body Corp',
    site: 'Southbank - Tower A',
    status: 'on_track',
    nextAction: 'Crew allocation',
    value: 18900,
    risk: 'low',
    scheduledStart: '2026-02-06'
  },
  // ... 15+ jobs with variety
]
```

### Testing Checklist
- [ ] Table renders all 15 jobs
- [ ] Search filters instantly
- [ ] Status filters work correctly
- [ ] Risk badges color-coded
- [ ] Row click navigates
- [ ] Bulk select works
- [ ] Bulk actions functional
- [ ] Empty state displays
- [ ] Mobile horizontal scroll works
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes

### Done Criteria
- [ ] Table shows 15+ jobs
- [ ] Search filters work
- [ ] Status pills color-coded
- [ ] Risk indicators visible
- [ ] Row click navigates
- [ ] Bulk actions work
- [ ] Empty state designed

---

## PR4: Job Detail with Escrow Preview

**Branch:** `feature/pr4-job-detail`  
**Allowed Files:** app/jobs/[id]/page.tsx  
**Estimated Time:** 2 days

### Pre-Work Checklist
- [ ] Merge PR3 to main
- [ ] Create feature branch
- [ ] Design detail page layout
- [ ] Prepare job detail seeded data

### Implementation Checklist

#### Tab Navigation
- [ ] Create tab component
- [ ] Tabs: Overview, Milestones, Timeline, Files
- [ ] Active tab highlighted
- [ ] URL param for active tab (?tab=milestones)
- [ ] Tab changes without layout shift
- [ ] Keyboard navigation (arrow keys)

#### Overview Tab
- [ ] Job header with number, status
- [ ] Client information card
- [ ] Site details card
- [ ] Team assigned card
- [ ] Scope of work section
- [ ] Timeline summary
- [ ] Budget breakdown

#### Milestones Tab
- [ ] Milestone cards grid
- [ ] Each milestone shows:
  - Title
  - Amount
  - Status badge
  - Due date
  - Progress (if in progress)
- [ ] Color-code by state:
  - FUNDED: blue
  - WORK_SUBMITTED: yellow
  - EVIDENCE_REVIEW: orange
  - RELEASED: green
  - DISPUTED: red
- [ ] Make milestones clickable (future)

#### Timeline Tab
- [ ] Vertical timeline component
- [ ] Show audit events chronologically
- [ ] Event types:
  - Job created
  - Job scheduled
  - Work started
  - Milestone funded
  - Evidence submitted
  - Milestone released
- [ ] Add timestamps
- [ ] Add actor names
- [ ] Add event icons

#### Files Tab
- [ ] File upload zone
- [ ] Show uploaded files grid
- [ ] File types: photos, PDFs, docs
- [ ] Preview thumbnails
- [ ] Download buttons
- [ ] Delete confirmation
- [ ] Empty state: "No files yet"

#### Quick Actions Toolbar
- [ ] Floating action toolbar (top-right)
- [ ] Actions:
  - Edit job
  - Send update
  - Add note
  - Schedule
  - Complete
- [ ] Dropdown menu for more actions
- [ ] Confirm destructive actions

#### Escrow Status Badge
- [ ] Sticky badge (always visible)
- [ ] Show total escrow amount
- [ ] Show pending releases
- [ ] Show disputes count
- [ ] Color-coded status
- [ ] Clickable → scrolls to Milestones tab

### Seeded Data
```typescript
const jobDetail = {
  id: 'J-1402',
  number: 'J-1402',
  status: 'in_progress',
  client: { name: 'Acme Body Corp', contact: 'L. Chen' },
  site: { address: 'Southbank - Tower A', level: '12-32' },
  team: [{ name: 'Ryan J', role: 'Lead' }, { name: 'Crew A', role: 'Team' }],
  milestones: [
    { title: 'Initial deposit', amount: 6450, state: 'RELEASED' },
    { title: 'Progress claim #1', amount: 9450, state: 'FUNDED' },
    { title: 'Final completion', amount: 3000, state: 'DRAFT' }
  ],
  timeline: [
    { event: 'Job created', timestamp: '2026-01-28', actor: 'Ryan J' },
    { event: 'Milestone #1 funded', timestamp: '2026-01-29', actor: 'Client' },
    { event: 'Work started', timestamp: '2026-02-01', actor: 'Ryan J' }
  ],
  files: []
}
```

### Testing Checklist
- [ ] All tabs render
- [ ] Tab switching smooth
- [ ] Overview complete
- [ ] Milestones display correctly
- [ ] Timeline chronological
- [ ] Files tab functional
- [ ] Quick actions work
- [ ] Escrow badge visible
- [ ] No layout shift
- [ ] Mobile responsive
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes

### Done Criteria
- [ ] Tabs switch without shift
- [ ] Overview shows complete details
- [ ] Milestones show state badges
- [ ] Timeline shows events
- [ ] Files tab has placeholders
- [ ] Quick actions prominent
- [ ] Escrow status visible

---

## PR5: Clients, Invoices, Calendar

**Branch:** `feature/pr5-core-pages`  
**Estimated Time:** 3 days (split into 3 sub-PRs if desired)

### PR5a: Clients Page

#### Implementation Checklist
- [ ] Create clients table
- [ ] Columns: Client, Type, Portfolio, Status, Notes
- [ ] Add type badges (Strata, Management)
- [ ] Portfolio summary (building count, sites)
- [ ] Client health signals:
  - Payment reliability (High/Medium/Low)
  - Approval speed (Fast/Medium/Slow)
  - Scope volatility (Low/Medium/High)
- [ ] Search by name, email, company
- [ ] Filter by type
- [ ] Filter by status (Active, Warm, Inactive)
- [ ] Quick actions: New Job, Send Invoice
- [ ] Empty state design

#### Seeded Data
```typescript
const clients = [
  {
    name: 'Acme Body Corp',
    email: 'lchen@acme.com',
    type: 'Strata',
    portfolio: { buildings: 12, sites: 'Southbank/Docklands' },
    status: 'Active',
    paymentReliability: 'High',
    approvalSpeed: 'Medium',
    notes: 'Prefers staged invoicing + progress photos'
  },
  // ... 10+ clients
]
```

#### Done Criteria
- [ ] Shows 10+ seeded clients
- [ ] Type badges styled
- [ ] Health signals color-coded
- [ ] Portfolio counts accurate
- [ ] Quick actions functional

---

### PR5b: Invoices Page

#### Implementation Checklist
- [ ] Create invoices table
- [ ] Columns: Invoice#, Client, Job, Status, Due, Amount
- [ ] Status filters (Sent, Paid, Overdue)
- [ ] Cashflow snapshot (next 7 days):
  - Expected collections: $14,320
  - High risk: $8,900
- [ ] Automation rules section:
  - Escrow-linked releases
  - Overdue escalation
  - Send reminders
- [ ] One-click actions per row:
  - Send reminder
  - Escalate now
  - Mark paid
- [ ] Bulk actions toolbar

#### Seeded Data
```typescript
const invoices = [
  {
    number: 'INV-22018',
    client: 'Acme Body Corp',
    job: 'J-1402',
    status: 'sent',
    due: '2026-02-06',
    amount: 9450,
    note: 'Progress claim #2'
  },
  // ... 10+ invoices
]
```

#### Done Criteria
- [ ] Table shows 10+ invoices
- [ ] Status color-coded
- [ ] Cashflow accurate
- [ ] Automation rules visible
- [ ] Quick actions work

---

### PR5c: Calendar Page

#### Implementation Checklist
- [ ] Week view grid (7 columns, hourly rows)
- [ ] Job cards on calendar
- [ ] Drag-drop interaction (UI only for now)
- [ ] Conflict detection (overlapping jobs highlighted)
- [ ] Smart scheduling toggle (visual state)
- [ ] Crew allocation badges on cards
- [ ] View toggles: Day, Week, Month
- [ ] Backlog sidebar (unscheduled jobs)
- [ ] Navigation: Previous/Next week
- [ ] Today button

#### Seeded Data
```typescript
const scheduledJobs = [
  {
    id: 'J-1402',
    title: 'Tower A repaint',
    start: '2026-02-06T08:00',
    end: '2026-02-06T16:00',
    crew: ['Ryan J', 'Crew A'],
    site: 'Southbank'
  },
  // ... jobs across week
]

const backlog = [
  { id: 'J-1405', title: 'QA inspection', crew: null },
  // ... unscheduled
]
```

#### Done Criteria
- [ ] Week view renders cleanly
- [ ] Jobs draggable (UI feedback)
- [ ] Conflicts highlighted
- [ ] View toggles work
- [ ] Crew names on cards
- [ ] Backlog visible

---

## PR6: Marketplace MVP

**Branch:** `feature/pr6-marketplace`  
**Estimated Time:** 5-6 days

### Pre-Work Checklist
- [ ] Design marketplace domain model
- [ ] Create /market route group
- [ ] Design marketplace layout (separate from /app)
- [ ] Prepare seeded provider data

### Implementation Checklist

#### Route Structure
- [ ] Create `app/market/layout.tsx` (new minimal shell)
- [ ] Create `app/market/page.tsx` (landing)
- [ ] Create `app/market/post-job/page.tsx`
- [ ] Create `app/market/jobs/[id]/page.tsx`
- [ ] Create `app/market/checkout/page.tsx`

#### Landing Page
- [ ] Hero section
- [ ] How it works (3 steps)
- [ ] Categories grid
- [ ] Provider showcase
- [ ] Trust signals (escrow, verified, reviews)
- [ ] CTA: Post a Job

#### Post Job Flow
- [ ] Multi-step form:
  1. Category selection
  2. Location + timing
  3. Budget range
  4. Photos upload
  5. Description
- [ ] Progress indicator
- [ ] Form validation
- [ ] Save draft functionality
- [ ] Submit creates Job record

#### Job Detail Page (Buyer View)
- [ ] Job summary
- [ ] Quotes received (list)
- [ ] Provider profiles (mini cards)
- [ ] Quote comparison table
- [ ] Accept quote button
- [ ] Message provider
- [ ] Share job link

#### Provider Matching
- [ ] Simple filter matching (v1):
  - Category match
  - Location proximity
  - Availability
  - Verified status
- [ ] Show matched providers list
- [ ] Invite to quote button

#### Quote Submission Flow (Provider)
- [ ] Quote form:
  - Total amount
  - Milestone breakdown
  - Timeline
  - Notes
- [ ] Attach portfolio photos
- [ ] Submit quote

#### Escrow Checkout
- [ ] Quote acceptance creates milestones
- [ ] Show milestone funding page
- [ ] Payment method selection (placeholder)
- [ ] Fund escrow button
- [ ] Creates Job in /app/jobs
- [ ] Redirects to job detail

#### Provider Verification
- [ ] Verification upload form:
  - Business license
  - Insurance certificate
  - Portfolio photos
- [ ] Manual review queue (admin)
- [ ] Verification badge display

#### Review System
- [ ] Post-completion review form
- [ ] Star rating (1-5)
- [ ] Comment field
- [ ] Photo upload (optional)
- [ ] Display reviews on provider profile
- [ ] Aggregate rating calculation

### Seeded Data
```typescript
const providers = [
  {
    id: 'PROV-001',
    name: 'Elite Painting Co',
    category: 'painting',
    verified: true,
    rating: 4.8,
    reviewCount: 127,
    completedJobs: 89,
    location: 'Melbourne CBD',
    portfolio: ['url1', 'url2']
  },
  // ... 10+ providers
]

const marketplaceJobs = [
  {
    id: 'MJ-001',
    category: 'painting',
    location: 'Southbank',
    budget: { min: 5000, max: 10000 },
    timing: 'within 2 weeks',
    status: 'open',
    quotesReceived: 3
  },
  // ... jobs
]
```

### Testing Checklist
- [ ] Landing page loads
- [ ] Post job form validates
- [ ] Job creation works
- [ ] Provider matching filters correctly
- [ ] Quote submission saves
- [ ] Checkout flow creates milestones
- [ ] Job appears in /app/jobs
- [ ] Verification upload works
- [ ] Reviews display correctly
- [ ] Mobile responsive
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes

### Done Criteria
- [ ] /market route group separate
- [ ] Post job form complete
- [ ] Job detail shows quotes
- [ ] Checkout creates milestones
- [ ] Provider can submit quote
- [ ] Verification upload works
- [ ] Reviews display
- [ ] Job created in /app/jobs

---

## PR7: Escrow v1

**Branch:** `feature/pr7-escrow-v1`  
**Estimated Time:** 5-7 days

### Pre-Work Checklist
- [ ] Design escrow state machine
- [ ] Plan audit event schema
- [ ] Design evidence upload system
- [ ] Plan dispute workflow

### Implementation Checklist

#### Ops Admin (/app/escrow)
- [ ] All escrow transactions table
- [ ] Columns:
  - Job
  - Client
  - Milestones
  - Status
  - Next Action
  - Amount
- [ ] Filter by status:
  - All
  - Funds Held
  - Ready to Release
  - On Hold
  - Disputes
- [ ] Risk score column
- [ ] Evidence completeness indicator
- [ ] Bulk release approval
- [ ] Inspector assignment modal
- [ ] Dispute resolution workflow

#### State Machine Enforcement
- [ ] Implement milestone state enum:
  ```typescript
  enum MilestoneState {
    DRAFT = 'DRAFT',
    FUNDED = 'FUNDED',
    WORK_SUBMITTED = 'WORK_SUBMITTED',
    EVIDENCE_REVIEW = 'EVIDENCE_REVIEW',
    RELEASED = 'RELEASED',
    DISPUTED = 'DISPUTED',
    INSPECTOR_ASSIGNED = 'INSPECTOR_ASSIGNED',
    RESOLVED = 'RESOLVED'
  }
  ```
- [ ] Add state transition validation
- [ ] Block invalid transitions
- [ ] Log all transitions as audit events

#### Evidence Gating
- [ ] Evidence requirements by risk level:
  - Low: buyer approval only
  - Medium: 2 photos + checklist
  - High: 5 photos + checklist + completion notes
- [ ] Risk score calculation:
  - Job value > $10k: +1
  - New client: +1
  - New provider: +1
  - Dispute history: +2
  - High-risk category: +1
- [ ] Evidence upload UI
- [ ] Evidence review checklist
- [ ] Completeness validation

#### Inspector Workflow
- [ ] Inspector assignment modal
- [ ] Notify inspector
- [ ] Inspector report form:
  - Findings
  - Photos
  - Recommendation (Release/Refund/Partial)
  - Amount (if partial)
- [ ] Submit report creates audit event
- [ ] Admin review decision UI
- [ ] Decision triggers state change

#### Buyer Portal (/escrow)
- [ ] Milestone status cards
- [ ] Progress indicators
- [ ] Evidence upload zone
- [ ] Evidence gallery view
- [ ] Approve milestone button
- [ ] Dispute milestone button
- [ ] Dispute form:
  - Reason selection
  - Description
  - Supporting photos
- [ ] Audit timeline view
- [ ] Inspector report viewing
- [ ] Payment history

#### Audit Trail
- [ ] AuditEvent model:
  ```typescript
  type AuditEvent = {
    id: string
    jobId: string
    milestoneId?: string
    eventType: string
    payload: Record<string, any>
    actor: string
    timestamp: Date
    merkleHash?: string
  }
  ```
- [ ] Log all critical events:
  - Milestone funded
  - Work submitted
  - Evidence uploaded
  - Approval granted
  - Dispute opened
  - Inspector assigned
  - Report submitted
  - Decision made
  - Funds released
- [ ] Timeline view component
- [ ] Event filtering
- [ ] Export audit log

#### Release Engine
- [ ] Approval triggers release
- [ ] Check evidence requirements met
- [ ] Validate state transitions
- [ ] Simulate fund transfer (log only)
- [ ] Create audit events
- [ ] Notify provider
- [ ] Update job status

### Seeded Data
```typescript
const escrowMilestones = [
  {
    id: 'MS-001',
    jobId: 'J-1402',
    title: 'Initial deposit',
    amount: 6450,
    state: 'RELEASED',
    evidenceRequired: false,
    evidence: [],
    fundedAt: '2026-01-29',
    releasedAt: '2026-02-01'
  },
  {
    id: 'MS-002',
    jobId: 'J-1402',
    title: 'Progress claim #1',
    amount: 9450,
    state: 'EVIDENCE_REVIEW',
    evidenceRequired: true,
    evidence: [
      { type: 'photo', url: 'url1', uploadedAt: '2026-02-01' },
      { type: 'photo', url: 'url2', uploadedAt: '2026-02-01' }
    ],
    fundedAt: '2026-01-30'
  },
  {
    id: 'MS-003',
    jobId: 'J-1411',
    title: 'Completion payment',
    amount: 1860,
    state: 'DISPUTED',
    disputeReason: 'Quality concerns',
    inspectorId: 'INSP-001',
    fundedAt: '2026-01-28'
  }
]

const auditEvents = [
  {
    id: 'AE-001',
    jobId: 'J-1402',
    milestoneId: 'MS-001',
    eventType: 'MILESTONE_FUNDED',
    actor: 'Client (L. Chen)',
    timestamp: '2026-01-29T10:23:00Z'
  },
  // ... events
]
```

### Testing Checklist
- [ ] State transitions enforce rules
- [ ] Evidence gating works
- [ ] Risk scoring accurate
- [ ] Inspector assignment functional
- [ ] Dispute flow complete
- [ ] Buyer can upload evidence
- [ ] Buyer can approve/dispute
- [ ] Admin can release funds
- [ ] Audit events logged
- [ ] Timeline displays correctly
- [ ] Mobile responsive
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes

### Done Criteria
- [ ] Ops admin shows all activity
- [ ] Buyer portal isolated
- [ ] Evidence uploads work
- [ ] Approval triggers state change
- [ ] Dispute flow initiates
- [ ] Inspector can be assigned
- [ ] Audit events logged
- [ ] State machine enforced

---

## PR8: Automation Agents v1

**Branch:** `feature/pr8-agents-v1`  
**Estimated Time:** 7-10 days

### Pre-Work Checklist
- [ ] Set up OpenAI API key in env
- [ ] Design agent API structure
- [ ] Plan audit logging for agents
- [ ] Set up GitHub Actions integration

### Implementation Checklist

#### Agent Infrastructure
- [ ] Create `/api/agent` namespace
- [ ] Implement agent middleware:
  - Authentication
  - Rate limiting
  - Error handling
  - Audit logging
- [ ] Create agent base class/utility
- [ ] Set up OpenAI client

#### Agent 1: Release Manager
- [ ] Create `/api/agent/release-manager` endpoint
- [ ] GitHub Actions workflow:
  ```yaml
  on:
    pull_request:
      types: [opened, synchronize]
  ```
- [ ] Agent tasks:
  - Read PR description
  - Validate checklist items
  - Check CI status (lint, typecheck, build)
  - Identify risky file changes
  - Generate changelog from commits
  - Determine merge safety
- [ ] Post comment to PR with:
  - Checklist status
  - CI status
  - Risk assessment
  - Changelog preview
  - Recommendation (Approve/Block)
- [ ] Block merge if:
  - CI failing
  - Risky files changed without review
  - Checklist incomplete

#### Agent 2: CI Triage
- [ ] Create `/api/agent/ci-triage` endpoint
- [ ] Trigger on CI failure
- [ ] Agent tasks:
  - Fetch failing test logs
  - Parse error messages
  - Classify error type:
    - TypeScript error
    - ESLint error
    - Runtime error
    - Build error
  - Extract file + line number
  - Suggest minimal fix
- [ ] Post comment with:
  - Error classification
  - Root cause analysis
  - Fix suggestion
  - Related docs link

#### Agent 3: Regression Guard
- [ ] Create `/api/agent/regression-guard` endpoint
- [ ] Trigger on PR with UI changes
- [ ] Agent tasks:
  - Detect changed route files
  - Take screenshots (Playwright)
  - Compare with baseline
  - Calculate visual diff score
  - Flag regressions (threshold: 5%)
  - Suggest Playwright test
- [ ] Post comment with:
  - Changed routes list
  - Visual diff score
  - Regression warnings
  - Test suggestions

#### Agent 4: Support Triage
- [ ] Create `/api/agent/support-triage` endpoint
- [ ] Trigger on new ticket
- [ ] Agent tasks:
  - Parse ticket text
  - Extract: job ID, milestone ID, client name
  - Classify issue type:
    - Payment question
    - Job status inquiry
    - Technical issue
    - Feature request
  - Assign severity (Low/Medium/High/Critical)
  - Suggest team member
- [ ] Create structured task in DB
- [ ] Notify assigned team member

#### Agent 5: Dispute Assistant
- [ ] Create `/api/agent/dispute-assistant` endpoint
- [ ] Trigger on dispute opened
- [ ] Agent tasks:
  - Fetch dispute details
  - Fetch evidence from provider
  - Fetch evidence from client
  - Summarize each side's case
  - Identify missing evidence
  - Propose resolution options:
    - Full release
    - Full refund
    - Partial release (suggest amount)
  - **NEVER auto-decide**
- [ ] Create audit event with recommendation
- [ ] Display in admin UI

#### Agent 6: Data Entry
- [ ] Create `/api/agent/data-entry` endpoint
- [ ] Trigger on email received
- [ ] Agent tasks:
  - Parse email text
  - Extract job-related data
  - OCR attached photos (if invoices/receipts)
  - Create draft job note
  - Require human review
- [ ] Store as draft (not saved)
- [ ] Notify user for review

### Agent Logging
- [ ] All agent runs logged as AuditEvents
- [ ] Include:
  - Agent name
  - Input data
  - Output/recommendation
  - Timestamp
  - Success/failure status
- [ ] Failed runs include error details
- [ ] Agent timeline view in admin

### GitHub Integration
- [ ] Set up GitHub App (if needed)
- [ ] Configure webhook endpoints
- [ ] Handle PR events
- [ ] Handle CI status events
- [ ] Post comments via API
- [ ] Update check statuses

### Testing Checklist
- [ ] Release manager runs on PR
- [ ] CI triage runs on failure
- [ ] Regression guard detects changes
- [ ] Support triage parses tickets
- [ ] Dispute assistant summarizes
- [ ] Data entry extracts data
- [ ] All agents log audit events
- [ ] No agent auto-merges
- [ ] No agent auto-releases funds
- [ ] Error handling works
- [ ] Rate limiting enforced
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes

### Done Criteria
- [ ] PR triage time < 5 min
- [ ] Dispute summary < 1 min
- [ ] Support routing 100% accurate
- [ ] Agent audit events logged
- [ ] All agents advisory-only
- [ ] No auto-decisions on critical actions

---

## General PR Workflow

For all PRs, follow this workflow:

1. **Branch Creation**
   - Create from latest `main`
   - Use naming convention: `feature/prN-description`

2. **Development**
   - Follow allowed files strictly
   - Run linter frequently: `pnpm lint`
   - Run typecheck: `pnpm typecheck`
   - Test locally: `pnpm dev`

3. **Testing**
   - Test all functionality
   - Test edge cases
   - Test error states
   - Test mobile responsive
   - Test accessibility

4. **Pre-Commit**
   - Run: `pnpm lint`
   - Run: `pnpm typecheck`
   - Run: `pnpm build`
   - Fix all errors

5. **Commit**
   - Write descriptive message
   - Follow convention: `feat(jobs): add filtering to jobs table`

6. **Push & PR**
   - Push to feature branch
   - Create PR with template
   - Add screenshots
   - Link to issue
   - Request review

7. **CI Checks**
   - Wait for GitHub Actions
   - Fix any failures
   - Respond to agent comments

8. **Review**
   - Address feedback
   - Make requested changes
   - Re-request review

9. **Merge**
   - Squash and merge
   - Delete feature branch
   - Verify deployed to Render

---

## Success Metrics

Track these for each PR:

- **Code Quality**
  - Zero lint errors
  - Zero type errors
  - Zero console warnings

- **Performance**
  - Build time < 2 minutes
  - Page load < 200ms
  - No layout shift

- **UX**
  - Zero dead-end clicks
  - All CTAs functional
  - Mobile responsive

- **Completeness**
  - All seeded data present
  - All empty states designed
  - All error states handled


---

## PR10: Shell Aesthetics v1 (100M SaaS upgrade)

**Branch:** `feature/pr10-shell-aesthetics`

### Allowed Files
- web/src/components/app/AppShell.tsx
- web/src/components/app/TopbarActions.tsx
- web/src/app/app/layout.tsx (only if required)
- web/src/app/globals.css (only if required)

### Done Criteria
- Sidebar redesigned to premium standard: spacing, hierarchy, active/hover/focus states
- Icon + label alignment refined; collapse rail feels intentional
- Topbar matches shell design and includes a first-class primary nav action slot
- No regressions across /app routes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR11: Calendar Upgrade v2 (Premium Scheduler)

**Branch:** `feature/pr11-calendar-v2`

### Allowed Files
- web/src/app/app/calendar/page.tsx

### Done Criteria
- Week/day/month views usable with premium UI
- Backlog sidebar present and drag-drop scheduling feels clean
- Event cards have proper status/priority visuals and conflict warnings
- No console errors
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR12: Marketplace Link in Topbar

**Branch:** `feature/pr12-topbar-marketplace-link`

### Allowed Files
- web/src/components/app/TopbarActions.tsx
- web/src/components/app/AppShell.tsx (only if required)

### Done Criteria
- Topbar includes “Marketplace” as a first-class nav action
- Navigates to `/market` in the same tab
- Styling matches the premium shell
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR13: Marketplace ↔ App Integration v1 (optional)

**Branch:** `feature/pr13-marketplace-app-integration`

### Allowed Files
- web/src/app/market/checkout/page.tsx
- web/src/app/app/jobs/page.tsx (only if required)

### Done Criteria
- Checkout success routes clearly into `/app/jobs`
- Jobs list shows the seeded created job and status
- No broken links between /market and /app
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR14: Calendar 100M SaaS Upgrade

**Branch:** `feature/pr14-calendar-upgrade`
**Status:** ✅ Complete

### Allowed Files
- web/src/app/app/calendar/page.tsx

### Done Criteria
- ✅ Enterprise calendar UI with Month/Week/Day views
- ✅ 30+ seeded events, color-coded by status/priority
- ✅ Search and filters (Status, Crew)
- ✅ Event details panel on click
- ✅ Drag & drop with toast notifications
- ✅ Color legend for event types
- ✅ Conflict detection with visual warnings
- ✅ Premium spacing and typography
- ✅ `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR15: Shell 100M SaaS Theme + Sidebar Upgrade

**Branch:** `feature/pr15-shell-theme-upgrade`
**Status:** ✅ Complete

### Allowed Files
- web/src/components/app/AppShell.tsx
- web/src/components/app/TopbarActions.tsx
- web/src/app/globals.css

### Done Criteria
- ✅ Grouped navigation with real SVG icons
- ✅ Premium active states with gradients
- ✅ Improved collapsed sidebar with tooltips
- ✅ Profile section at bottom
- ✅ CSS variables for consistent theming
- ✅ Enhanced typography and spacing
- ✅ `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR16: Calendar Spacing + Readability Polish

**Branch:** `feature/pr16-calendar-spacing`
**Status:** ✅ Complete

### Allowed Files
- web/src/app/app/calendar/page.tsx

### Done Criteria
- ✅ Increased vertical spacing (56px per step)
- ✅ Enhanced event card styling with better borders and rings
- ✅ Responsive layout (2-col on lg, 3-col on 2xl)
- ✅ Curated event data for optimal display
- ✅ Professional spacing throughout
- ✅ `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR17: Escrow Ops Admin Page

**Branch:** `feature/pr17-escrow-ops`
**Status:** ✅ Complete

### Allowed Files
- web/src/app/app/escrow/page.tsx

### Done Criteria
- ✅ Ops admin dashboard with pipeline view
- ✅ Evidence gating indicators
- ✅ Dispute workflow UI
- ✅ Bulk operations toolbar
- ✅ Professional styling matching shell
- ✅ `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR18: Escrow Buyer Portal

**Branch:** `feature/pr18-escrow-buyer`
**Status:** ✅ Complete

### Allowed Files
- web/src/app/escrow/page.tsx

### Done Criteria
- ✅ Buyer-facing escrow portal
- ✅ Milestone cards with progress
- ✅ Evidence upload UI
- ✅ Approve/Dispute actions
- ✅ Payment history and audit timeline
- ✅ Professional styling and empty states
- ✅ `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass

---

## PR19: Calendar + Dispatch Finish Polish

**Branch:** `feature/pr19-calendar-dispatch-polish`

### Allowed Files
- web/src/app/app/calendar/page.tsx
- web/src/app/dispatch/page.tsx
- docs/pr-implementation-checklists.md

### Done Criteria
- Premium overlay modal for event details with:
  - Job information display (id/title/client/site/crew/time/status)
  - Quick actions: Edit Booking, Duplicate, Mark Complete
  - Inline edit mode with dropdowns for day/time/duration/crew
  - Conflict warnings and priority badges
  - "View Full Job Details" link to `/app/jobs/[id]`
  - 90vh max-height, scrollable, readable spacing
- Dispatch page matches Calendar visual style:
  - Same grid spacing (56px per step)
  - Same event card styling
  - Backlog panel with drag affordance
  - Same overlay modal for scheduled items
  - Empty state card when backlog is empty
- Documentation updated with PR19 section
- PR18 marked as complete
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass
