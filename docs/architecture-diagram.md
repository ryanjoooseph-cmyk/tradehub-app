# TradeHub Platform Architecture

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser]
        MOBILE[Mobile Browser]
    end
    
    subgraph "Application Layer - Next.js 15 App Router"
        subgraph "Route Groups"
            ROOT[/ - Landing]
            APP[/app/* - Ops OS]
            ESCROW[/escrow/* - Buyer Portal]
            MARKET[/market/* - Marketplace]
            DISPATCH[/dispatch - Dispatch Board]
        end
        
        subgraph "API Routes"
            API_JOBS[/api/jobs]
            API_CLIENTS[/api/clients]
            API_INVOICES[/api/invoices]
            API_ESCROW[/api/escrow]
            API_AGENT[/api/agent/*]
            API_HEALTH[/api/health]
        end
    end
    
    subgraph "State Management"
        PROVIDERS[Providers - ThemeProvider]
        CONTEXT[React Context]
        SERVER_STATE[Server Components State]
    end
    
    subgraph "Component Architecture"
        SHELL[AppShell - Sidebar + Topbar]
        SHARED[Shared Components]
        FILLED[Filled Components]
        UI[UI Primitives]
    end
    
    subgraph "Backend Services - Supabase"
        AUTH[Auth Service]
        DB[(PostgreSQL Database)]
        STORAGE[File Storage]
        REALTIME[Realtime Subscriptions]
        EDGE[Edge Functions]
    end
    
    subgraph "Integrations"
        GITHUB[GitHub API - PR/CI]
        OPENAI[OpenAI Agents API]
        RENDER[Render Deploy API]
    end
    
    subgraph "Automation Layer - OpenAI Agents"
        AGENT_RELEASE[Release Manager]
        AGENT_CI[CI Triage Agent]
        AGENT_REGRESSION[Regression Guard]
        AGENT_SUPPORT[Support Triage]
        AGENT_DISPUTE[Dispute Assistant]
        AGENT_DATA[Data Entry Agent]
    end
    
    subgraph "Future: Blockchain Anchoring"
        MERKLE[Merkle Root Generator]
        CHAIN[Public Chain - Ethereum/Polygon]
        PROOF[Proof Verification API]
    end
    
    WEB --> ROOT
    WEB --> APP
    WEB --> ESCROW
    WEB --> MARKET
    MOBILE --> APP
    
    APP --> SHELL
    APP --> API_JOBS
    APP --> API_CLIENTS
    APP --> API_INVOICES
    APP --> API_ESCROW
    
    SHELL --> SHARED
    SHELL --> FILLED
    SHARED --> UI
    
    API_JOBS --> DB
    API_CLIENTS --> DB
    API_INVOICES --> DB
    API_ESCROW --> DB
    API_AGENT --> OPENAI
    
    DB --> REALTIME
    REALTIME --> WEB
    
    API_AGENT --> AGENT_RELEASE
    API_AGENT --> AGENT_CI
    API_AGENT --> AGENT_DISPUTE
    
    AGENT_RELEASE --> GITHUB
    AGENT_CI --> GITHUB
    
    DB -.Future.-> MERKLE
    MERKLE -.-> CHAIN
    CHAIN -.-> PROOF
    
    AUTH --> DB
    STORAGE --> DB
```

## Domain Model Architecture

```mermaid
erDiagram
    CLIENT ||--o{ JOB : "requests"
    PROVIDER ||--o{ JOB : "performs"
    JOB ||--o{ QUOTE : "has"
    JOB ||--o{ INVOICE : "generates"
    JOB ||--o{ MILESTONE : "contains"
    JOB ||--o{ AUDIT_EVENT : "tracks"
    
    MILESTONE ||--o{ EVIDENCE : "requires"
    MILESTONE ||--o{ DISPUTE : "may-trigger"
    
    DISPUTE ||--o| INSPECTOR : "assigned-to"
    DISPUTE ||--o{ AUDIT_EVENT : "tracks"
    
    PROVIDER ||--o{ TEAM_MEMBER : "employs"
    TEAM_MEMBER ||--o{ JOB : "assigned-to"
    
    JOB ||--o{ REVIEW : "receives"
    
    CLIENT {
        uuid id PK
        string name
        string email
        string company
        string type
        jsonb portfolio
        enum status
        timestamp created_at
    }
    
    PROVIDER {
        uuid id PK
        string business_name
        string abn
        jsonb licenses
        jsonb insurance
        boolean verified
        timestamp created_at
    }
    
    JOB {
        uuid id PK
        string job_number
        uuid client_id FK
        uuid provider_id FK
        string site_location
        enum status
        jsonb metadata
        timestamp scheduled_start
        timestamp created_at
    }
    
    QUOTE {
        uuid id PK
        uuid job_id FK
        decimal amount
        jsonb line_items
        jsonb milestones
        enum status
        timestamp created_at
    }
    
    MILESTONE {
        uuid id PK
        uuid job_id FK
        string title
        decimal amount
        enum state
        jsonb evidence_requirements
        timestamp funded_at
        timestamp released_at
    }
    
    EVIDENCE {
        uuid id PK
        uuid milestone_id FK
        enum type
        string url
        jsonb metadata
        timestamp submitted_at
    }
    
    DISPUTE {
        uuid id PK
        uuid milestone_id FK
        enum state
        uuid inspector_id FK
        jsonb decision
        timestamp opened_at
        timestamp resolved_at
    }
    
    INSPECTOR {
        uuid id PK
        string name
        jsonb certifications
        boolean third_party
    }
    
    INVOICE {
        uuid id PK
        string invoice_number
        uuid job_id FK
        uuid client_id FK
        decimal amount
        enum status
        date due_date
        timestamp created_at
    }
    
    TEAM_MEMBER {
        uuid id PK
        uuid provider_id FK
        string name
        jsonb skills
        jsonb certifications
        enum status
    }
    
    REVIEW {
        uuid id PK
        uuid job_id FK
        uuid client_id FK
        int rating
        text comment
        timestamp created_at
    }
    
    AUDIT_EVENT {
        uuid id PK
        uuid job_id FK
        uuid milestone_id FK
        enum event_type
        jsonb payload
        string actor
        timestamp created_at
        string merkle_hash
    }
```

## State Machine Flows

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Create Job
    
    state "Job Lifecycle" as JOB {
        DRAFT --> SCHEDULED: Schedule
        SCHEDULED --> IN_PROGRESS: Start Work
        IN_PROGRESS --> COMPLETE: Finish Work
        COMPLETE --> INVOICED: Generate Invoice
        INVOICED --> PAID: Payment Received
        PAID --> ARCHIVED: Archive
        
        DRAFT --> CANCELLED: Cancel
        SCHEDULED --> CANCELLED: Cancel
        IN_PROGRESS --> CANCELLED: Cancel
    }
```

```mermaid
stateDiagram-v2
    [*] --> DRAFT_M: Create Milestone
    
    state "Milestone Lifecycle" as MILESTONE {
        DRAFT_M --> FUNDED: Client Pays
        FUNDED --> WORK_SUBMITTED: Provider Submits
        WORK_SUBMITTED --> EVIDENCE_REVIEW: Evidence Uploaded
        EVIDENCE_REVIEW --> RELEASED: Approved
        EVIDENCE_REVIEW --> DISPUTED: Client Disputes
        
        DISPUTED --> INSPECTOR_ASSIGNED: Assign Inspector
        INSPECTOR_ASSIGNED --> REPORT_SUBMITTED: Inspector Reports
        REPORT_SUBMITTED --> RESOLVED_RELEASE: Decision: Release
        REPORT_SUBMITTED --> RESOLVED_REFUND: Decision: Refund
        REPORT_SUBMITTED --> RESOLVED_PARTIAL: Decision: Partial
        
        RESOLVED_RELEASE --> [*]
        RESOLVED_REFUND --> [*]
        RESOLVED_PARTIAL --> [*]
        RELEASED --> [*]
    }
```

```mermaid
stateDiagram-v2
    [*] --> OPEN: Dispute Filed
    
    state "Dispute Lifecycle" as DISPUTE {
        OPEN --> EVIDENCE_REQUESTED: Request Evidence
        EVIDENCE_REQUESTED --> INSPECTOR_ASSIGNED: Assign Inspector
        INSPECTOR_ASSIGNED --> REPORT_SUBMITTED: Inspector Files Report
        REPORT_SUBMITTED --> DECISION: Admin Review
        DECISION --> CLOSED: Finalize
        CLOSED --> [*]
    }
```

## Component Hierarchy

```mermaid
graph TD
    ROOT_LAYOUT[app/layout.tsx]
    PROVIDERS[app/providers.tsx]
    APP_LAYOUT[app/app/layout.tsx]
    APPSHELL[AppShell.tsx]
    
    ROOT_LAYOUT --> PROVIDERS
    PROVIDERS --> APP_LAYOUT
    APP_LAYOUT --> APPSHELL
    
    subgraph "AppShell Components"
        TOPBAR[Topbar + TopbarActions]
        SIDEBAR[Sidebar Navigation]
        MAIN[Main Content Area]
    end
    
    APPSHELL --> TOPBAR
    APPSHELL --> SIDEBAR
    APPSHELL --> MAIN
    
    subgraph "Page Components"
        DASHBOARD[Dashboard Page]
        JOBS[Jobs Page]
        JOB_DETAIL[Job Detail Page]
        CLIENTS[Clients Page]
        INVOICES[Invoices Page]
        CALENDAR[Calendar Page]
        ESCROW_PAGE[Escrow Page]
        TEAM[Team Page]
        SETTINGS[Settings Page]
    end
    
    MAIN --> DASHBOARD
    MAIN --> JOBS
    MAIN --> JOB_DETAIL
    MAIN --> CLIENTS
    MAIN --> INVOICES
    MAIN --> CALENDAR
    MAIN --> ESCROW_PAGE
    MAIN --> TEAM
    MAIN --> SETTINGS
    
    subgraph "Shared Components"
        KPI[KPI Grid]
        CHARTS[Charts]
        TABLES[Data Tables]
        FORMS[Form Components]
        SIGNALS[Signal Panel]
    end
    
    DASHBOARD --> KPI
    DASHBOARD --> CHARTS
    DASHBOARD --> SIGNALS
    
    JOBS --> TABLES
    CLIENTS --> TABLES
    INVOICES --> TABLES
```

## Deployment Architecture

```mermaid
graph LR
    subgraph "Developer Workflow"
        LOCAL[Local Dev - pnpm dev]
        GIT[Git Commit]
        PR[Pull Request]
    end
    
    subgraph "CI/CD Pipeline - GitHub Actions"
        CHECKOUT[Checkout Code]
        INSTALL[pnpm install]
        LINT[pnpm lint]
        TYPE[pnpm typecheck]
        BUILD[pnpm build]
        AGENT_CHECK[Release Manager Agent]
    end
    
    subgraph "Render Platform"
        BUILD_SERVICE[Build Service]
        WEB_SERVICE[Web Service]
        ENV[Environment Variables]
        CDN[CDN/Edge Cache]
    end
    
    subgraph "External Services"
        SUPABASE_CLOUD[Supabase Cloud]
        OPENAI_API[OpenAI API]
        GITHUB_API[GitHub API]
    end
    
    LOCAL --> GIT
    GIT --> PR
    PR --> CHECKOUT
    CHECKOUT --> INSTALL
    INSTALL --> LINT
    LINT --> TYPE
    TYPE --> BUILD
    BUILD --> AGENT_CHECK
    
    AGENT_CHECK -->|Approved| BUILD_SERVICE
    BUILD_SERVICE --> ENV
    ENV --> WEB_SERVICE
    WEB_SERVICE --> CDN
    
    WEB_SERVICE --> SUPABASE_CLOUD
    WEB_SERVICE --> OPENAI_API
    AGENT_CHECK --> GITHUB_API
```

## Data Flow - Escrow Release

```mermaid
sequenceDiagram
    participant Provider
    participant App
    participant API
    participant DB
    participant Agent
    participant Client
    
    Provider->>App: Submit Work Complete
    App->>API: POST /api/jobs/{id}/submit
    API->>DB: Update job.status
    API->>DB: Create audit_event
    
    Provider->>App: Upload Evidence
    App->>API: POST /api/milestones/{id}/evidence
    API->>DB: Store evidence records
    API->>Agent: Trigger evidence review
    
    Agent->>DB: Analyze evidence completeness
    Agent->>API: Return risk score + recommendations
    
    alt High Risk
        API->>Client: Notify: Evidence review required
        Client->>App: Review evidence
        Client->>API: Approve/Dispute
    else Low Risk
        API->>DB: Auto-approve (if rules met)
    end
    
    API->>DB: Update milestone.state = RELEASED
    API->>DB: Create audit_event (release)
    API->>Provider: Transfer funds
    API->>DB: Create audit_event (payment)
```

## Security & Trust Layers

```mermaid
graph TB
    subgraph "Authentication Layer"
        SUPABASE_AUTH[Supabase Auth]
        JWT[JWT Tokens]
        RLS[Row Level Security]
    end
    
    subgraph "Authorization Layer"
        RBAC[Role-Based Access]
        PERMISSIONS[Permission Checks]
        API_MIDDLEWARE[API Middleware]
    end
    
    subgraph "Audit Layer"
        AUDIT_LOG[Audit Event Stream]
        SIGNATURES[Digital Signatures]
        MERKLE_ROOT[Merkle Root Hash]
    end
    
    subgraph "Escrow Layer"
        FUNDS_HOLD[Funds Holding]
        EVIDENCE_GATE[Evidence Gating]
        INSPECTOR_VERIFY[Inspector Verification]
        RELEASE_ENGINE[Release Engine]
    end
    
    subgraph "Blockchain Layer (Future)"
        HASH_EVENTS[Hash Events]
        BATCH_MERKLE[Batch Merkle Tree]
        CHAIN_ANCHOR[Chain Anchoring]
        PROOF_API[Proof Verification]
    end
    
    SUPABASE_AUTH --> JWT
    JWT --> RLS
    RLS --> RBAC
    RBAC --> PERMISSIONS
    PERMISSIONS --> API_MIDDLEWARE
    
    API_MIDDLEWARE --> AUDIT_LOG
    AUDIT_LOG --> SIGNATURES
    
    EVIDENCE_GATE --> RELEASE_ENGINE
    INSPECTOR_VERIFY --> RELEASE_ENGINE
    FUNDS_HOLD --> RELEASE_ENGINE
    
    AUDIT_LOG -.Future.-> HASH_EVENTS
    HASH_EVENTS -.-> BATCH_MERKLE
    BATCH_MERKLE -.-> CHAIN_ANCHOR
    CHAIN_ANCHOR -.-> PROOF_API
```
