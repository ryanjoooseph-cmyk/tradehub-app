// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getBrowserClient } from "../../lib/supabase";

type Profile = { id: string; full_name: string | null; bio: string | null };

export default function ProfilePage() {
  const supabase = getBrowserClient();
  const [loading, setLoading] = useState(true);
  const [p, setP] = useState<Profile | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        await supabase.auth.signInWithOtp({ email: prompt("Enter email for magic link login") || "" });
        setMsg("Magic link sent. Check your inbox and reload this page.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) setMsg(error.message);
      else setP(data ?? { id: user.id, full_name: "", bio: "" });
      setLoading(false);
    })();
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!p) return;
    setMsg(null);
    const { error } = await supabase.from("profiles").upsert({
      id: p.id, full_name: p.full_name, bio: p.bio, updated_at: new Date().toISOString()
    });
    setMsg(error ? error.message : "Saved.");
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ fontSize: 24, margin: "8px 0 16px" }}>Profile</h1>
      {msg && <p style={{ fontSize: 12, opacity: .8 }}>{msg}</p>}
      {p && (
        <form onSubmit={onSave} style={{ display: "grid", gap: 12 }}>
          <label>
            <div style={{ fontSize: 12, opacity: .7, marginBottom: 4 }}>Full name</div>
            <input
              value={p.full_name ?? ""}
              onChange={(e) => setP({ ...p, full_name: e.target.value })}
              style={{ width: "100%", padding: 10, background: "#0f1216", color: "#e6e6e6",
                       border: "1px solid #1b1f24", borderRadius: 8 }}
            />
          </label>
          <label>
            <div style={{ fontSize: 12, opacity: .7, marginBottom: 4 }}>Bio</div>
            <textarea
              value={p.bio ?? ""}
              onChange={(e) => setP({ ...p, bio: e.target.value })}
              rows={4}
              style={{ width: "100%", padding: 10, background: "#0f1216", color: "#e6e6e6",
                       border: "1px solid #1b1f24", borderRadius: 8, resize: "vertical" }}
            />
          </label>
          <button type="submit" style={{
            padding: "10px 12px", borderRadius: 8, background: "#1976d2",
            border: 0, color: "white", fontWeight: 600, cursor: "pointer"
          }}>Save</button>
        </form>
      )}
    </div>
  );
}
