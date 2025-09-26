"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export function DashboardNextSteps() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
      {/* Background accents */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-50">
          {t("dashboard.nextSteps")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Take the onboarding quiz card */}
        <SpotlightCard variant="orange" className="p-5 sm:p-6">
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-500/30 ring-inset dark:text-orange-300">
                {t("dashboard.onboarding")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-neutral-100">
              {t("dashboard.takeQuiz")}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {t("dashboard.quizDescription")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/quiz/riasec")}
                className="inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:outline-none"
              >
                {t("button.startQuiz")}
              </button>
            </div>
          </div>
        </SpotlightCard>

        {/* Complete profile card */}
        <SpotlightCard variant="rusty" className="p-5 sm:p-6">
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-600/20 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/30 ring-inset dark:text-amber-300">
                {t("dashboard.profile")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-neutral-100">
              {t("dashboard.completeProfile")}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {t("dashboard.profileDescription")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/profile")}
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:outline-none"
              >
                {t("dashboard.updateProfile")}
              </button>
            </div>
          </div>
        </SpotlightCard>
        
        {/* Student quiz card */}
        <SpotlightCard variant="orange" className="p-5 sm:p-6 md:col-span-2">
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-500/30 ring-inset dark:text-orange-300">
                {t("dashboard.deepDive")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-neutral-100">
              {t("dashboard.studentQuiz")}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {t("dashboard.studentQuizDescription")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/quiz/9_10")}
                className="inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:outline-none"
              >
                {t("button.startQuiz")}
              </button>
            </div>
          </div>
        </SpotlightCard>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl border border-neutral-200/60 bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-red-500/15 p-5 shadow-sm sm:p-6 dark:border-neutral-800/60"
        >
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-600/15 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/30 ring-inset dark:text-amber-300">
                {t("dashboard.deepDive")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-neutral-100">
              {t("dashboard.seniorStudentQuiz")}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {t("dashboard.seniorStudentQuizDescription")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/quiz/11_12")}
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:outline-none"
              >
                {t("button.startQuiz")}
              </button>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl border border-neutral-200/60 bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-red-500/15 p-5 shadow-sm sm:p-6 dark:border-neutral-800/60"
        >
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-600/15 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/30 ring-inset dark:text-amber-300">
                {t("dashboard.deepDive")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-neutral-100">
              {t("dashboard.seniorStudentQuiz")}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {t("dashboard.seniorStudentQuizDescription")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/quiz/11_12")}
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:outline-none"
              >
                {t("button.startQuiz")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
