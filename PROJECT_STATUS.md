# TradeHub — Current Status (Handoff)

## Repo / Stack
- Repo: ryanjoooseph-cmyk/tradehub-app
- Stack: Next.js (web) + Supabase + Render + GitHub PR auto-merge
- Policy: keep deploy green, build locally before push

## Current State
- Main is green
- Last merged PR: #18774 (merge commit 2a7ba40b…)
- Local clean: `git status --porcelain` empty
- Web build: `cd web && npm run build` passes (18/18)

## Non-negotiables
- Only paste-ready bash commands (no placeholders)
- No comments inside bash blocks
- Always run web build before pushing

## Next Targets
1) Escrow v2 UI: ledger table + action drawer + dispute queue + timeline
2) Calendar/dashboard polish to “institutional grade”
3) Supabase wiring (real data)
4) Turn agents on 24/7 once automerge is bulletproof
