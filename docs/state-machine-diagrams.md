# TradeHub State Machine Diagrams

This document visualizes all state machines in the TradeHub platform using Mermaid diagrams.

---

## 1. Milestone State Machine

The milestone state machine is the core of the escrow engine. It enforces trust through evidence gating and dispute resolution.

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    
    DRAFT --> FUNDED : Client funds escrow
    
    FUNDED --> WORK_SUBMITTED : Provider submits work
    
    WORK_SUBMITTED --> EVIDENCE_REVIEW : Provider uploads evidence
    
    EVIDENCE_REVIEW --> RELEASED : Client approves OR<br/>Auto-approve (low risk)
    
    EVIDENCE_REVIEW --> DISPUTED : Client disputes
    
    DISPUTED --> INSPECTOR_ASSIGNED : Admin assigns inspector
    
    INSPECTOR_ASSIGNED --> RESOLVED : Inspector submits report
    
    RESOLVED --> RELEASED : Decision: Full release
    RESOLVED --> REFUNDED : Decision: Full refund
    RESOLVED --> PARTIAL_RELEASE : Decision: Partial release
    
    RELEASED --> [*]
    REFUNDED --> [*]
    PARTIAL_RELEASE --> [*]
    
    note right of DRAFT
        Initial state when<br/>milestone created
    end note
    
    note right of FUNDED
        Funds held in escrow<br/>Work can begin
    end note
    
    note right of EVIDENCE_REVIEW
        Evidence gating active<br/>Based on risk score
    end note
    
    note right of DISPUTED
        Dispute opened<br/>Funds frozen
    end note
    
    note right of RESOLVED
        Inspector report received<br/>Admin makes decision
    end note
```

### State Definitions

**DRAFT**
- Initial state when milestone is created
- No funds held yet
- Provider cannot start work

**FUNDED**
- Client has paid funds into escrow
- Provider can begin work
- Funds are held securely

**WORK_SUBMITTED**
- Provider has marked work as complete
- Awaiting evidence upload
- Funds still held

**EVIDENCE_REVIEW**
- Evidence uploaded and under review
- Evidence requirements based on risk score
- Can auto-approve if low risk and complete

**RELEASED**
- Funds transferred to provider
- Terminal state
- Audit event logged

**DISPUTED**
- Client has disputed the work
- Funds frozen
- Requires inspector assignment

**INSPECTOR_ASSIGNED**
- Third-party inspector assigned
- Inspector reviews evidence
- Inspector submits report

**RESOLVED**
- Inspector report submitted
- Admin reviews and makes decision
- Transitions to final state based on decision

**REFUNDED / PARTIAL_RELEASE**
- Terminal states
- Funds distributed per decision
- Audit events logged

---

## 2. Job State Machine

The job lifecycle tracks the overall progress from creation to completion and payment.

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    
    DRAFT --> SCHEDULED : Schedule confirmed
    DRAFT --> CANCELLED : Cancel job
    
    SCHEDULED --> IN_PROGRESS : Work starts
    SCHEDULED --> CANCELLED : Cancel job
    
    IN_PROGRESS --> COMPLETE : Work completes
    IN_PROGRESS --> CANCELLED : Cancel job
    
    COMPLETE --> INVOICED : Invoice generated
    
    INVOICED --> PAID : Payment received
    
    PAID --> ARCHIVED : Archive after N days
    
    ARCHIVED --> [*]
    CANCELLED --> [*]
    
    note right of DRAFT
        Job created<br/>Awaiting scheduling
    end note
    
    note right of SCHEDULED
        Crew assigned<br/>Start date set
    end note
    
    note right of IN_PROGRESS
        Work underway<br/>On site
    end note
    
    note right of COMPLETE
        Work finished<br/>Ready to invoice
    end note
    
    note right of INVOICED
        Invoice sent<br/>Awaiting payment
    end note
    
    note right of PAID
        All milestones released<br/>Invoice paid
    end note
```

### State Definitions

**DRAFT**
- Initial state
- Quote may be pending
- No crew assigned yet

**SCHEDULED**
- Start date confirmed
- Crew assigned
- Calendar blocked

