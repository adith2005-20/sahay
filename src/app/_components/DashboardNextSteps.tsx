"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export function DashboardNextSteps() {
  const router = useRouter();

  return (
    <section className="relative w-full px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background accents */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Next steps
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Take the onboarding quiz card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-tr from-violet-600/15 via-fuchsia-500/10 to-cyan-500/15 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col h-full">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-600/15 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 ring-1 ring-inset ring-violet-600/30">
                Onboarding
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Take the onboarding quiz
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Kickstart your personalized experience by completing the RIASEC
              quiz. It only takes a couple of minutes.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/quiz/riasec")}
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
              >
                Start quiz
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
          className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-sky-500/15 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col h-full">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/30">
                Profile
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Complete your profile
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Add additional details to help tailor your experience on Sahay.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/profile")}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                Complete profile
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
          className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-tr from-violet-600/15 via-fuchsia-500/10 to-cyan-500/15 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col h-full">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-600/15 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 ring-1 ring-inset ring-violet-600/30">
                Deep-dive
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              For Students in 9th or 10th
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Unsure about the next path ahead? Take this assessment and find out your forte.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/quiz/9_10")}
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
              >
                Start quiz
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
