# Agent 5: Dispute Assistant

## Overview

The Dispute Assistant agent provides advisory analysis for escrow disputes. It analyzes evidence submitted by both client and provider, identifies gaps in documentation, and generates non-binding recommendations for resolution.

**Important:** This agent is advisory only. It never auto-decides dispute outcomes. All recommendations require human review and approval.

## Endpoint

```
POST /api/agent/dispute-assistant
```

## Security

### Required Headers

| Header | Description |
|--------|-------------|
| `x-agent-secret` | Must match the `AGENT_SECRET` environment variable |
| `Content-Type` | Must be `application/json` |

### Rate Limiting

- **10 requests per minute** per IP address
- Token bucket algorithm with 1 token/second refill
- Returns `429 Too Many Requests` when exceeded

## Input Schema

```json
{
  "disputeId": "string",
  "jobId": "string",
  "milestoneId": "string",
  "clientEvidence": [
    {
      "type": "string",
      "url": "string",
      "notes": "string"
    }
  ],
  "providerEvidence": [
    {
      "type": "string",
      "url": "string",
      "notes": "string"
    }
  ],
  "context": {
    "jobSummary": "string",
    "milestoneSummary": "string",
    "amount": 1000
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `disputeId` | string | Yes | Unique identifier for the dispute |
| `jobId` | string | Yes | Associated job ID (e.g., "J-1234") |
| `milestoneId` | string | Yes | Associated milestone ID (e.g., "M-123") |
| `clientEvidence` | array | Yes | Evidence submitted by the client |
| `providerEvidence` | array | Yes | Evidence submitted by the provider |
| `context.jobSummary` | string | Yes | Brief description of the job |
| `context.milestoneSummary` | string | Yes | Brief description of the milestone |
| `context.amount` | number | Yes | Disputed amount in dollars |

### Evidence Types

Common evidence types include:
- `screenshot` - Screenshots of issues or completed work
- `message` / `chat` - Communication history
- `deliverable` / `file` - Work product files
- `contract` - Original agreement or SOW
- `invoice` - Payment documentation

## Output Schema

```json
{
  "ok": true,
  "summary": {
    "clientCase": "string",
    "providerCase": "string",
    "missingEvidence": ["string"]
  },
  "recommendations": [
    {
      "option": "FULL_RELEASE | FULL_REFUND | PARTIAL_RELEASE",
      "suggestedAmount": 1000,
      "rationale": "string"
    }
  ],
  "warnings": ["string"]
}
```

### Recommendation Options

| Option | Description |
|--------|-------------|
| `FULL_RELEASE` | Release full escrow amount to provider |
| `FULL_REFUND` | Refund full amount to client |
| `PARTIAL_RELEASE` | Split amount between parties |

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `JSON_PARSE_ERROR` | Invalid JSON in request body |
| 400 | `VALIDATION_ERROR` | Missing or invalid required fields |
| 401 | `AUTH_ERROR` | Missing or invalid `x-agent-secret` |
| 429 | `RATE_LIMIT` | Too many requests |
| 500 | `CONFIG_ERROR` | `AGENT_SECRET` not configured |
| 500 | `AGENT_ERROR` | Internal processing error |

## Testing

### curl Example

```bash
curl -s -X POST "http://localhost:3000/api/agent/dispute-assistant" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: your_secret_here" \
  -d '{
    "disputeId": "D-001",
    "jobId": "J-1234",
    "milestoneId": "M-123",
    "clientEvidence": [
      {"type": "screenshot", "url": "https://example.com/issue.png", "notes": "Work incomplete"}
    ],
    "providerEvidence": [
      {"type": "deliverable", "url": "https://example.com/file.zip", "notes": "All work delivered"},
      {"type": "message", "url": "https://example.com/chat.html", "notes": "Client approved on Jan 5"}
    ],
    "context": {
      "jobSummary": "Website redesign project",
      "milestoneSummary": "Homepage mockup delivery",
      "amount": 1500
    }
  }' | jq .
```

### Expected Response

```json
{
  "ok": true,
  "summary": {
    "clientCase": "screenshot: Work incomplete",
    "providerCase": "deliverable: All work delivered; message: Client approved on Jan 5",
    "missingEvidence": [
      "Client: Communication history",
      "Client: Deliverable files or samples"
    ]
  },
  "recommendations": [
    {
      "option": "FULL_RELEASE",
      "suggestedAmount": 1500,
      "rationale": "Provider has submitted more documentation supporting work completion."
    },
    {
      "option": "PARTIAL_RELEASE",
      "suggestedAmount": 1125,
      "rationale": "Partial release may be appropriate if some concerns remain."
    }
  ],
  "warnings": [
    "Human decision required - this is advisory analysis only.",
    "Review all evidence before making a final determination.",
    "Consider requesting additional documentation if evidence is incomplete."
  ]
}
```

## Audit Logging

All requests are logged with:
- Agent name: `dispute-assistant`
- Input hash (for correlation)
- Output summary
- Success/failure status
- Duration in milliseconds

Logs are written as structured JSON to stdout with type `AGENT_AUDIT`.