**IN_PROGRESS**
- Work has started
- Daily updates expected
- Progress tracked

**COMPLETE**
- All work finished
- Final evidence submitted
- Ready for invoicing

**INVOICED**
- Invoice generated and sent
- Awaiting payment
- May trigger reminders

**PAID**
- All payments received
- All milestones released
- Job can be archived

**ARCHIVED**
- Moved to historical records
- Read-only
- Terminal state

**CANCELLED**
- Job cancelled before completion
- Terminal state
- Reason logged

---

## 3. Dispute State Machine

The dispute resolution workflow ensures fair outcomes for both parties.

```mermaid
stateDiagram-v2
    [*] --> OPEN
    
    OPEN --> EVIDENCE_REQUESTED : Request additional evidence
    
    EVIDENCE_REQUESTED --> INSPECTOR_ASSIGNED : Evidence submitted OR<br/>Assign immediately
    
    INSPECTOR_ASSIGNED --> REPORT_SUBMITTED : Inspector submits report
    
    REPORT_SUBMITTED --> DECISION : Admin reviews report
    
    DECISION --> CLOSED : Decision finalized
    
    CLOSED --> [*]
    
    note right of OPEN
        Dispute filed<br/>Initial review
    end note
    
    note right of EVIDENCE_REQUESTED
        More evidence needed<br/>From either party
    end note
    
    note right of INSPECTOR_ASSIGNED
        Third-party inspector<br/>Reviewing site/work
    end note
    
    note right of REPORT_SUBMITTED
        Inspector findings<br/>With recommendation
    end note
    
    note right of DECISION
        Admin final decision<br/>Updates milestone state
    end note
```

### State Definitions

**OPEN**
- Dispute has been filed
- Initial triage
- May request more evidence

**EVIDENCE_REQUESTED**
- Additional evidence needed
- From provider or client
- Deadline set

**INSPECTOR_ASSIGNED**
- Third-party inspector assigned
- Inspector reviews evidence
- May visit site

**REPORT_SUBMITTED**
- Inspector has filed report
- Includes recommendation
- Awaiting admin review

**DECISION**
- Admin reviews inspector report
- Makes final decision
- Updates milestone state accordingly

**CLOSED**
- Dispute resolved
- Terminal state
- Milestone transitions per decision

---

## 4. Quote State Machine

Tracks quotes from submission through acceptance or rejection.

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    
    DRAFT --> SUBMITTED : Provider submits quote
    
    SUBMITTED --> ACCEPTED : Client accepts
    SUBMITTED --> REJECTED : Client rejects
    SUBMITTED --> EXPIRED : Quote expires
    
    ACCEPTED --> [*] : Creates job + milestones
    REJECTED --> [*]
    EXPIRED --> [*]
    
    note right of DRAFT
        Provider creating quote<br/>Not yet submitted
    end note
    
    note right of SUBMITTED
        Awaiting client review<br/>Valid for N days
    end note
    
    note right of ACCEPTED
        Quote accepted<br/>Job created<br/>Milestones created
    end note
```

---

## 5. Invoice State Machine

Tracks invoices from creation through payment.

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    
    DRAFT --> SENT : Invoice sent to client
    
    SENT --> PAID : Payment received
    SENT --> OVERDUE : Due date passed
    
    OVERDUE --> PAID : Late payment received
    OVERDUE --> ESCALATED : Escalation triggered
    
    ESCALATED --> PAID : Payment received
    
    PAID --> [*]
    
    DRAFT --> CANCELLED : Invoice cancelled
    SENT --> CANCELLED : Invoice cancelled
    
    CANCELLED --> [*]
    
    note right of DRAFT
        Invoice created<br/>Not yet sent
    end note
    
    note right of SENT
        Sent to client<br/>Awaiting payment
    end note
    
    note right of OVERDUE
        Past due date<br/>Reminders triggered
    end note
    
    note right of ESCALATED
        Escalated to client<br/>Or collections
    end note
```

---

## 6. Provider Verification State Machine

Tracks provider verification from application to approval.

