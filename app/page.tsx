import { redirect } from "next/navigation";

export default function Page() {
  const disabled =
    process.env.DISABLE_AUTH === "true" ||
    process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

  redirect(disabled ? "/app" : "/login");
}
