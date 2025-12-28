Here's a minimal API route in TypeScript for a Next.js application that returns the specified JSON response. You can create the file at the path `app/api/jobs/route.ts`.

```typescript
// app/api/jobs/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, route: 'jobs' });
}
```

This code defines a GET handler that responds with a JSON object containing `{ ok: true, route: 'jobs' }`.