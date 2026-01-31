import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/app/filled/section";
import { OpsCalendar } from "@/components/app/calendar";

const jobs = [
  { id: "J-1402", client: "Acme Body Corp", site: "Tower A", status: "Scheduled", value: 18500, date: "Thu 10:00", crew: "Crew 2" },
  { id: "J-1403", client: "Bayside Strata", site: "Block C", status: "In Progress", value: 9200, date: "Today", crew: "Crew 1" },
  { id: "J-1404", client: "Northpoint OC", site: "Lobby", status: "Quote", value: 3200, date: "—", crew: "—" },
  { id: "J-1405", client: "Riverside Mgmt", site: "Roof deck", status: "QA", value: 6100, date: "Fri 14:00", crew: "Crew 3" },
];

const laneTone = (s: string): "default" | "success" | "warn" | "danger" => {
  const t = s.toLowerCase();
  if (t.includes("progress")) return "warn";
  if (t.includes("scheduled")) return "default";
  if (t.includes("qa")) return "warn";
  if (t.includes("complete")) return "success";
  if (t.includes("dispute") || t.includes("blocked")) return "danger";
  return "default";
};

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="Jobs" subtitle="Register + schedule surface (calendar belongs here)." />
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="default">Pipeline: ${jobs.reduce((a, j) => a + j.value, 0).toLocaleString()}</Badge>
          <Badge variant="warn">At risk: 1</Badge>
          <Badge variant="success">On time: 93%</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduler</CardTitle>
          <CardDescription>Drag & drop rescheduling lives here.</CardDescription>
        </CardHeader>
        <CardContent>
          <OpsCalendar />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Register</CardTitle>
          <CardDescription>Premium table + filters + quick actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Job</th>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left">Site</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Scheduled</th>
                  <th className="px-3 py-2 text-left">Crew</th>
                  <th className="px-3 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="border-t">
                    <td className="px-3 py-2 font-medium">{j.id}</td>
                    <td className="px-3 py-2">{j.client}</td>
                    <td className="px-3 py-2">{j.site}</td>
                    <td className="px-3 py-2">
                      <Badge variant={laneTone(j.status)}>{j.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{j.date}</td>
                    <td className="px-3 py-2 text-muted-foreground">{j.crew}</td>
                    <td className="px-3 py-2 text-right">${j.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
