# TradeHub Technical Specification
**Version:** 4.2  
**Date:** 2026-02-01  
**Status:** Active Development

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Domain Model](#domain-model)
4. [API Specifications](#api-specifications)
5. [State Machines](#state-machines)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [Escrow Engine](#escrow-engine)
9. [Automation Agents](#automation-agents)
10. [Deployment](#deployment)

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.x
- **UI Components:** Custom components + shadcn/ui patterns
- **Theme:** next-themes (light/dark mode)
- **Forms:** React Hook Form + Zod validation
- **State:** React Context + Server Components
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js 20
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Realtime:** Supabase Realtime
- **API:** Next.js API Routes
- **Validation:** Zod schemas

### Infrastructure
- **Hosting:** Render Web Service
- **Database:** Supabase Cloud
- **CI/CD:** GitHub Actions
- **Package Manager:** pnpm 9.x
- **Node Version Manager:** corepack

### Integrations
- **OpenAI:** GPT-4 for automation agents
- **GitHub:** PR/CI automation
- **Stripe:** (Future) Payment processing
- **Blockchain:** (Future) Merkle tree anchoring

---

## Project Structure

```
tradehub/
├── web/                          # Next.js application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── providers.tsx    # Theme provider
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── app/             # Ops OS route group
│   │   │   │   ├── layout.tsx   # AppShell wrapper
│   │   │   │   ├── dashboard/
│   │   │   │   ├── jobs/
│   │   │   │   ├── calendar/
│   │   │   │   ├── clients/
│   │   │   │   ├── invoices/
│   │   │   │   ├── escrow/
│   │   │   │   ├── team/
│   │   │   │   └── settings/
│   │   │   ├── market/          # Marketplace route group (future)
│   │   │   ├── escrow/          # Buyer portal (future)
│   │   │   ├── dispatch/        # Dispatch board
│   │   │   └── api/             # API routes
│   │   │       ├── jobs/
│   │   │       ├── clients/
│   │   │       ├── invoices/
│   │   │       ├── escrow/
│   │   │       ├── agent/       # Agent endpoints
│   │   │       └── health/
│   │   ├── components/
│   │   │   ├── app/             # App-specific components
│   │   │   │   ├── AppShell.tsx
│   │   │   │   ├── TopbarActions.tsx
│   │   │   │   ├── filled/      # Data-filled components
│   │   │   │   └── shell/       # Structure components
│   │   │   └── ui/              # Reusable UI primitives
│   │   ├── lib/                 # Utilities
│   │   │   ├── supabase.ts
│   │   │   ├── openai.ts
│   │   │   └── utils.ts
│   │   └── types/               # TypeScript types
│   ├── public/                  # Static assets
│   └── package.json
├── .github/
│   └── workflows/
│       └── web-build.yml        # CI pipeline
├── pnpm-lock.yaml
└── package.json                 # Root workspace
```

---

## Domain Model

### Core Entities

#### Client (Buyer)
```typescript
type Client = {
  id: string                     // UUID
  name: string
  email: string
  phone?: string
  company?: string
  type: 'Strata' | 'Management' | 'Commercial' | 'Residential'
  portfolio: {
    buildings?: number
    sites?: string[]
  }
  status: 'Active' | 'Warm' | 'Inactive'
  paymentReliability: 'High' | 'Medium' | 'Low'
  approvalSpeed: 'Fast' | 'Medium' | 'Slow'
  scopeVolatility: 'Low' | 'Medium' | 'High'
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

#### Provider (Trade Business)
```typescript
type Provider = {
  id: string
  businessName: string
  abn: string
  email: string
  phone: string
  category: string[]             // ['painting', 'plumbing', ...]
  licenses: {
    type: string
    number: string
    expiresAt: Date
    documentUrl: string
  }[]
  insurance: {
    type: string
    provider: string
    policyNumber: string
    expiresAt: Date
    documentUrl: string
  }[]
  verified: boolean
  verifiedAt?: Date
  rating: number                 // 0-5
  reviewCount: number
  completedJobs: number
  location: string
  serviceAreas: string[]
  portfolio: string[]            // Photo URLs
  createdAt: Date
  updatedAt: Date
}
```

#### Job
```typescript
type Job = {
  id: string
  jobNumber: string              // e.g., "J-1402"
  clientId: string               // FK to Client
  providerId?: string            // FK to Provider
  status: JobStatus
  category: string
  site: {
    address: string
    level?: string
    access?: string
  }
  scope: string
  scheduledStart?: Date
  scheduledEnd?: Date
  actualStart?: Date
  actualEnd?: Date
  value: number
  risk: 'Low' | 'Medium' | 'High'
  riskScore: number              // 0-10
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

enum JobStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
  ARCHIVED = 'ARCHIVED',
  CANCELLED = 'CANCELLED'
}
```

#### Quote
```typescript
type Quote = {
  id: string
  jobId: string                  // FK to Job
  providerId: string             // FK to Provider
  amount: number
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  milestones: {
    title: string
    amount: number
    dueDate?: Date
    description?: string
  }[]
  timeline: string
  notes?: string
  status: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED'
  submittedAt?: Date
  acceptedAt?: Date
  createdAt: Date
}
```

#### Milestone
```typescript
type Milestone = {
  id: string
  jobId: string                  // FK to Job
  quoteId?: string               // FK to Quote
  title: string
  amount: number
  state: MilestoneState
  evidenceRequirements: {
    photos: number               // Min photos required
    checklistRequired: boolean
    notesRequired: boolean
  }
  evidence: Evidence[]
  fundedAt?: Date
  submittedAt?: Date
  reviewedAt?: Date
  releasedAt?: Date
  disputeId?: string
  createdAt: Date
}

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

#### Evidence
```typescript
type Evidence = {
  id: string
  milestoneId: string            // FK to Milestone
  type: 'photo' | 'checklist' | 'notes' | 'document'
  url?: string                   // For photos/documents
  data?: Record<string, any>     // For checklist/notes
  metadata: {
    uploadedBy: string
    filename?: string
    size?: number
    mimeType?: string
  }
  submittedAt: Date
}
```

#### Dispute
```typescript
type Dispute = {
  id: string
  milestoneId: string            // FK to Milestone
  state: DisputeState
  openedBy: string               // Client or Provider ID
  reason: string
  description: string
  evidence: Evidence[]
  inspectorId?: string           // FK to Inspector
  inspectorReport?: {
    findings: string
    photos: string[]
    recommendation: 'RELEASE' | 'REFUND' | 'PARTIAL'
    amount?: number              // If PARTIAL
    submittedAt: Date
  }
  decision?: {
    outcome: 'RELEASE' | 'REFUND' | 'PARTIAL'
    amount?: number
    reason: string
    decidedBy: string
    decidedAt: Date
  }
  openedAt: Date
  resolvedAt?: Date
}

enum DisputeState {
  OPEN = 'OPEN',
  EVIDENCE_REQUESTED = 'EVIDENCE_REQUESTED',
  INSPECTOR_ASSIGNED = 'INSPECTOR_ASSIGNED',
  REPORT_SUBMITTED = 'REPORT_SUBMITTED',
  DECISION = 'DECISION',
  CLOSED = 'CLOSED'
}
```

#### Inspector
```typescript
type Inspector = {
  id: string
  name: string
  email: string
  phone: string
  certifications: {
    type: string
    number: string
    issuedBy: string
    expiresAt: Date
  }[]
  specialties: string[]
  thirdParty: boolean
  active: boolean
  createdAt: Date
}
```

#### Invoice
```typescript
type Invoice = {
  id: string
  invoiceNumber: string          // e.g., "INV-22018"
  jobId: string                  // FK to Job
  clientId: string               // FK to Client
  amount: number
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  dueDate: Date
  paidAt?: Date
  notes?: string
  createdAt: Date
}
```

#### TeamMember
```typescript
type TeamMember = {
  id: string
  providerId: string             // FK to Provider
  name: string
  email: string
  phone?: string
  role: 'Owner' | 'Ops' | 'Supervisor' | 'Crew' | 'Contractor'
  skills: string[]
  certifications: {
    type: string                 // e.g., "IRATA", "EWP"
    level?: string
    expiresAt?: Date
  }[]
  status: 'Active' | 'On Site' | 'Available' | 'Off Duty'
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  createdAt: Date
}
```

#### Review
```typescript
type Review = {
  id: string
  jobId: string                  // FK to Job
  clientId: string               // FK to Client
  providerId: string             // FK to Provider
  rating: number                 // 1-5
  comment: string
  photos?: string[]
  response?: {
    text: string
    respondedAt: Date
  }
  createdAt: Date
}
```

#### AuditEvent
```typescript
type AuditEvent = {
  id: string
  jobId?: string                 // Optional FK to Job
  milestoneId?: string           // Optional FK to Milestone
  disputeId?: string             // Optional FK to Dispute
  eventType: AuditEventType
  payload: Record<string, any>
  actor: string                  // User ID or "system" or "agent:name"
  timestamp: Date
  merkleHash?: string            // Future: for blockchain anchoring
}

enum AuditEventType {
  // Job events
  JOB_CREATED = 'JOB_CREATED',
  JOB_SCHEDULED = 'JOB_SCHEDULED',
  JOB_STARTED = 'JOB_STARTED',
  JOB_COMPLETED = 'JOB_COMPLETED',
  
  // Milestone events
  MILESTONE_CREATED = 'MILESTONE_CREATED',
  MILESTONE_FUNDED = 'MILESTONE_FUNDED',
  WORK_SUBMITTED = 'WORK_SUBMITTED',
  EVIDENCE_UPLOADED = 'EVIDENCE_UPLOADED',
  MILESTONE_APPROVED = 'MILESTONE_APPROVED',
  MILESTONE_RELEASED = 'MILESTONE_RELEASED',
  
  // Dispute events
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_EVIDENCE_SUBMITTED = 'DISPUTE_EVIDENCE_SUBMITTED',
  INSPECTOR_ASSIGNED = 'INSPECTOR_ASSIGNED',
  INSPECTOR_REPORT_SUBMITTED = 'INSPECTOR_REPORT_SUBMITTED',
  DISPUTE_DECISION = 'DISPUTE_DECISION',
  DISPUTE_CLOSED = 'DISPUTE_CLOSED',
  
  // Invoice events
  INVOICE_CREATED = 'INVOICE_CREATED',
  INVOICE_SENT = 'INVOICE_SENT',
  INVOICE_PAID = 'INVOICE_PAID',
  
  // Agent events
  AGENT_RECOMMENDATION = 'AGENT_RECOMMENDATION',
  AGENT_ERROR = 'AGENT_ERROR'
}
```

---

## API Specifications

### REST API Conventions

**Base URL:** `/api`

**Authentication:** Bearer token in `Authorization` header

**Response Format:**
```typescript
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}
```

### Job Endpoints

#### GET /api/jobs
List all jobs with filtering and pagination.

**Query Parameters:**
```typescript
{
  status?: JobStatus[]           // Filter by status
  clientId?: string              // Filter by client
  providerId?: string            // Filter by provider
  risk?: ('Low' | 'Medium' | 'High')[]
  search?: string                // Search job number, client, site
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'scheduledStart' | 'value'
  sortOrder?: 'asc' | 'desc'
}
```

**Response:**
```typescript
{
  success: true,
  data: Job[],
  meta: {
    page: 1,
    limit: 20,
    total: 45
  }
}
```

#### GET /api/jobs/[id]
Get job details by ID.

**Response:**
```typescript
{
  success: true,
  data: Job & {
    client: Client
    provider?: Provider
    milestones: Milestone[]
    quotes: Quote[]
    invoices: Invoice[]
    team: TeamMember[]
    auditEvents: AuditEvent[]
  }
}
```

#### POST /api/jobs
Create a new job.

**Request Body:**
```typescript
{
  clientId: string
  category: string
  site: {
    address: string
    level?: string
  }
  scope: string
  scheduledStart?: string        // ISO date
  value: number
}
```

**Response:**
```typescript
{
  success: true,
  data: Job
}
```

#### PATCH /api/jobs/[id]
Update job details.

**Request Body:** Partial<Job>

**Response:** Updated Job

#### POST /api/jobs/[id]/submit
Mark work as submitted (milestone gating).

**Request Body:**
```typescript
{
  milestoneId: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    job: Job
    milestone: Milestone
    auditEvent: AuditEvent
  }
}
```

### Milestone Endpoints

#### GET /api/milestones/[id]
Get milestone details.

#### POST /api/milestones/[id]/evidence
Upload evidence for milestone.

**Request Body:**
```typescript
{
  type: 'photo' | 'checklist' | 'notes'
  url?: string                   // For photo uploads
  data?: Record<string, any>     // For checklist/notes
}
```

#### POST /api/milestones/[id]/approve
Approve milestone for release.

**Request Body:**
```typescript
{
  approvedBy: string
}
```

#### POST /api/milestones/[id]/dispute
Open a dispute on milestone.

**Request Body:**
```typescript
{
  reason: string
  description: string
  evidence?: Evidence[]
}
```

### Escrow Endpoints

#### GET /api/escrow
List all escrow transactions (admin).

**Query Parameters:**
```typescript
{
  status?: MilestoneState[]
  jobId?: string
  clientId?: string
}
```

#### POST /api/escrow/[id]/release
Release funds from escrow.

**Request Body:**
```typescript
{
  releasedBy: string
  notes?: string
}
```

**Response:** Includes audit event

### Agent Endpoints

#### POST /api/agent/release-manager
Run release manager agent on PR.

**Request Body:**
```typescript
{
  prNumber: number
  repository: string
  commits: string[]
  changedFiles: string[]
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    checklistStatus: 'complete' | 'incomplete'
    ciStatus: 'passing' | 'failing'
    riskAssessment: 'low' | 'medium' | 'high'
    changelog: string
    recommendation: 'APPROVE' | 'BLOCK'
    reason: string
  }
}
```

#### POST /api/agent/ci-triage
Triage CI failures.

**Request Body:**
```typescript
{
  logs: string
  failedTests: string[]
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    errorType: 'typescript' | 'eslint' | 'runtime' | 'build'
    rootCause: string
    affectedFile: string
    lineNumber?: number
    suggestedFix: string
  }
}
```

#### POST /api/agent/dispute-assistant
Get dispute resolution recommendation.

**Request Body:**
```typescript
{
  disputeId: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    providerCase: string
    clientCase: string
    missingEvidence: string[]
    recommendedOutcome: 'RELEASE' | 'REFUND' | 'PARTIAL'
    suggestedAmount?: number
    reasoning: string
    confidence: number           // 0-1
  }
}
```

---

## State Machines

### Milestone State Transitions

```
DRAFT
  ↓ (Client funds escrow)
FUNDED
  ↓ (Provider submits work)
WORK_SUBMITTED
  ↓ (Provider uploads evidence)
EVIDENCE_REVIEW
  ↓ (Client approves OR low risk auto-approve)
RELEASED ──→ [END]
  
EVIDENCE_REVIEW
  ↓ (Client disputes)
DISPUTED
  ↓ (Admin assigns inspector)
INSPECTOR_ASSIGNED
  ↓ (Inspector submits report)
RESOLVED
  ↓ (Admin makes decision)
  ├─→ RELEASED [END]
  ├─→ REFUNDED [END]
  └─→ PARTIAL_RELEASE [END]
```

**Validation Rules:**
- Cannot skip states
- Cannot go backwards (except dispute resolution)
- State changes must be logged as audit events
- Certain transitions require evidence (configurable by risk)

### Job State Transitions

```
DRAFT
  ↓ (Schedule confirmed)
SCHEDULED
  ↓ (Work starts)
IN_PROGRESS
  ↓ (Work completes)
COMPLETE
  ↓ (Invoice generated)
INVOICED
  ↓ (Payment received)
PAID
  ↓ (Archive after N days)
ARCHIVED ──→ [END]

DRAFT/SCHEDULED/IN_PROGRESS
  ↓ (Cancel)
CANCELLED ──→ [END]
```

### Dispute State Transitions

```
OPEN
  ↓ (Request additional evidence)
EVIDENCE_REQUESTED
  ↓ (Assign inspector)
INSPECTOR_ASSIGNED
  ↓ (Inspector files report)
REPORT_SUBMITTED
  ↓ (Admin reviews)
DECISION
  ↓ (Decision finalized)
CLOSED ──→ [END]
```

---

## Database Schema

### Supabase Tables

**clients**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  type TEXT CHECK (type IN ('Strata', 'Management', 'Commercial', 'Residential')),
  portfolio JSONB DEFAULT '{}',
  status TEXT DEFAULT 'Active',
  payment_reliability TEXT,
  approval_speed TEXT,
  scope_volatility TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_status ON clients(status);
```

**providers**
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  abn TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  category TEXT[] DEFAULT '{}',
  licenses JSONB DEFAULT '[]',
  insurance JSONB DEFAULT '[]',
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  completed_jobs INT DEFAULT 0,
  location TEXT,
  service_areas TEXT[] DEFAULT '{}',
  portfolio TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_providers_verified ON providers(verified);
CREATE INDEX idx_providers_category ON providers USING GIN(category);
```

**jobs**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN (
    'DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETE', 
    'INVOICED', 'PAID', 'ARCHIVED', 'CANCELLED'
  )),
  category TEXT NOT NULL,
  site JSONB NOT NULL,
  scope TEXT NOT NULL,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  value DECIMAL(10,2) NOT NULL,
  risk TEXT CHECK (risk IN ('Low', 'Medium', 'High')),
  risk_score INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_jobs_provider_id ON jobs(provider_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_risk ON jobs(risk);
CREATE INDEX idx_jobs_job_number ON jobs(job_number);
```

**milestones**
```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  state TEXT NOT NULL CHECK (state IN (
    'DRAFT', 'FUNDED', 'WORK_SUBMITTED', 'EVIDENCE_REVIEW',
    'RELEASED', 'DISPUTED', 'INSPECTOR_ASSIGNED', 'RESOLVED'
  )),
  evidence_requirements JSONB DEFAULT '{}',
  funded_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  dispute_id UUID REFERENCES disputes(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_milestones_job_id ON milestones(job_id);
CREATE INDEX idx_milestones_state ON milestones(state);
```

**evidence**
```sql
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'checklist', 'notes', 'document')),
  url TEXT,
  data JSONB,
  metadata JSONB DEFAULT '{}',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_milestone_id ON evidence(milestone_id);
```

**disputes**
```sql
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  state TEXT NOT NULL CHECK (state IN (
    'OPEN', 'EVIDENCE_REQUESTED', 'INSPECTOR_ASSIGNED',
    'REPORT_SUBMITTED', 'DECISION', 'CLOSED'
  )),
  opened_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  inspector_id UUID REFERENCES inspectors(id),
  inspector_report JSONB,
  decision JSONB,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_disputes_milestone_id ON disputes(milestone_id);
CREATE INDEX idx_disputes_state ON disputes(state);
```

**audit_events**
```sql
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  milestone_id UUID REFERENCES milestones(id),
  dispute_id UUID REFERENCES disputes(id),
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  actor TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  merkle_hash TEXT
);

CREATE INDEX idx_audit_events_job_id ON audit_events(job_id);
CREATE INDEX idx_audit_events_milestone_id ON audit_events(milestone_id);
CREATE INDEX idx_audit_events_event_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_timestamp ON audit_events(timestamp DESC);
```

### Row Level Security (RLS)

Enable RLS on all tables and define policies:

```sql
-- Example: Clients can only see their own jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Providers see assigned jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = provider_id);

-- Admins see all
CREATE POLICY "Admins see all jobs"
  ON jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE id = auth.uid() AND role = 'Owner'
    )
  );
