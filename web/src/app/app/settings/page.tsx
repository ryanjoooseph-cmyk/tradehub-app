import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Admin</div>
        <div className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</div>
        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Brand, org, and system preferences.</div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="rounded-3xl">
          <CardContent className="p-5 space-y-3">
            <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Organization</div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Company name</div>
              <Input defaultValue="TradeHub" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Timezone</div>
              <Input defaultValue="Australia/Melbourne" />
            </div>
            <Button className="rounded-2xl">Save</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-5 space-y-3">
            <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Security</div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Session policy</div>
              <Input defaultValue="Strict" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">2FA</div>
              <Input defaultValue="Enabled" />
            </div>
            <Button variant="secondary" className="rounded-2xl">Rotate keys</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