```mermaid
stateDiagram-v2
    [*] --> PENDING
    
    PENDING --> DOCUMENTS_SUBMITTED : Documents uploaded
    
    DOCUMENTS_SUBMITTED --> UNDER_REVIEW : Admin reviews
    
    UNDER_REVIEW --> APPROVED : All checks pass
    UNDER_REVIEW --> REJECTED : Checks fail
    UNDER_REVIEW --> MORE_INFO_NEEDED : Missing docs
    
    MORE_INFO_NEEDED --> DOCUMENTS_SUBMITTED : Docs re-submitted
    
    APPROVED --> [*]
    REJECTED --> [*]
    
    note right of PENDING
        Provider registered<br/>Awaiting documents
    end note
    
    note right of DOCUMENTS_SUBMITTED
        License, insurance<br/>Portfolio uploaded
    end note
    
    note right of UNDER_REVIEW
        Admin checking<br/>Verification process
    end note
    
    note right of APPROVED
        Verified badge granted<br/>Can receive jobs
    end note
```

---

## 7. Complete Escrow Flow Diagram

This shows the full escrow lifecycle with all possible paths.

```mermaid
flowchart TD
    Start([Job Created]) --> QuoteAccepted{Quote Accepted?}
    QuoteAccepted -->|Yes| CreateMilestones[Create Milestones]
    QuoteAccepted -->|No| End1([Job Cancelled])
    
    CreateMilestones --> FundEscrow[Client Funds Escrow]
    FundEscrow --> MilestoneFunded[Milestone: FUNDED]
    
    MilestoneFunded --> ProviderWorks[Provider Performs Work]
    ProviderWorks --> SubmitWork[Provider Submits Work]
    SubmitWork --> WorkSubmitted[Milestone: WORK_SUBMITTED]
    
    WorkSubmitted --> UploadEvidence[Upload Evidence]
    UploadEvidence --> EvidenceReview[Milestone: EVIDENCE_REVIEW]
    
    EvidenceReview --> CheckRisk{Risk Score}
    
    CheckRisk -->|Low Risk| AutoCheck{Evidence Complete?}
    AutoCheck -->|Yes| AutoApprove[Auto-Approve]
    AutoCheck -->|No| WaitClient[Wait for Client]
    
    CheckRisk -->|Med/High Risk| WaitClient
    
    WaitClient --> ClientReview{Client Decision}
    
    ClientReview -->|Approve| Release[Milestone: RELEASED]
    ClientReview -->|Dispute| OpenDispute[Milestone: DISPUTED]
    
    AutoApprove --> Release
    
    OpenDispute --> AssignInspector[Assign Inspector]
    AssignInspector --> InspectorAssigned[Milestone: INSPECTOR_ASSIGNED]
    
    InspectorAssigned --> InspectorReview[Inspector Reviews]
    InspectorReview --> SubmitReport[Inspector Submits Report]
    SubmitReport --> Resolved[Milestone: RESOLVED]
    
    Resolved --> AdminDecision{Admin Decision}
    
    AdminDecision -->|Release| Release
    AdminDecision -->|Refund| Refund[Milestone: REFUNDED]
    AdminDecision -->|Partial| Partial[Milestone: PARTIAL_RELEASE]
    
    Release --> TransferFunds[Transfer Funds to Provider]
    Refund --> RefundClient[Refund Client]
    Partial --> SplitFunds[Split Funds]
    
    TransferFunds --> LogAudit1[Log Audit Event]
    RefundClient --> LogAudit2[Log Audit Event]
    SplitFunds --> LogAudit3[Log Audit Event]
    
    LogAudit1 --> CheckMore{More Milestones?}
    LogAudit2 --> CheckMore
    LogAudit3 --> CheckMore
    
    CheckMore -->|Yes| NextMilestone[Next Milestone]
    CheckMore -->|No| JobComplete[Job: COMPLETE]
    
    NextMilestone --> MilestoneFunded
    
    JobComplete --> GenerateInvoice[Generate Invoice]
    GenerateInvoice --> SendInvoice[Send Invoice]
    SendInvoice --> PaymentReceived[Payment Received]
    PaymentReceived --> JobPaid[Job: PAID]
    
    JobPaid --> Archive[Job: ARCHIVED]
    Archive --> End2([End])
    End1 --> End2
```

---

## 8. Evidence Gating Logic

