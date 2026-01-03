"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase";

type Profile = { id: string; full_name: string | null; bio: string | null };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = getBrowserClient();
    supabase
      .from("profiles")
      .select("id, full_name, bio")
      .single()
      .then(({ data }) => setProfile(data as any))
      .catch(() => setProfile(null));
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  );
}
