# TradeHub - Getting Started Guide

**Your Exact Next Steps to Launch Development**

---

## 📍 Where You Are Now

✅ **Completed:**
- TradeHub app deployed on Render
- Core pages built (Dashboard, Jobs, Calendar, etc.)
- AppShell working with light/dark theme
- Supabase integration active
- GitHub repo set up
- CI/CD pipeline running

🎯 **Next Goal:** Start PR1 (Shell Hardening) within 24 hours

---

## 🗂️ Step 1: Upload Documentation (5 minutes)

### Option A: Add to Your Git Repository (Recommended)

```bash
# In your local tradehub repo
cd /path/to/tradehub

# Create docs folder
mkdir -p docs

# Move the 5 markdown files to docs/
mv ~/Downloads/architecture-diagram.md docs/
mv ~/Downloads/development-roadmap.md docs/
mv ~/Downloads/pr-implementation-checklists.md docs/
mv ~/Downloads/technical-specification.md docs/
mv ~/Downloads/state-machine-diagrams.md docs/
mv ~/Downloads/RECOMMENDATIONS.md docs/

# Create docs README
cat > docs/README.md << 'EOF'
# TradeHub Documentation

## Core Documentation
- [Architecture Diagram](./architecture-diagram.md) - System design & data flow
- [Development Roadmap](./development-roadmap.md) - 6-week plan with milestones
- [PR Implementation Checklists](./pr-implementation-checklists.md) - Task lists for each PR
- [Technical Specification](./technical-specification.md) - Complete tech spec
- [State Machine Diagrams](./state-machine-diagrams.md) - Escrow & dispute flows
- [Recommendations](./RECOMMENDATIONS.md) - Suggested improvements

## Quick Links
- [Current Phase: PR1](./pr-implementation-checklists.md#pr1-shell-stability-hardening)
- [Tech Stack](./technical-specification.md#tech-stack)
- [API Docs](./technical-specification.md#api-specifications)
- [Database Schema](./technical-specification.md#database-schema)

## Mermaid Diagram Rendering
Use [Mermaid Live Editor](https://mermaid.live) or GitHub to view diagrams.
EOF

# Commit to repo
git add docs/
git commit -m "docs: add comprehensive platform documentation"
git push origin main
```

**✅ Now your team can access docs at:** `https://github.com/yourusername/tradehub/tree/main/docs`

---

### Option B: Add to Notion/Confluence

If you use Notion or Confluence:

1. Create a new page: "TradeHub - Technical Documentation"
2. Import the 5 markdown files as sub-pages
3. Share with your team
4. Pin to workspace for easy access

**For Mermaid diagrams in Notion:**
- Use the Mermaid integration: https://mermaid.notion.site
- Or paste diagrams into https://mermaid.live and screenshot

---

### Option C: Add to GitHub Wiki

```bash
# Clone wiki
git clone https://github.com/yourusername/tradehub.wiki.git

# Add docs
cp ~/Downloads/*.md tradehub.wiki/

# Commit
cd tradehub.wiki
git add .
git commit -m "Add comprehensive documentation"
git push origin main
```

**✅ Accessible at:** `https://github.com/yourusername/tradehub/wiki`

---

## 🎯 Step 2: Set Up Development Environment (15 minutes)

### For You (Lead Developer)

```bash
# 1. Clone repo (if not already)
git clone https://github.com/yourusername/tradehub.git
cd tradehub

# 2. Ensure Node.js 20+ installed
node --version  # Should be v20.x.x
# If not: brew install node@20  (Mac) or nvm install 20

# 3. Enable corepack (for pnpm)
corepack enable
corepack prepare pnpm@9.15.0 --activate

# 4. Install dependencies
pnpm install

# 5. Copy environment template
cp .env.example .env.local

# 6. Add your Supabase credentials to .env.local
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api

# 7. Run dev server
pnpm dev

# 8. Open http://localhost:3000
```