Decision tree for evidence requirements based on risk score.

```mermaid
flowchart TD
    Start([Calculate Risk Score]) --> GetFactors[Get Risk Factors]
    
    GetFactors --> JobValue{Job Value}
    JobValue -->|> $50k| Add3[Score + 3]
    JobValue -->|$10k-$50k| Add1[Score + 1]
    JobValue -->|< $10k| Add0[Score + 0]
    
    Add3 --> ClientHistory
    Add1 --> ClientHistory
    Add0 --> ClientHistory
    
    ClientHistory{Client Payment Reliability}
    ClientHistory -->|Low| AddC2[Score + 2]
    ClientHistory -->|Medium| AddC1[Score + 1]
    ClientHistory -->|High| AddC0[Score + 0]
    
    AddC2 --> ProviderHistory
    AddC1 --> ProviderHistory
    AddC0 --> ProviderHistory
    
    ProviderHistory{Provider Verified?}
    ProviderHistory -->|No| AddP2[Score + 2]
    ProviderHistory -->|Yes, < 5 jobs| AddP1[Score + 1]
    ProviderHistory -->|Yes, 5+ jobs| AddP0[Score + 0]
    
    AddP2 --> CategoryRisk
    AddP1 --> CategoryRisk
    AddP0 --> CategoryRisk
    
    CategoryRisk{High Risk Category?}
    CategoryRisk -->|Yes| AddCat1[Score + 1]
    CategoryRisk -->|No| AddCat0[Score + 0]
    
    AddCat1 --> TotalScore
    AddCat0 --> TotalScore
    
    TotalScore[Total Risk Score] --> Threshold{Score Level}
    
    Threshold -->|0-3: Low| LowReq[No evidence required<br/>Buyer approval only]
    Threshold -->|4-6: Medium| MedReq[2 photos required<br/>Checklist required]
    Threshold -->|7-10: High| HighReq[5 photos required<br/>Checklist required<br/>Notes required]
    
    LowReq --> End([Apply Requirements])
    MedReq --> End
    HighReq --> End
```

---

## 9. Agent Decision Flow

How automation agents provide recommendations without making decisions.

```mermaid
flowchart TD
    Start([Agent Triggered]) --> LoadContext[Load Context Data]
    
    LoadContext --> CallOpenAI[Call OpenAI API]
    CallOpenAI --> ParseResponse[Parse AI Response]
    
    ParseResponse --> ExtractRecommendation[Extract Recommendation]
    ExtractRecommendation --> ExtractReasoning[Extract Reasoning]
    ExtractReasoning --> ExtractConfidence[Extract Confidence Score]
    
    ExtractConfidence --> LogAudit[Log as Audit Event]
    
    LogAudit --> CheckAgentType{Agent Type}
    
    CheckAgentType -->|PR/CI Agent| PostComment[Post to GitHub PR]
    CheckAgentType -->|Dispute Agent| DisplayUI[Display in Admin UI]
    CheckAgentType -->|Support Agent| CreateTask[Create Support Task]
    
    PostComment --> WaitHuman[Wait for Human Review]
    DisplayUI --> WaitHuman
    CreateTask --> WaitHuman
    
    WaitHuman --> HumanDecision{Human Decision}
    
    HumanDecision -->|Approve| Execute[Execute Action]
    HumanDecision -->|Reject| NoAction[No Action Taken]
    HumanDecision -->|Modify| ModifyAndExecute[Modify Then Execute]
    
    Execute --> LogExecute[Log Execution]
    NoAction --> LogReject[Log Rejection]
    ModifyAndExecute --> LogModify[Log Modification]
    
    LogExecute --> End([End])
    LogReject --> End
    LogModify --> End
    
    note right of WaitHuman
        CRITICAL: Agent never<br/>executes critical actions<br/>automatically
    end note
```

---

## 10. Complete Platform State Diagram

High-level view of all interconnected state machines.

