"use client";

import { useTranslation } from "@/contexts/LanguageContext";
import Landing from "@/app/_components/Landing";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="relative">
      <Landing />
    </main>
  );
}
