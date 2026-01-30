import { Topbar } from "@/components/shell/topbar";

export default function Page() {
  return (
    <>
      <Topbar title="Team" subtitle="Roles, permissions, availability (stub)" />
      <div className="p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="text-sm font-semibold">Coming next</div>
          <div className="mt-2 text-sm text-neutral-500">
            Team roster, roles, rate cards, time tracking, and scheduling conflicts.
          </div>
        </div>
      </div>
    </>
  );
}
