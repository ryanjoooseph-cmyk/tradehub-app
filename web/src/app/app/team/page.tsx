import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Team</div>
        <div className="mt-1 text-sm text-muted-foreground">Roster, utilization, compliance, roles (next).</div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Ops</CardTitle>
          <CardDescription>Availability + assignments + performance.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">UI shell shipped. Data wiring next.</CardContent>
      </Card>
    </div>
  );
}
