import { Topbar } from "@/components/shell/topbar";
import { demoClients } from "@/lib/demo-data";

export default function Page() {
  return (
    <>
      <Topbar title="Clients" subtitle="Contacts + properties (demo)" />
      <div className="p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 text-sm font-semibold">Client directory</div>
          <div className="divide-y divide-neutral-200">
            {demoClients.map((c) => (
              <div key={c.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-neutral-900">{c.name}</div>
                  <div className="mt-1 text-xs text-neutral-500">{c.address}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-neutral-900">{c.phone}</div>
                  <div className="mt-1 text-xs text-neutral-500">{c.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