**✅ Expected result:** App loads at localhost:3000 with all pages accessible

---

### For Team Members

Create a `CONTRIBUTING.md` file:

```bash
cat > CONTRIBUTING.md << 'EOF'
# Contributing to TradeHub

## First-Time Setup

1. **Install Node.js 20+**
   - Mac: `brew install node@20`
   - Windows: Download from nodejs.org

2. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/tradehub.git
   cd tradehub
   ```

3. **Enable pnpm**
   ```bash
   corepack enable
   corepack prepare pnpm@9.15.0 --activate
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Ask team lead for Supabase credentials
   ```

6. **Run development server**
   ```bash
   pnpm dev
   ```

## Development Workflow

### Before Starting Work
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/pr1-shell-hardening`
3. Check docs: Review PR checklist in `docs/pr-implementation-checklists.md`

### During Development
1. Run linter frequently: `pnpm lint`
2. Check types: `pnpm typecheck`
3. Test locally: `pnpm dev`

### Before Committing
1. Lint: `pnpm lint`
2. Typecheck: `pnpm typecheck`
3. Build: `pnpm build` (ensure no errors)
4. Commit: `git commit -m "feat(shell): add keyboard shortcuts"`

### Creating PR
1. Push branch: `git push origin feature/pr1-shell-hardening`
2. Create PR on GitHub
3. Fill out PR template (see `.github/pull_request_template.md`)
4. Request review
5. Wait for CI to pass
6. Address feedback
7. Merge when approved

## Branch Naming
- Features: `feature/pr1-shell-hardening`
- Bugs: `fix/sidebar-collapse-bug`
- Docs: `docs/update-api-spec`

## Commit Messages
Follow Conventional Commits:
- `feat(shell): add keyboard shortcuts`
- `fix(jobs): resolve filter state bug`
- `docs(api): update job endpoints`
- `test(escrow): add release validation tests`

## Questions?
- Check docs first: `docs/`
- Ask in Slack #tradehub-dev
- Tag @teamlead for urgent issues
EOF

git add CONTRIBUTING.md
git commit -m "docs: add contributing guide"
git push origin main
```

---

## 📋 Step 3: Create PR Template (5 minutes)

```bash
mkdir -p .github

cat > .github/pull_request_template.md << 'EOF'
## PR Checklist

**PR Number:** PR#__ (e.g., PR1, PR2, PR3)
**Related Docs:** [Link to checklist](../docs/pr-implementation-checklists.md)

### Pre-Merge Checklist
- [ ] `pnpm lint` passes with 0 warnings
- [ ] `pnpm typecheck` passes with 0 errors
- [ ] `pnpm build` succeeds
- [ ] All features tested locally
- [ ] Mobile responsive checked
- [ ] Followed allowed files list
- [ ] No console errors/warnings
- [ ] All done criteria met (see checklist doc)

### Changes Made
<!-- Describe what you built -->

### Screenshots
<!-- Add before/after screenshots -->

### Testing Notes
<!-- How did you test this? -->

### Breaking Changes
<!-- Any breaking changes? -->

### Deploy Notes
<!-- Anything special for deployment? -->
EOF

git add .github/pull_request_template.md
git commit -m "chore: add PR template"
git push origin main
```

---

## 🎬 Step 4: Kick Off PR1 - Shell Hardening (Start Today)

### Create the Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/pr1-shell-hardening
```

### Open Required Files

```bash
# Open these 3 files (allowed for PR1):
code web/src/components/app/AppShell.tsx
code web/src/components/app/TopbarActions.tsx
code web/src/app/app/layout.tsx
```

### Review Checklist

Open `docs/pr-implementation-checklists.md` and scroll to **PR1: Shell Stability Hardening**

### Start Implementation

**Task 1: Test Navigation Links (15 min)**

1. Run `pnpm dev`
2. Click every link in sidebar
3. Check active state highlights
4. Note any broken links

**Task 2: Fix Hydration Warnings (30 min)**

1. Open browser DevTools console
2. Look for "Text content does not match" errors
3. Common causes:
   - Date formatting differences (server vs client)
   - Theme not initialized
   - Random IDs

**Task 3: Test Sidebar Collapse (15 min)**

1. Click hamburger menu
2. Verify sidebar collapses
3. Navigate to new page
4. Check if state persists
5. If not, add state persistence:

```typescript
// AppShell.tsx
const [collapsed, setCollapsed] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  }
  return false
})