```

---

## Authentication & Authorization

### Supabase Auth

**User Types:**
- Client (buyer)
- Provider (trade business)
- TeamMember (provider's team)
- Admin (platform)

**Auth Flow:**
1. User signs up via Supabase Auth
2. Profile created in respective table
3. JWT includes user role in claims
4. RLS policies enforce access control

**Role Mapping:**
```typescript
type UserRole = 
  | 'client'
  | 'provider'
  | 'team_member'
  | 'admin'

type AuthContext = {
  userId: string
  role: UserRole
  email: string
}
```

### Protected API Routes

All API routes under `/api/` require authentication:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session && req.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  
  return res
}
```

---

## Escrow Engine

### Risk Scoring Algorithm

```typescript
function calculateRiskScore(job: Job, client: Client, provider: Provider): number {
  let score = 0
  
  // Job value
  if (job.value > 50000) score += 3
  else if (job.value > 10000) score += 1
  
  // Client history
  if (client.paymentReliability === 'Low') score += 2
  if (client.approvalSpeed === 'Slow') score += 1
  
  // Provider history
  if (!provider.verified) score += 2
  if (provider.completedJobs < 5) score += 1
  
  // Category risk
  const highRiskCategories = ['roofing', 'structural', 'electrical']
  if (highRiskCategories.includes(job.category)) score += 1
  
  return Math.min(score, 10)  // Cap at 10
}
```

