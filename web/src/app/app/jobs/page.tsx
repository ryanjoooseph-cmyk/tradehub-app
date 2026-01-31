import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Jobs</div>
        <div className="mt-1 text-sm text-muted-foreground">Pipeline view + drag schedule (next).</div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Jobs Table</CardTitle>
          <CardDescription>Premium table + filters + quick actions (next).</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">UI shell shipped. Data wiring next.</CardContent>
      </Card>
    </div>
  );
}
