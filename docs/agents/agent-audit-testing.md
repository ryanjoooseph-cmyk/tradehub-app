# Agent Audit Log Testing Guide

This document provides curl commands to test agent endpoints and verify audit logging.

## Prerequisites

Set your agent secret:
```bash
export AGENT_SECRET="your_secret_here"
```

## Test All Agent Endpoints

### 1. CI Triage - Success

```bash
curl -s -X POST "http://localhost:3000/api/agent/ci-triage" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: $AGENT_SECRET" \
  -d '{
    "prUrl": "https://github.com/test/repo/pull/1",
    "sha": "abc123",
    "repo": "test/repo",
    "runUrl": "https://github.com/test/repo/actions/runs/1",
    "failedChecks": [{"name": "web-build", "conclusion": "failure"}]
  }' | jq .
```

### 2. CI Triage - Failure (Invalid Input)

```bash
curl -s -X POST "http://localhost:3000/api/agent/ci-triage" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: $AGENT_SECRET" \
  -d '{"invalid": "data"}' | jq .
```

### 3. Dispute Assistant - Success

```bash
curl -s -X POST "http://localhost:3000/api/agent/dispute-assistant" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: $AGENT_SECRET" \
  -d '{
    "disputeId": "D-001",
    "jobId": "J-1234",
    "milestoneId": "M-123",
    "clientEvidence": [{"type": "screenshot", "url": "https://example.com/img.png", "notes": "Issue shown"}],
    "providerEvidence": [{"type": "deliverable", "url": "https://example.com/file.zip", "notes": "Work completed"}],
    "context": {"jobSummary": "Website redesign", "milestoneSummary": "Homepage", "amount": 1500}
  }' | jq .
```

### 4. Dispute Assistant - Failure (Missing Fields)

```bash
curl -s -X POST "http://localhost:3000/api/agent/dispute-assistant" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: $AGENT_SECRET" \
  -d '{"disputeId": "D-001"}' | jq .
```

### 5. Data Entry - Success

```bash
curl -s -X POST "http://localhost:3000/api/agent/data-entry" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: $AGENT_SECRET" \
  -d '{
    "source": "email",
    "subject": "Invoice for J-5678 - Project Alpha",
    "from": "billing@vendor.com",
    "bodyText": "Please find attached invoice.\n\nTotal: $3,500.00\nDue: 2024-02-15",
    "attachments": []
  }' | jq .
```

### 6. Data Entry - Failure (Invalid Source)

```bash
curl -s -X POST "http://localhost:3000/api/agent/data-entry" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: $AGENT_SECRET" \
  -d '{
    "source": "invalid",
    "subject": "Test",
    "from": "test@test.com",
    "bodyText": "Test",
    "attachments": []
  }' | jq .
```

### 7. Support Triage - Success

```bash
curl -s -X POST "http://localhost:3000/api/agent/support-triage" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: $AGENT_SECRET" \
  -d '{
    "ticketId": "T-001",
    "subject": "Payment not received",
    "body": "I paid last week but it still shows unpaid",
    "from": "customer@example.com",
    "priority": "high"
  }' | jq .
```

### 8. Auth Failure Test (Any Endpoint)

```bash
curl -s -X POST "http://localhost:3000/api/agent/ci-triage" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: wrong_secret" \
  -d '{"prUrl": "x", "sha": "x", "repo": "x", "runUrl": "x", "failedChecks": []}' | jq .
```

Expected response:
```json
{
  "ok": false,
  "error": "Unauthorized - invalid or missing x-agent-secret",
  "code": "AUTH_ERROR"
}
```

## Fetch Audit Events

### Get All Events (Last 24 Hours)

```bash
curl -s "http://localhost:3000/api/agent/audit-events?range=24h" \
  -H "x-agent-secret: $AGENT_SECRET" | jq .
```

### Filter by Agent Name

```bash
curl -s "http://localhost:3000/api/agent/audit-events?agent=ci-triage&range=7d" \
  -H "x-agent-secret: $AGENT_SECRET" | jq .
```

### Filter by Status (Failures Only)

```bash
curl -s "http://localhost:3000/api/agent/audit-events?status=failure&range=24h" \
  -H "x-agent-secret: $AGENT_SECRET" | jq .
```

### Filter by Multiple Criteria

```bash
curl -s "http://localhost:3000/api/agent/audit-events?agent=dispute-assistant&status=success&range=7d&limit=50" \
  -H "x-agent-secret: $AGENT_SECRET" | jq .
```

### Get All Time Events

```bash
curl -s "http://localhost:3000/api/agent/audit-events?range=all&limit=500" \
  -H "x-agent-secret: $AGENT_SECRET" | jq .
```

## Admin UI Access

Navigate to: http://localhost:3000/app/agents

1. Enter your `x-agent-secret` in the authentication field
2. Use the filters to narrow down events:
   - Agent: Filter by specific agent
   - Status: success/failure
   - Time Range: 1h, 24h, 7d, 30d, all
3. Click on any event row to expand and see full details

## Audit Event Schema

Each audit event contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique event identifier |
| `timestamp` | string | ISO 8601 timestamp |
| `agentName` | string | Name of the agent |
| `inputHash` | string | Hash of input data (for correlation) |
| `outputSummary` | string | Brief summary of output |
| `status` | string | "success" or "failure" |
| `error` | string? | Error message if failed |
| `durationMs` | number? | Execution time in milliseconds |

## Rate Limiting

All agent endpoints are rate-limited to 10 requests per minute per IP address.

To trigger rate limit (run quickly):
```bash
for i in {1..15}; do
  curl -s -X POST "http://localhost:3000/api/agent/ci-triage" \
    -H "Content-Type: application/json" \
    -H "x-agent-secret: $AGENT_SECRET" \
    -d '{"prUrl":"x","sha":"x","repo":"x","runUrl":"x","failedChecks":[]}' &
done
wait
```

Expected response after limit exceeded:
```json
{
  "ok": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT",
  "retryAfter": 1
}
```

## Persistence

Audit events are stored in two locations:
1. **In-memory** (primary) - Fast access, limited to 1000 most recent events
2. **JSONL file** (backup) - Persisted to `/tmp/tradehub-agent-audit.jsonl`

Set custom log path:
```bash
export AUDIT_LOG_PATH=/var/log/tradehub/agent-audit.jsonl
```
