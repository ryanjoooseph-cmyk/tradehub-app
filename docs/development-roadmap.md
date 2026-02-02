# TradeHub Development Roadmap

## Overview
This roadmap tracks the development phases from the current state through marketplace MVP, escrow v1, and automation agents, following the strict PR sequence defined in the manifest.

---

## Phase 1: Foundation Complete ✅
**Status:** SHIPPED  
**Timeline:** Completed  
**Deploy URL:** tradehub-app.onrender.com

### Completed Features
- ✅ AppShell with collapsible sidebar
- ✅ Topbar with search, notifications, theme toggle
- ✅ Navigation across all /app/* routes
- ✅ Light + Dark theme support
- ✅ Force-dynamic rendering configured
- ✅ Supabase integration active
- ✅ Render deployment pipeline
- ✅ GitHub Actions CI/CD

### Completed Pages
- ✅ Dashboard - Command Center with KPIs
- ✅ Jobs - Pipeline view with live priorities
- ✅ Calendar - Week view with drag-drop
- ✅ Clients - Directory with relationship intelligence
- ✅ Invoices - A/R with cashflow snapshots
- ✅ Escrow - Light/dark mode milestone tracking
- ✅ Team - Roster + capacity planning
- ✅ Settings - Environment, auth, integrations
- ✅ Dispatch - Calendar-based dispatch board

---

## Phase 2: Shell Hardening & Data Density (PR1-PR2)
**Status:** READY TO START  
**Timeline:** Week 1  
**Effort:** 2-3 days

### PR1: Shell Stability Hardening ⏳
**Goal:** Lock down AppShell, zero hydration warnings, perfect navigation

**Allowed Files:**
- `web/src/components/app/AppShell.tsx`
- `web/src/components/app/TopbarActions.tsx`
- `web/src/app/app/layout.tsx`

**Tasks:**
1. Test all navigation links across routes
2. Verify sidebar collapse state persists
3. Fix any hydration warnings in dev console
4. Ensure theme toggle works instantly
5. Test mobile sidebar behavior
6. Add keyboard shortcuts (⌘K for search)

**Done Criteria:**
- [ ] Zero hydration errors in dev console
- [ ] All NAV links navigate correctly
- [ ] Sidebar collapse state stable
- [ ] Theme toggle instant (no flash)
- [ ] Mobile sidebar auto-closes on nav
- [ ] Keyboard shortcuts documented

---

### PR2: Dashboard Density + Actions 🎯
**Goal:** Make dashboard feel alive with real metrics and actionable items

**Allowed Files:**
- `web/src/app/app/dashboard/page.tsx`
- `web/src/components/app/kpi.tsx`
- `web/src/components/app/shell/charts.tsx`
- `web/src/components/app/filled/section.tsx`

**Tasks:**
1. Enhance KPI grid with trend indicators
2. Add revenue trend chart (last 7 days)
3. Build crew utilization chart
4. Create Today's Focus section with seeded priorities
5. Add Live Feed with real-time updates
6. Make all metrics clickable → navigate to detail view

**Done Criteria:**
- [ ] KPIs show trend arrows (up/down)
- [ ] Revenue chart renders with 7-day data
- [ ] Crew utilization shows 69% with bar chart
- [ ] Today's Focus has 3+ actionable items
- [ ] Live Feed shows recent events
- [ ] No empty sections anywhere
- [ ] All sections link to relevant pages

---

## Phase 3: Jobs & Detail Views (PR3-PR4)
**Status:** QUEUED  
**Timeline:** Week 1-2  
**Effort:** 3-4 days

### PR3: Jobs List Enhancement 📋
**Goal:** Dense table view with filters, search, and quick actions

**Allowed Files:**
- `web/src/app/app/jobs/page.tsx`
- `web/src/components/app/filled/page.tsx`

**Tasks:**
1. Build filterable jobs table
2. Add search by job number, client, site
3. Add status filters (On Track, Waiting, At Risk)
4. Show risk indicators in table
5. Make rows clickable → /app/jobs/[id]
6. Add bulk actions toolbar
7. Seed with 15+ realistic jobs

**Done Criteria:**
- [ ] Table shows 15+ jobs with real data
- [ ] Search filters instantly
- [ ] Status pills color-coded
- [ ] Risk indicators visible
- [ ] Row click navigates to detail
- [ ] Bulk select + actions work
- [ ] Empty state designed

---

### PR4: Job Detail with Escrow Preview 🔍
**Goal:** Tabbed detail view with escrow milestones visible

**Allowed Files:**
- `web/src/app/app/jobs/[id]/page.tsx`

**Tasks:**
1. Build tab navigation (Overview, Milestones, Timeline, Files)
2. Overview tab: job summary, client info, team assigned
3. Milestones tab: escrow milestone cards with states
4. Timeline tab: audit event stream
5. Files tab: evidence uploads preview
6. Add quick actions toolbar
7. Show escrow status badge

**Done Criteria:**
- [ ] Tabs switch without layout shift
- [ ] Overview shows complete job details
- [ ] Milestones display with state badges
- [ ] Timeline shows chronological events
- [ ] Files tab shows upload placeholders
- [ ] Quick actions prominent
- [ ] Escrow status always visible

---

## Phase 4: Core Operations Pages (PR5)
**Status:** QUEUED  
**Timeline:** Week 2  
**Effort:** 3-4 days

### PR5: Clients, Invoices, Calendar Polish
**Goal:** Bring each page to production-ready state

**PR5a: Clients Page** 👥
**Allowed Files:**
- `web/src/app/app/clients/page.tsx`

**Tasks:**
1. Client directory with type badges (Strata, Management)
2. Portfolio summary (buildings, sites)
3. Client health signals (payment reliability, approval speed)
4. Relationship intelligence section
5. Quick actions (New Job, Send Invoice)

**Done Criteria:**
- [ ] Shows 10+ seeded clients
- [ ] Type badges styled
- [ ] Health signals color-coded
- [ ] Portfolio counts accurate
- [ ] Quick actions functional

---

**PR5b: Invoices Page** 💰
**Allowed Files:**
- `web/src/app/app/invoices/page.tsx`

**Tasks:**
1. Accounts receivable table
2. Status filters (Sent, Paid, Overdue)
3. Cashflow snapshot (next 7 days)
4. Automation rules section
5. One-click actions (Send Reminder, Escalate)

**Done Criteria:**
- [ ] Table shows 10+ invoices
- [ ] Status color-coded
- [ ] Cashflow accurate
- [ ] Automation rules visible
- [ ] Quick actions work

---

**PR5c: Calendar Page** 📅
**Allowed Files:**
- `web/src/app/app/calendar/page.tsx`

**Tasks:**
1. Week view with hourly slots
2. Job cards draggable
3. Conflict detection active
4. Smart scheduling toggle
5. Crew allocation visible
6. Day/Week/Month view toggle

**Done Criteria:**
- [ ] Week view renders cleanly
- [ ] Jobs draggable (UI feedback)
- [ ] Conflicts highlighted
- [ ] View toggles work
- [ ] Crew names on cards

---

## Phase 5: Marketplace MVP (PR6)
**Status:** QUEUED  
**Timeline:** Week 3  
**Effort:** 5-6 days

### PR6: Marketplace Route Group 🏪
**Goal:** New route group for lead capture and job booking

**Allowed Files:**
- `web/src/app/market/*` (new)
- `web/src/components/app/*` (reuse only)

**Tasks:**
1. Create /market layout (separate from /app shell)
2. Build /market landing page
3. Build /market/post-job flow
4. Build /market/jobs/[id] job detail
5. Build /market/checkout escrow funding
6. Provider matching UI
7. Quote submission flow
8. Verification uploads (licenses, insurance)
9. Review system integration

**Done Criteria:**
- [ ] /market route group separate
- [ ] Post job form complete
- [ ] Job detail shows provider quotes
- [ ] Checkout creates escrow milestones
- [ ] Provider can submit quote
- [ ] Verification upload works
- [ ] Reviews display after completion
- [ ] Job creation wired to /app/jobs

**Domain Objects Created:**
- Job (shared with /app)
- Quote
- Milestone (shared with escrow)
- ProviderVerification
- Review

---

## Phase 6: Escrow v1 (PR7)
**Status:** QUEUED  
**Timeline:** Week 4  
**Effort:** 5-7 days

### PR7: Escrow Admin + Buyer Portal 🔒
**Goal:** Dual escrow interfaces - ops admin + buyer self-service

**Allowed Files:**
- `web/src/app/app/escrow/page.tsx`
- `web/src/app/escrow/page.tsx` (buyer portal)

**Tasks - Ops Admin (/app/escrow):**
1. All escrow transactions table
2. Filter by status (Funded, Ready to Release, Disputed)
3. Bulk release approval
4. Risk score indicators
5. Evidence completeness checks
6. Inspector assignment UI
7. Dispute resolution workflow

**Tasks - Buyer Portal (/escrow):**
1. Milestone status cards
2. Evidence upload interface
3. Approval/dispute buttons
4. Audit timeline view
5. Inspector report viewing
6. Payment history

**Done Criteria:**
- [ ] Ops admin shows all escrow activity
- [ ] Buyer portal isolated per client
- [ ] Evidence uploads work
- [ ] Approval triggers state change
- [ ] Dispute flow initiates correctly
- [ ] Inspector can be assigned
- [ ] Audit events logged
- [ ] State machine enforced

**State Machine Implementation:**
```
DRAFT → FUNDED → WORK_SUBMITTED → EVIDENCE_REVIEW → RELEASED
                                                  ↓
                                              DISPUTED → INSPECTOR_ASSIGNED → RESOLVED
```

---

## Phase 7: Automation Agents v1 (PR8)
**Status:** QUEUED  
**Timeline:** Week 5-6  
**Effort:** 7-10 days

### PR8: OpenAI Agent Integration 🤖
**Goal:** Activate 6 automation agents for workflow acceleration

**Allowed Files:**
- `web/src/app/api/agent/*` (new)
- `docs/agents/*` (new)
- `.github/workflows/*` (update)

**Agents to Build:**

#### 1. Release Manager Agent
**Trigger:** On pull request  
**Actions:**
- Validates PR checklist
- Confirms all commands passed (lint, typecheck, build)
- Generates changelog from commits
- Blocks merge if risky files changed
- Comments on PR with status

**Done Criteria:**
- [ ] Runs on every PR
- [ ] Checklist validation works
- [ ] Changelog auto-generated
- [ ] Blocks risky merges
- [ ] Comments posted to PR

---

#### 2. CI Triage Agent
**Trigger:** On CI failure  
**Actions:**
- Reads failing test logs
- Classifies root cause (type error, runtime error, lint)
- Suggests minimal fix
- Comments on PR with diagnosis

**Done Criteria:**
- [ ] Activates on test failures
- [ ] Classifies error types
- [ ] Provides fix suggestions
- [ ] Comments helpful

---

#### 3. Regression Guard Agent
**Trigger:** On PR with UI changes  
**Actions:**
- Takes screenshots of changed routes
- Compares against baseline
- Flags visual regressions
- Suggests Playwright tests

**Done Criteria:**
- [ ] Detects UI changes
- [ ] Compares screenshots
- [ ] Flags regressions
- [ ] Test suggestions useful

---

#### 4. Support Triage Agent
**Trigger:** New support ticket  
**Actions:**
- Parses ticket into structured task
- Extracts job ID, milestone ID
- Assigns severity level
- Routes to correct team member

**Done Criteria:**
- [ ] Parses tickets correctly
- [ ] Extracts IDs accurately
- [ ] Severity levels reasonable
- [ ] Routing works

---

#### 5. Dispute Assistant Agent (Advisory Only)
**Trigger:** Dispute opened  
**Actions:**
- Summarizes evidence from both sides
- Highlights missing evidence
- Proposes resolution options
- **NEVER auto-decides**

**Done Criteria:**
- [ ] Summarizes evidence clearly
- [ ] Identifies gaps
- [ ] Options reasonable
- [ ] Never auto-releases funds
- [ ] Logs recommendation as audit event

---

#### 6. Data Entry Agent
**Trigger:** Email/photo received  
**Actions:**
- Converts email to structured job notes
- Extracts data from photos (invoices, receipts)
- Creates draft entries
- **Requires human review**

**Done Criteria:**
- [ ] Email parsing works
- [ ] Photo OCR functional
- [ ] Draft entries created
- [ ] Human review required
- [ ] Audit logged

---

**Agent Infrastructure:**
- `POST /api/agent/release-manager`
- `POST /api/agent/ci-triage`
- `POST /api/agent/regression-guard`
- `POST /api/agent/support-triage`
- `POST /api/agent/dispute-assistant`
- `POST /api/agent/data-entry`

**Storage:**
- All agent outputs saved as `AuditEvent` records
- Agent actions traceable in timeline
- Failed agent runs logged

---

## Phase 8: Blockchain Anchoring (Optional)
**Status:** FUTURE  
**Timeline:** TBD  
**Effort:** 10-15 days

### Goals:
- Implement Merkle tree batching
- Anchor to Polygon/Ethereum testnet
- Build proof verification UI
- Add "Verify audit trail" button
- Optional toggle in settings

### Tasks:
1. Merkle tree implementation
2. Batch hashing every N events
3. Smart contract deployment
4. Anchoring service
5. Proof verification API
6. UI for viewing proofs

**Done Criteria:**
- [ ] Merkle root generated
- [ ] Anchored to chain
- [ ] Proof retrievable
- [ ] Verification UI works
- [ ] Optional (can disable)

---

## Phase 9: Marketplace Enhancements
**Status:** FUTURE  
**Timeline:** TBD  
**Effort:** 5-7 days

### Features:
- Algorithm-based provider matching
- Advanced search/filters
- Provider profiles with portfolios
- Fraud/risk signals
- Quote comparison tools
- Automated follow-ups

---

## Phase 10: Advanced Automation
**Status:** FUTURE  
**Timeline:** TBD  
**Effort:** 10-15 days

### Features:
- Job creation from leads
- Follow-up reminder automation
- Missing doc chasing
- Scheduling suggestions
- Risk scoring automation
- Compliance reporting

---

## Success Metrics by Phase

### Phase 2-4 (Operations Core)
- Zero dead-end clicks
- All pages have seeded data
- No empty states without design
- Sub-200ms page loads
- Zero hydration warnings

### Phase 5 (Marketplace)
- Lead → Job conversion tracked
- Quote submission < 2 minutes
- Escrow funding 1-click
- Provider verification < 1 day

### Phase 6 (Escrow)
- Milestone state transitions logged
- Evidence gating enforced
- Dispute workflow complete
- Inspector assignment functional

### Phase 7 (Agents)
- PR triage time < 5 minutes
- Dispute evidence summary < 1 minute
- Support ticket routing 100% accurate
- Agent audit events logged

---

## Dependencies Map

```
PR1 (Shell) ────────────┐
                        ├──→ PR2 (Dashboard)
PR3 (Jobs List) ────────┤
                        ├──→ PR4 (Job Detail)
                        │
PR5a (Clients) ─────────┤
PR5b (Invoices) ────────┼──→ PR6 (Marketplace)
PR5c (Calendar) ────────┤
                        │
                        └──→ PR7 (Escrow) ──→ PR8 (Agents)
```

---

## Current Status Summary

**Completed:** Phase 1 (Foundation)  
**In Progress:** None  
**Next Up:** PR1 (Shell Hardening)  
**Blocked:** None  
**At Risk:** None  

**Overall Progress:** 30% complete (3 of 10 phases shipped)

---

## Recommended Next Steps

1. **This Week:** Complete PR1 (Shell) + PR2 (Dashboard)
2. **Next Week:** Complete PR3 (Jobs) + PR4 (Job Detail)
3. **Week 3:** Complete PR5 (Clients/Invoices/Calendar)
4. **Week 4:** Start PR6 (Marketplace MVP)
5. **Week 5-6:** PR7 (Escrow) + PR8 (Agents)

**Target Launch:** 6 weeks from now with Phases 1-7 complete.