```mermaid
stateDiagram-v2
    [*] --> JobCreated
    
    state JobCreated {
        [*] --> DRAFT
        DRAFT --> SCHEDULED
        SCHEDULED --> IN_PROGRESS
        IN_PROGRESS --> COMPLETE
    }
    
    JobCreated --> QuoteFlow : Quote needed
    
    state QuoteFlow {
        [*] --> QUOTE_DRAFT
        QUOTE_DRAFT --> QUOTE_SUBMITTED
        QUOTE_SUBMITTED --> QUOTE_ACCEPTED
    }
    
    QuoteFlow --> EscrowFlow : Quote accepted
    
    state EscrowFlow {
        [*] --> M_DRAFT
        M_DRAFT --> M_FUNDED
        M_FUNDED --> M_WORK_SUBMITTED
        M_WORK_SUBMITTED --> M_EVIDENCE_REVIEW
        M_EVIDENCE_REVIEW --> M_RELEASED
        M_EVIDENCE_REVIEW --> M_DISPUTED
    }
    
    EscrowFlow --> DisputeFlow : Dispute opened
    
    state DisputeFlow {
        [*] --> D_OPEN
        D_OPEN --> D_EVIDENCE_REQUESTED
        D_EVIDENCE_REQUESTED --> D_INSPECTOR_ASSIGNED
        D_INSPECTOR_ASSIGNED --> D_REPORT_SUBMITTED
        D_REPORT_SUBMITTED --> D_DECISION
        D_DECISION --> D_CLOSED
    }
    
    DisputeFlow --> EscrowFlow : Dispute resolved
    EscrowFlow --> InvoiceFlow : All milestones complete
    
    state InvoiceFlow {
        [*] --> I_DRAFT
        I_DRAFT --> I_SENT
        I_SENT --> I_PAID
    }
    
    InvoiceFlow --> [*]
```

---

## State Transition Rules

### Global Rules
1. **Cannot skip states** - Must follow defined paths
2. **Audit all transitions** - Every state change logged
3. **Validate prerequisites** - Check requirements before transition
4. **Atomic updates** - State changes are transactional
5. **Idempotent operations** - Safe to retry transitions

### Milestone-Specific Rules
- Cannot release without evidence if requirements not met
- Cannot dispute after release
- Cannot fund twice
- Inspector assignment requires dispute state
- Resolved state requires inspector report

### Job-Specific Rules
- Cannot start without schedule
- Cannot complete without all milestones resolved
- Cannot invoice without completion
- Cannot archive until paid

### Dispute-Specific Rules
- Cannot close without decision
- Cannot assign inspector twice
- Cannot re-open after closed
- Report submission requires inspector assignment

---

## Error Handling in State Transitions

```mermaid
flowchart TD
    Start([Transition Requested]) --> Validate[Validate Current State]
    
    Validate --> ValidCheck{Valid?}
    ValidCheck -->|No| Error1[Return Error:<br/>Invalid current state]
    ValidCheck -->|Yes| CheckPrereq[Check Prerequisites]
    
    CheckPrereq --> PrereqCheck{Met?}
    PrereqCheck -->|No| Error2[Return Error:<br/>Prerequisites not met]
    PrereqCheck -->|Yes| BeginTx[Begin Transaction]
    
    BeginTx --> UpdateState[Update State]
    UpdateState --> LogAudit[Create Audit Event]
    LogAudit --> Commit[Commit Transaction]
    
    Commit --> Success[Return Success]
    
    UpdateState -.Error.-> Rollback[Rollback Transaction]
    LogAudit -.Error.-> Rollback
    Commit -.Error.-> Rollback
    
    Rollback --> Error3[Return Error:<br/>Transaction failed]
    
    Error1 --> End([End])
    Error2 --> End
    Error3 --> End
    Success --> End
```

---

## Audit Trail Integration

Every state transition creates an audit event:

```typescript
{
  id: "uuid",
  eventType: "MILESTONE_STATE_CHANGE",
  payload: {
    milestoneId: "uuid",
    fromState: "EVIDENCE_REVIEW",
    toState: "RELEASED",
    triggeredBy: "client:uuid" | "system" | "agent:name",
    reason: "Client approved",
    metadata: {
      evidenceComplete: true,
      riskScore: 3,
      autoApproved: false
    }
  },
  timestamp: "2026-02-01T10:23:45Z"
}
```

This ensures complete traceability and supports blockchain anchoring in the future.
