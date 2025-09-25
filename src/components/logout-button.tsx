"use client";

import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";

export function LogoutButton() {
  const router = useRouter();
  const { t } = useTranslation();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>{t("button.logout")}</Button>;
}
