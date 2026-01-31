import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/app/filled/section";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="Settings" subtitle="Org, notifications, integrations, billing surfaces." />
        <Badge variant="default">Environment: Production</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Name, ABN, branding, default terms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="rounded-lg border bg-muted/10 p-3">TradeHub Pty Ltd</div>
            <div className="rounded-lg border bg-muted/10 p-3">Notifications: Email + in-app</div>
            <div className="rounded-lg border bg-muted/10 p-3">Branding: Logo + colors</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Supabase, Render, GitHub, OpenAI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
              <span>Supabase</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
              <span>Render</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
              <span>GitHub</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
              <span>OpenAI</span>
              <Badge variant="warn">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
