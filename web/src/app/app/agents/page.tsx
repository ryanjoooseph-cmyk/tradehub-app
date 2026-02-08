"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/app/filled/section";

type AuditEvent = {
  id: string;
  timestamp: string;
  agentName: string;
  inputHash: string;
  outputSummary: string;
  status: "success" | "failure";
  error?: string;
  durationMs?: number;
};

type FilterState = {
  agent: string;
  status: string;
  range: string;
};

const AGENTS = [
  "all",
  "ci-triage",
  "release-manager",
  "regression-guard",
  "support-triage",
  "dispute-assistant",
  "data-entry",
];

const TIME_RANGES = [
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

export default function AgentsPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    agent: "all",
    status: "all",
    range: "24h",
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.agent !== "all") params.set("agent", filters.agent);
      if (filters.status !== "all") params.set("status", filters.status);
      params.set("range", filters.range);
      params.set("limit", "100");

      // Get the secret from localStorage or use a default for dev
      const secret = localStorage.getItem("agent-secret") || "";

      const res = await fetch(`/api/agent/audit-events?${params}`, {
        headers: {
          "x-agent-secret": secret,
        },
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }

      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (ms?: number) => {
    if (ms === undefined) return "-";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const successCount = events.filter((e) => e.status === "success").length;
  const failureCount = events.filter((e) => e.status === "failure").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          title="Agent Audit Timeline"
          subtitle="Monitor agent activity, success/failure rates, and debug issues"
        />
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="success">{successCount} success</Badge>
          <Badge variant="danger">{failureCount} failures</Badge>
          <Badge variant="default">{events.length} total</Badge>
        </div>
      </div>

      {/* Secret Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Enter x-agent-secret"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              onChange={(e) => {
                localStorage.setItem("agent-secret", e.target.value);
              }}
              defaultValue={typeof window !== "undefined" ? localStorage.getItem("agent-secret") || "" : ""}
            />
            <button
              onClick={fetchEvents}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
            >
              Refresh
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Agent</label>
              <select
                value={filters.agent}
                onChange={(e) => handleFilterChange("agent", e.target.value)}
                className="block w-40 rounded-md border bg-background px-3 py-2 text-sm"
              >
                {AGENTS.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent === "all" ? "All agents" : agent}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="block w-32 rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Time Range</label>
              <select
                value={filters.range}
                onChange={(e) => handleFilterChange("range", e.target.value)}
                className="block w-40 rounded-md border bg-background px-3 py-2 text-sm"
              >
                {TIME_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `Showing ${events.length} events`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No audit events found. Agent calls will appear here.
            </div>
          )}

          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border bg-muted/10 transition-colors hover:bg-muted/20"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{event.agentName}</span>
                      <Badge variant={event.status === "success" ? "success" : "danger"}>
                        {event.status}
                      </Badge>
                      {event.durationMs !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(event.durationMs)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 truncate text-sm text-muted-foreground">
                      {event.outputSummary}
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </div>
                </button>

                {expandedId === event.id && (
                  <div className="border-t bg-muted/5 p-4 text-sm">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Event ID</div>
                        <div className="font-mono text-xs">{event.id}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Input Hash</div>
                        <div className="font-mono text-xs">{event.inputHash}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-xs font-medium text-muted-foreground">Output Summary</div>
                        <div className="mt-1">{event.outputSummary}</div>
                      </div>
                      {event.error && (
                        <div className="sm:col-span-2">
                          <div className="text-xs font-medium text-destructive">Error</div>
                          <div className="mt-1 font-mono text-xs text-destructive">{event.error}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Duration</div>
                        <div>{formatDuration(event.durationMs)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Timestamp</div>
                        <div className="font-mono text-xs">{event.timestamp}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
