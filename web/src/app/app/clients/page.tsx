import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Clients</div>
        <div className="mt-1 text-sm text-muted-foreground">CRM-grade client profiles (next).</div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>Segmented list + activity + jobs + invoices.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">UI shell shipped. Data wiring next.</CardContent>
      </Card>
    </div>
  );
}