const toggleCollapse = () => {
  setCollapsed(prev => {
    const next = !prev
    localStorage.setItem('sidebar-collapsed', String(next))
    return next
  })
}
```

**Continue with full checklist...**

---

## 👥 Step 5: Set Up Team Roles (If Applicable)

### Solo Developer (You)
- You handle all PRs sequentially
- Self-review using checklists
- Deploy each PR to Render for testing

### 2-3 Person Team

**Lead Developer (You):**
- PR1-2: Shell & Dashboard
- PR7: Escrow v1
- PR8: Automation Agents
- Code reviews for all PRs

**Developer 2:**
- PR3-4: Jobs list & detail
- PR5: Clients, Invoices, Calendar

**Developer 3 (Optional):**
- PR6: Marketplace MVP
- Testing & documentation

### 4+ Person Team

- **Frontend Lead:** PR1-5 (Core UI)
- **Backend Lead:** PR7-8 (Escrow, Agents)
- **Full-Stack:** PR6 (Marketplace)
- **QA Engineer:** Testing, E2E tests

---

## 🔧 Step 6: Set Up Essential Tools (10 minutes)

### Install VS Code Extensions

```bash
# Essential extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension Prisma.prisma
code --install-extension GitHub.copilot  # Optional but helpful

# Create .vscode/settings.json
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cx\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
EOF
```

### Set Up Git Hooks (Prevent Bad Commits)

```bash
pnpm add -D husky lint-staged

# Initialize husky
npx husky init

# Add pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
pnpm lint-staged
EOF

chmod +x .husky/pre-commit

# Configure lint-staged in package.json
# Add this to package.json:
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

Now commits will auto-lint and format!

---

## 📊 Step 7: Set Up Project Management (15 minutes)

### Option A: GitHub Projects

1. Go to your repo: `https://github.com/yourusername/tradehub`
2. Click "Projects" tab
3. Create new project: "TradeHub Development"
4. Choose "Board" layout
5. Add columns:
   - 📋 Backlog
   - 🏗️ In Progress
   - 👀 In Review
   - ✅ Done
6. Create issues for each PR:

```bash
# Create PR1 issue
gh issue create --title "PR1: Shell Stability Hardening" --body "See docs/pr-implementation-checklists.md#pr1"

# Create all PRs
for i in {1..8}; do
  gh issue create --title "PR$i: [Title from roadmap]" --label "enhancement"
done
```

---

### Option B: Linear/Jira

1. Create project: "TradeHub"
2. Create 8 issues (one per PR)
3. Link to GitHub repo
4. Set milestones:
   - Week 1: PR1-2
   - Week 2: PR3-5
   - Week 3-4: PR6-7
   - Week 5-6: PR8

---

## 🚀 Step 8: First Deployment Check (5 minutes)

```bash
# Ensure Render deployment is working
# Check: https://tradehub-app.onrender.com

# Verify environment variables are set in Render:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - OPENAI_API_KEY (for future agents)
# - GITHUB_TOKEN (for future agents)

# Test manual deploy
git push origin main  # Should trigger deploy

# Watch deploy logs in Render dashboard
```

---

## ✅ Step 9: Daily Development Workflow

### Morning (Start of Day)

