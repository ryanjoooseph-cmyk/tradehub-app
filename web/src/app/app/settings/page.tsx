import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Settings</div>
        <div className="mt-1 text-sm text-muted-foreground">Org, billing, notifications, integrations.</div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Advanced config panels (next).</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">UI shell shipped. Data wiring next.</CardContent>
      </Card>
    </div>
  );
}
