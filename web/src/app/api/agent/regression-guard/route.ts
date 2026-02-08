import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../_lib/auth';
import { checkRateLimit } from '../_lib/rateLimit';
import { logAuditEvent, hashInput } from '../_lib/audit';

type RegressionGuardInput = {
  prUrl: string;
  sha: string;
  repo: string;
  changedFiles: string[];
};

type RegressionGuardOutput = {
  ok: boolean;
  changedRoutes: string[];
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  checklist: string[];
  notes: string[];
};

// Map file paths to route prefixes
const ROUTE_PATTERNS = [
  { pattern: /web\/src\/app\/app\/dashboard/, route: '/app/dashboard' },
  { pattern: /web\/src\/app\/app\/jobs/, route: '/app/jobs' },
  { pattern: /web\/src\/app\/app\/clients/, route: '/app/clients' },
  { pattern: /web\/src\/app\/app\/invoices/, route: '/app/invoices' },
  { pattern: /web\/src\/app\/app\/escrow/, route: '/app/escrow' },
  { pattern: /web\/src\/app\/app\/calendar/, route: '/app/calendar' },
  { pattern: /web\/src\/app\/app\/team/, route: '/app/team' },
  { pattern: /web\/src\/app\/app\/settings/, route: '/app/settings' },
  { pattern: /web\/src\/app\/market/, route: '/market' },
  { pattern: /web\/src\/app\/login/, route: '/login' },
  { pattern: /web\/src\/app\/dispatch/, route: '/dispatch' },
  { pattern: /web\/src\/components\/app\/AppShell/, route: '/app/* (shell)' },
  { pattern: /web\/src\/components\/app\//, route: '/app/* (shared components)' },
  { pattern: /web\/src\/app\/layout\.tsx/, route: '/* (root layout)' },
  { pattern: /web\/src\/styles/, route: '/* (global styles)' },
];

function determineChangedRoutes(changedFiles: string[]): string[] {
  const routes = new Set<string>();

  for (const file of changedFiles) {
    for (const { pattern, route } of ROUTE_PATTERNS) {
      if (pattern.test(file)) {
        routes.add(route);
      }
    }
  }

  return Array.from(routes).sort();
}

function assessRisk(changedRoutes: string[]): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (changedRoutes.length === 0) return 'LOW';
  
  // High risk: root layout or shell changes affect all routes
  const hasRootLayout = changedRoutes.some(r => r.includes('root layout'));
  const hasShell = changedRoutes.some(r => r.includes('shell'));
  const hasGlobalStyles = changedRoutes.some(r => r.includes('global styles'));
  const hasSharedComponents = changedRoutes.some(r => r.includes('shared components'));
  
  if (hasRootLayout || hasShell) return 'HIGH';
  if (hasGlobalStyles || hasSharedComponents) return 'MEDIUM';
  if (changedRoutes.length >= 4) return 'MEDIUM';
  
  return 'LOW';
}

function generateChecklist(changedRoutes: string[], risk: string): string[] {
  const checklist: string[] = [];
  
  if (changedRoutes.length === 0) {
    checklist.push('No UI routes affected - regression risk minimal');
    return checklist;
  }

  // Always check these
  checklist.push('Verify no console errors in browser');
  checklist.push('Test dark/light theme toggle works');
  checklist.push('Confirm mobile responsive layout');
  
  // Route-specific checks
  if (changedRoutes.some(r => r.includes('/app/jobs'))) {
    checklist.push('Test jobs table: sorting, filtering, row clicks');
    checklist.push('Verify job detail page loads with all tabs');
  }
  
  if (changedRoutes.some(r => r.includes('/app/dashboard'))) {
    checklist.push('Check KPI cards display with correct values');
    checklist.push('Verify charts render without errors');
  }
  
  if (changedRoutes.some(r => r.includes('/app/escrow'))) {
    checklist.push('Test escrow table filters and search');
    checklist.push('Verify milestone status transitions');
  }
  
  if (changedRoutes.some(r => r.includes('/market'))) {
    checklist.push('Test marketplace: job posting flow');
    checklist.push('Verify checkout and escrow funding flow');
  }
  
  if (changedRoutes.some(r => r.includes('shell') || r.includes('layout'))) {
    checklist.push('Test navigation: all menu items work');
    checklist.push('Verify sidebar collapse/expand on mobile');
    checklist.push('Check user menu and logout flow');
    checklist.push('Test all routes load without layout shifts');
  }
  
  if (changedRoutes.some(r => r.includes('shared components'))) {
    checklist.push('Verify shared components render correctly across routes');
    checklist.push('Test component props and state management');
  }
  
  if (risk === 'HIGH') {
    checklist.push('CRITICAL: Test all major routes for regressions');
    checklist.push('CRITICAL: Verify authentication flows still work');
  }
  
  return checklist;
}

function generateNotes(changedRoutes: string[], risk: string): string[] {
  const notes: string[] = [];
  
  if (changedRoutes.length === 0) {
    notes.push('No UI changes detected. Backend-only changes.');
    return notes;
  }

  notes.push(`${changedRoutes.length} route area(s) potentially affected by this PR.`);
  
  if (risk === 'HIGH') {
    notes.push('⚠️ HIGH RISK: Changes affect core shell or layout - comprehensive testing required.');
    notes.push('Consider manual QA pass on all major user flows.');
  } else if (risk === 'MEDIUM') {
    notes.push('⚠️ MEDIUM RISK: Changes affect multiple routes or shared components.');
    notes.push('Recommend testing affected routes thoroughly.');
  } else {
    notes.push('✓ LOW RISK: Changes isolated to specific route(s).');
  }
  
  notes.push('No automated UI tests yet - manual verification required.');
  
  return notes;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const agentName = 'regression-guard';

  // Auth check
  const authError = requireAuth(req);
  if (authError) return authError;

  // Rate limit check
  const rateLimitError = checkRateLimit(req, agentName);
  if (rateLimitError) return rateLimitError;

  try {
    const input: RegressionGuardInput = await req.json();
    const inputHash = hashInput(input);

    // Validate input
    if (!input.prUrl || !input.sha || !input.repo) {
      logAuditEvent({
        agentName,
        inputHash,
        outputSummary: 'Missing required fields',
        status: 'failure',
        error: 'VALIDATION_ERROR',
      });
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: prUrl, sha, repo', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const changedFiles = input.changedFiles || [];
    const changedRoutes = determineChangedRoutes(changedFiles);
    const risk = assessRisk(changedRoutes);
    const checklist = generateChecklist(changedRoutes, risk);
    const notes = generateNotes(changedRoutes, risk);

    const output: RegressionGuardOutput = {
      ok: true,
      changedRoutes,
      risk,
      checklist,
      notes,
    };

    // Log success
    logAuditEvent({
      agentName,
      inputHash,
      outputSummary: `Risk: ${risk}, Routes: ${changedRoutes.length}`,
      status: 'success',
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(output);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logAuditEvent({
      agentName,
      inputHash: 'error',
      outputSummary: 'Agent execution failed',
      status: 'failure',
      error: errorMessage,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      { ok: false, error: errorMessage, code: 'AGENT_ERROR' },
      { status: 500 }
    );
  }
}
