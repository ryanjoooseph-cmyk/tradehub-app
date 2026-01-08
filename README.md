# TradeHub Calendar Patch (FullCalendar + Resource TimeGrid)

This patch fixes your Render build errors and adds a **Tradify‑style drag & drop calendar**.

## Why your build failed
Your imports used `fullcalendar/...` and the packages were not installed. For React v6, the correct
packages are **scoped** (e.g. `@fullcalendar/react`, `@fullcalendar/timegrid`, etc.), and they must be
installed and imported explicitly. Also, the calendar must run as a **client component** in Next.js.

## Files to add
- `components/Scheduler.tsx` — the calendar component (client‑side, drag & drop enabled)
- `lib/sampleData.ts` — demo resources/events (replace with your API)
- `app/tradehub/jobs/calendar/page.tsx` — your `/tradehub/jobs/calendar` page
- `next.config.mjs` — ensures FullCalendar packages are transpiled by Next/Turbopack

## Install the packages
Add these to your project (commit to `package.json` or run locally and commit the lockfile):
```bash
npm i @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/resource-timegrid
```

## CSS
The component imports the v6 CSS bundles:
- `@fullcalendar/core/index.css`
- `@fullcalendar/daygrid/index.css`
- `@fullcalendar/timegrid/index.css`
- `@fullcalendar/resource-timegrid/index.css`

## Next steps
1) Copy these files into your repo in the same paths.
2) Install the packages (command above).
3) Commit & push — your **safe‑automerge** workflow will merge and Render will redeploy.
4) Visit `/tradehub/jobs/calendar`.

### Hooks to wire later
- `eventReceive`, `eventDrop`, `eventResize` in `Scheduler.tsx`.
- Replace `lib/sampleData.ts` with server data; keep the Scheduler client‑only.