### Evidence Requirements by Risk

```typescript
function getEvidenceRequirements(riskScore: number): EvidenceRequirements {
  if (riskScore <= 3) {
    return {
      photos: 0,
      checklistRequired: false,
      notesRequired: false
    }
  } else if (riskScore <= 6) {
    return {
      photos: 2,
      checklistRequired: true,
      notesRequired: false
    }
  } else {
    return {
      photos: 5,
      checklistRequired: true,
      notesRequired: true
    }
  }
}
```

### Release Validation

```typescript
async function validateMilestoneRelease(milestoneId: string): Promise<ValidationResult> {
  const milestone = await getMilestone(milestoneId)
  const job = await getJob(milestone.jobId)
  const evidence = await getEvidence(milestoneId)
  
  const requirements = getEvidenceRequirements(job.riskScore)
  const photoCount = evidence.filter(e => e.type === 'photo').length
  const hasChecklist = evidence.some(e => e.type === 'checklist')
  const hasNotes = evidence.some(e => e.type === 'notes')
  
  const errors: string[] = []
  
  if (photoCount < requirements.photos) {
    errors.push(`Requires ${requirements.photos} photos, only ${photoCount} uploaded`)
  }
  
  if (requirements.checklistRequired && !hasChecklist) {
    errors.push('Checklist required but not completed')
  }
  
  if (requirements.notesRequired && !hasNotes) {
    errors.push('Completion notes required but not provided')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## Automation Agents

### Agent Architecture

All agents follow this pattern:

```typescript
type AgentInput = {
  context: Record<string, any>
  task: string
}

