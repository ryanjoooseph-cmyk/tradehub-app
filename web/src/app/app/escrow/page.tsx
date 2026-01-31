import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EscrowPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Escrow</div>
          <div className="mt-1 text-sm text-muted-foreground">
            TradeHub-grade holds, milestones, releases, dispute safety.
          </div>
        </div>
        <Badge variant="success">Mode: Safe</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>Deposit → Work → QA → Release</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            UI shell shipped. Next: milestone model + inspector workflow + release ledger.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispute Shield</CardTitle>
            <CardDescription>Evidence, inspection, decision log.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            UI shell shipped. Next: connect to disputes table + agent_tasks_outcomes.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
