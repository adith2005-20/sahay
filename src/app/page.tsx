"use client";

import { LatestPost } from "@/app/_components/post";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center text-white">
      <Link href={"/dashboard"}>
        <Button>{t("header.navigation.dashboard")}</Button>
      </Link>
    </main>
  );
}