type AgentOutput = {
  success: boolean
  recommendation: any
  reasoning: string
  confidence: number       // 0-1
  auditEventId: string
}

abstract class Agent {
  abstract name: string
  abstract systemPrompt: string
  
  async run(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()
    
    try {
      // Call OpenAI API
      const response = await this.callOpenAI(input)
      
      // Log as audit event
      const auditEvent = await this.logAuditEvent({
        eventType: 'AGENT_RECOMMENDATION',
        actor: `agent:${this.name}`,
        payload: {
          input,
          output: response,
          duration: Date.now() - startTime
        }
      })
      
      return {
        success: true,
        recommendation: response.recommendation,
        reasoning: response.reasoning,
        confidence: response.confidence,
        auditEventId: auditEvent.id
      }
    } catch (error) {
      // Log error as audit event
      await this.logAuditEvent({
        eventType: 'AGENT_ERROR',
        actor: `agent:${this.name}`,
        payload: {
          error: error.message,
          input
        }
      })
      
      throw error
    }
  }
  
  private async callOpenAI(input: AgentInput) {
    // OpenAI API call implementation
  }
  
  private async logAuditEvent(event: Partial<AuditEvent>) {
    // Save to database
  }
}
```

### Dispute Assistant Implementation

```typescript
class DisputeAssistant extends Agent {
  name = 'dispute-assistant'
  
