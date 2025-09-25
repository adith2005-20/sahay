"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useTranslation } from "@/contexts/LanguageContext";

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

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Take the onboarding quiz card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl border border-neutral-200/60 bg-gradient-to-tr from-violet-600/15 via-fuchsia-500/10 to-cyan-500/15 p-5 shadow-sm sm:p-6 dark:border-neutral-800/60"
        >
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-600/15 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-600/30 ring-inset dark:text-violet-300">
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
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:outline-none"
              >
                {t("button.startQuiz")}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Complete profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl border border-neutral-200/60 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-sky-500/15 p-5 shadow-sm sm:p-6 dark:border-neutral-800/60"
        >
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/30 ring-inset dark:text-emerald-300">
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
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
              >
                {t("dashboard.updateProfile")}
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
          className="rounded-2xl border border-neutral-200/60 bg-gradient-to-tr from-violet-600/15 via-fuchsia-500/10 to-cyan-500/15 p-5 shadow-sm sm:p-6 dark:border-neutral-800/60"
        >
          <div className="flex h-full flex-col">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-600/15 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-600/30 ring-inset dark:text-violet-300">
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
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:outline-none"
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
