import { Topbar } from "@/components/shell/topbar";

export default function Page() {
  return (
    <>
      <Topbar title="Settings" subtitle="Branding, defaults, integrations (stub)" />
      <div className="p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="text-sm font-semibold">Coming next</div>
          <div className="mt-2 text-sm text-neutral-500">
            Company profile, job templates, invoice defaults, calendar settings, escrow rules, and integrations.
          </div>
        </div>
      </div>
    </>
  );
}