  systemPrompt = `
    You are a dispute resolution assistant for a trades platform.
    Your role is to analyze evidence from both parties and recommend a fair resolution.
    
    CRITICAL: You provide recommendations only. You NEVER make final decisions.
    
    Analyze:
    1. Provider's evidence (photos, notes, checklist)
    2. Client's dispute reason and evidence
    3. Missing or conflicting information
    
    Recommend ONE of:
    - RELEASE: Full payment to provider
    - REFUND: Full refund to client
    - PARTIAL: Split payment (specify amount)
    
    Include:
    - Summary of each side's case
    - Missing evidence
    - Reasoning for recommendation
    - Confidence level (0-1)
  `
  
  async analyzeDispute(disputeId: string): Promise<DisputeRecommendation> {
    const dispute = await getDispute(disputeId)
    const milestone = await getMilestone(dispute.milestoneId)
    const providerEvidence = await getEvidence(milestone.id)
    const clientEvidence = dispute.evidence
    
    const input: AgentInput = {
      context: {
        dispute,
        milestone,
        providerEvidence,
        clientEvidence
      },
      task: 'Analyze this dispute and recommend a resolution'
    }
    
    return this.run(input)
  }
}
```

---

## Deployment

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenAI
OPENAI_API_KEY=sk-xxx...

# GitHub
GITHUB_TOKEN=ghp_xxx...
GITHUB_WEBHOOK_SECRET=xxx...

# App
NEXT_PUBLIC_APP_URL=https://tradehub-app.onrender.com
NODE_ENV=production
PORT=3000
```

