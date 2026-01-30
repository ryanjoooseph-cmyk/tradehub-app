import { Topbar } from "@/components/shell/topbar";
import { demoInvoices, money } from "@/lib/demo-data";

export default function Page() {
  return (
    <>
      <Topbar title="Invoices" subtitle="Billing + cashflow (demo)" />
      <div className="p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Invoice</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Issued</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {demoInvoices.map((i) => (
                <tr key={i.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium">{i.id}</td>
                  <td className="px-4 py-3">{i.client}</td>
                  <td className="px-4 py-3">{new Date(i.issuedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold">{money(i.amountCents)}</td>
                  <td className="px-4 py-3">{i.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
