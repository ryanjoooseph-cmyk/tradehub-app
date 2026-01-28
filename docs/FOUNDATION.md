# TradeHub Platform Foundation (A++ Skeleton)

## Non-negotiables
- Multi-tenant by default (org isolation)
- RLS from day one
- Calendar is core UX (drag/drop scheduling)
- Jobs are the unit of work (job -> tasks -> events)
- Everything is API-safe and auditable

## Core Entities
- orgs
- org_members (role)
- customers
- sites
- jobs
- job_events (calendar)
- staff
- staff_assignments

## UX Shell
- /app dashboard
- /app/jobs list + job detail
- /app/calendar drag/drop
- /app/settings org + members + billing (later)

## Notes
Agents must build inside this structure. No random architecture changes.
