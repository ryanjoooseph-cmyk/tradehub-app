"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);

    if (error) return setMsg(error.message);

    router.replace("/app");
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <h1>Set new password</h1>
      <form onSubmit={onSubmit}>
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="New password"
          type="password"
          style={{ width: "100%", padding: 12, marginTop: 12 }}
        />
        <button disabled={loading} style={{ width: "100%", padding: 12, marginTop: 12 }}>
          {loading ? "Saving..." : "Save password"}
        </button>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