### Render Configuration

**Build Command:**
```bash
corepack enable && corepack prepare pnpm@9.15.0 --activate && pnpm install --frozen-lockfile && pnpm build
```

**Start Command:**
```bash
corepack enable && corepack prepare pnpm@9.15.0 --activate && pnpm start
```

**Health Check:**
```bash
GET /api/health
```

### CI/CD Pipeline

See `.github/workflows/web-build.yml`:

1. Checkout code
2. Setup pnpm
3. Install dependencies
4. Run lint
5. Run typecheck
6. Run build
7. (Optional) Run agent checks

### Monitoring

**Key Metrics:**
- API response times
- Error rates
- Database query performance
- Agent execution times
- Escrow release latency

**Tools:**
- Supabase Dashboard (queries, auth)
- Render Metrics (uptime, resources)
- OpenAI Usage Dashboard (tokens, costs)

---

## Performance Targets

- **Page Load:** < 200ms (server-rendered)
- **API Response:** < 100ms (simple queries)
- **Build Time:** < 2 minutes
- **Agent Response:** < 5 seconds (simple tasks)
- **Database Queries:** < 50ms (indexed queries)

---

## Security Considerations

1. **Never store PII on blockchain** (future)
2. **All API routes require auth**
3. **RLS policies on all tables**
4. **Evidence stored in Supabase Storage** (private buckets)
5. **Agents log all actions** (full auditability)
6. **No agent auto-decisions on critical actions** (disputes, releases)
7. **Rate limiting on agent endpoints**
8. **Input validation on all endpoints** (Zod schemas)

---

## Future Enhancements

1. **Blockchain Anchoring:** Merkle root commits for audit trail
2. **Stripe Integration:** Real payment processing
3. **SMS Notifications:** Twilio for job updates
4. **Mobile App:** React Native
5. **Advanced Matching:** ML-based provider matching
6. **Predictive Analytics:** Job risk prediction
7. **Automated Scheduling:** AI-powered crew allocation
8. **Compliance Reporting:** Auto-generated compliance docs
