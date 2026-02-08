# Agent 6: Data Entry

## Overview

The Data Entry agent extracts structured data from emails and manual submissions. It uses pattern matching and heuristics to identify job IDs, amounts, dates, vendors, and line items. When OpenAI is configured, it enhances extraction with LLM analysis.

**Important:** This agent creates draft data only. It never writes to the database. All extractions require human review before saving.

## Endpoint

```
POST /api/agent/data-entry
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
  "source": "email | manual",
  "subject": "string",
  "from": "string",
  "bodyText": "string",
  "attachments": [
    {
      "filename": "string",
      "contentType": "string",
      "url": "string"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | Yes | Either `email` or `manual` |
| `subject` | string | Yes | Email subject or manual entry title |
| `from` | string | Yes | Sender email or source identifier |
| `bodyText` | string | Yes | Plain text content |
| `attachments` | array | Yes | List of attachments (can be empty) |

## Output Schema

```json
{
  "ok": true,
  "draft": {
    "jobId": "string | null",
    "milestoneId": "string | null",
    "vendor": "string | null",
    "amount": 1000,
    "date": "2024-01-15",
    "lineItems": [
      {
        "desc": "string",
        "qty": 1,
        "unitPrice": 100,
        "total": 100
      }
    ],
    "note": "string"
  },
  "requiresHumanReview": true,
  "confidence": "LOW | MEDIUM | HIGH",
  "missingFields": ["string"]
}
```

### Confidence Levels

| Level | Criteria |
|-------|----------|
| `HIGH` | Job ID, amount, vendor, and date all detected; no missing fields |
| `MEDIUM` | Job ID or amount detected; no OCR pending |
| `LOW` | Minimal data extracted or OCR pending |

### Pattern Detection

The agent detects:
- **Job IDs**: Patterns like `J-1234`, `JOB-12345`
- **Milestone IDs**: Patterns like `M-123`, `MS-1234`
- **Amounts**: Patterns like `$1,234.56`, `1234 USD`
- **Dates**: ISO format `2024-01-15`, US format `01/15/2024`
- **Line Items**: `Description qty x $price = $total`

### OCR Limitation

OCR is not yet implemented. If attachments appear to be invoices or receipts (PDF, PNG, JPG), the response will include `"OCR pending"` in `missingFields`.

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

### curl Example - Email Source

```bash
curl -s -X POST "http://localhost:3000/api/agent/data-entry" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: your_secret_here" \
  -d '{
    "source": "email",
    "subject": "Invoice for J-1234 - Website Project",
    "from": "billing@acmecorp.com",
    "bodyText": "Please find attached invoice for milestone M-123.\n\nTotal due: $2,500.00\nDue date: 2024-01-15\n\nThank you for your business.",
    "attachments": [
      {"filename": "invoice-001.pdf", "contentType": "application/pdf", "url": "https://example.com/invoice.pdf"}
    ]
  }' | jq .
```

### Expected Response

```json
{
  "ok": true,
  "draft": {
    "jobId": "J-1234",
    "milestoneId": "M-123",
    "vendor": "Acmecorp",
    "amount": 2500,
    "date": "2024-01-15",
    "lineItems": [],
    "note": "Extracted from email: Invoice for J-1234 - Website Project"
  },
  "requiresHumanReview": true,
  "confidence": "MEDIUM",
  "missingFields": [
    "OCR pending - invoice/receipt attachments detected but OCR not yet implemented"
  ]
}
```

### curl Example - Manual Entry

```bash
curl -s -X POST "http://localhost:3000/api/agent/data-entry" \
  -H "Content-Type: application/json" \
  -H "x-agent-secret: your_secret_here" \
  -d '{
    "source": "manual",
    "subject": "Expense report for J-5678",
    "from": "user@company.com",
    "bodyText": "Office supplies purchase\n\nPens 10 x $2.50 = $25.00\nNotebooks 5 x $8.00 = $40.00\n\nTotal: $65.00",
    "attachments": []
  }' | jq .
```

### Expected Response

```json
{
  "ok": true,
  "draft": {
    "jobId": "J-5678",
    "milestoneId": null,
    "vendor": null,
    "amount": 65,
    "date": null,
    "lineItems": [
      {"desc": "Pens", "qty": 10, "unitPrice": 2.5, "total": 25},
      {"desc": "Notebooks", "qty": 5, "unitPrice": 8, "total": 40}
    ],
    "note": "Extracted from manual: Expense report for J-5678"
  },
  "requiresHumanReview": true,
  "confidence": "LOW",
  "missingFields": [
    "Vendor not detected",
    "Date not detected"
  ]
}
```

## Audit Logging

All requests are logged with:
- Agent name: `data-entry`
- Input hash (for correlation)
- Output summary including source and confidence
- Success/failure status
- Duration in milliseconds

Logs are written as structured JSON to stdout with type `AGENT_AUDIT`.
