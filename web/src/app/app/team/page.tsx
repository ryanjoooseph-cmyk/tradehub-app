import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/app/filled/section";

const team = [
  { name: "Crew 1", lead: "Sam", load: 72, compliance: "OK" },
  { name: "Crew 2", lead: "Mick", load: 81, compliance: "OK" },
  { name: "Crew 3", lead: "Jess", load: 55, compliance: "Watch" },
];

const vt = (n: number): "default" | "success" | "warn" | "danger" => {
  if (n >= 85) return "danger";
  if (n >= 70) return "warn";
  return "success";
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="Team" subtitle="Roster + load + compliance + assignments surface." />
        <Badge variant="default">Units: {team.length}</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {team.map((t) => (
          <Card key={t.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t.name}</span>
                <Badge variant={t.compliance === "OK" ? "success" : "warn"}>{t.compliance}</Badge>
              </CardTitle>
              <CardDescription>Lead: {t.lead}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Load</span>
                <Badge variant={vt(t.load)}>{t.load}%</Badge>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/40">
                <div className="h-2 rounded-full bg-foreground/60" style={{ width: t.load + "%" }} />
              </div>
              <div className="rounded-lg border bg-muted/10 p-3 text-xs text-muted-foreground">
                Next: assign jobs from Jobs → updates schedule automatically.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
