import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { team } from "@/lib/demo";

export default function TeamPage(){
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground">Crew roster, capability, availability.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {team.map(t=>(
          <Card key={t.id} className="rounded-2xl border bg-card/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
              <Badge variant="outline" className="rounded-full text-[11px]">{t.availability}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.skills.map(s=>(<Badge key={s} variant="outline" className="rounded-full text-[11px]">{s}</Badge>))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
