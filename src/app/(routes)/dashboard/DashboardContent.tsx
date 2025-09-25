"use client";

import { useTranslation } from "@/contexts/LanguageContext";
import { LogoutButton } from "@/components/logout-button";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { DashboardNextSteps } from "@/app/_components/DashboardNextSteps";
import AIAdvisor from "@/app/_components/AIAdvisor";

interface DashboardContentProps {
  name: string;
}

export function DashboardContent({ name }: DashboardContentProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-svh w-full px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <CurrentUserAvatar />
            <div>
              <p className="text-3xl leading-tight font-black sm:text-4xl lg:text-5xl">
                <span className="animate-gradient bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 bg-[length:100%_auto] bg-clip-text text-transparent">
                  {t("dashboard.welcome")}
                </span>
                <br />
                <span className="text-foreground">{name}!</span>
              </p>
              <p className="text-muted-foreground mt-2 text-lg">
                {t("dashboard.nextSteps")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Next Steps */}
          <div className="lg:col-span-2">
            <DashboardNextSteps />
          </div>

          {/* Right Column - AI Advisor */}
          <div className="lg:col-span-1">
            <AIAdvisor />
          </div>
        </div>
      </div>
    </div>
  );
}
