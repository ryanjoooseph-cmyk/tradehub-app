Here's a minimal API route in TypeScript for your Next.js application that returns the specified JSON response. You can create a file at the path `app/api/jobs/route.ts` and add the following code:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, route: 'jobs' });
}
```

This code defines a GET handler that responds with the JSON object `{ ok: true, route: 'jobs' }`.