import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Invoices</div>
        <div className="mt-1 text-sm text-muted-foreground">Cashflow-grade invoicing + reconciliation (next).</div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Center</CardTitle>
          <CardDescription>Status lanes, PDFs, payment links.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">UI shell shipped. Data wiring next.</CardContent>
      </Card>
    </div>
  );
}