```bash
# 1. Pull latest
git checkout main
git pull origin main

# 2. Check what you're working on
# - Look at current PR checklist
# - Review yesterday's progress

# 3. Create/checkout feature branch
git checkout -b feature/pr1-shell-hardening
# or if exists: git checkout feature/pr1-shell-hardening

# 4. Start dev server
pnpm dev

# 5. Open relevant files
code web/src/components/app/AppShell.tsx
```

### During Day (Development Loop)

```bash
# Every 30-60 minutes:

# 1. Save files
# 2. Check browser for errors
# 3. Run lint
pnpm lint

# 4. Run typecheck
pnpm typecheck

# 5. Commit progress
git add .
git commit -m "feat(shell): add sidebar persistence"
```

### End of Day

```bash
# 1. Final checks
pnpm lint
pnpm typecheck
pnpm build

# 2. Commit & push
git add .
git commit -m "feat(shell): complete sidebar collapse task"
git push origin feature/pr1-shell-hardening

# 3. Update checklist
# - Mark completed tasks in docs/pr-implementation-checklists.md
# - Commit checklist updates

# 4. Create PR if task complete
# - Go to GitHub
# - Create Pull Request
# - Fill out template
# - Request review (or self-review if solo)
```

---

## 🎯 Your Next 24 Hours

### Hour 1 (Documentation)
- ✅ Upload docs to GitHub repo
- ✅ Create CONTRIBUTING.md
- ✅ Create PR template
- ✅ Set up VS Code extensions

### Hour 2 (Environment)
- ✅ Verify local dev works
- ✅ Install git hooks
- ✅ Test linting/typechecking
- ✅ Review PR1 checklist

### Hour 3-8 (PR1 Development)
- ✅ Test all navigation links
- ✅ Fix hydration warnings
- ✅ Add sidebar persistence
- ✅ Test mobile behavior
- ✅ Test keyboard shortcuts
- ✅ Run full checklist

### End of Day 1
- ✅ Create PR1
- ✅ Deploy to Render for testing
- ✅ Self-review
- ✅ Merge if passing

---

## 📞 Need Help?

### Common Issues

**"pnpm not found"**
```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

**"Hydration errors"**
- Check for Date formatting
- Check theme initialization
- Look for useEffect without proper guards

**"Build fails but dev works"**
- Check for `window` usage in Server Components
- Ensure all imports are valid
- Check for circular dependencies

**"Render deploy fails"**
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure build command is correct

---

## 🎊 Success Criteria

**Week 1 Complete When:**
- ✅ PR1 merged: Shell stable, zero hydration warnings
- ✅ PR2 merged: Dashboard dense, charts rendering
- ✅ Team comfortable with workflow
- ✅ CI/CD pipeline green

**Week 2 Complete When:**
- ✅ PR3 merged: Jobs table functional
- ✅ PR4 merged: Job detail with tabs
- ✅ PR5 merged: Clients, Invoices, Calendar polished

**Week 6 Complete When:**
- ✅ All 8 PRs merged
- ✅ Escrow v1 functional
- ✅ Agents running
- ✅ Ready for beta testing

---

## 📚 Documentation Access Quick Reference

After uploading to GitHub, your team accesses docs at:

```
https://github.com/yourusername/tradehub/tree/main/docs

Direct links:
- Architecture: /docs/architecture-diagram.md
- Roadmap: /docs/development-roadmap.md
- Checklists: /docs/pr-implementation-checklists.md
- Tech Spec: /docs/technical-specification.md
- State Machines: /docs/state-machine-diagrams.md
- Recommendations: /docs/RECOMMENDATIONS.md
```

Bookmark this URL! 🔖

---

## 🏁 You're Ready!

You now have:
- ✅ 5 comprehensive documentation files
- ✅ Exact implementation checklists
- ✅ Development workflow defined
- ✅ Team setup guide
- ✅ Daily routine established

**Next command to run:**

```bash
git checkout -b feature/pr1-shell-hardening
code web/src/components/app/AppShell.tsx
pnpm dev
```

**Let's build! 🚀**
