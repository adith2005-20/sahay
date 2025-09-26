import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import { DashboardContent } from "./DashboardContent";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  type UserMetadata = {
    display_name?: string;
    full_name?: string;
  };
  type Claims = {
    user_metadata?: UserMetadata;
  };

  const claims = (data?.claims ?? null) as Claims | null;
  const meta: UserMetadata = claims?.user_metadata ?? {};
  const name = meta.display_name ?? meta.full_name ?? "User";

  return <DashboardContent name={name} />;
}
