"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation, type Locale } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Define the job listing type with multilingual fields
interface JobListing {
  id: string;
  created_at: string;

  // English content
  title_en: string;
  description_en: string;
  requirements_en?: string;
  benefits_en?: string;

  // Hindi content
  title_hi?: string;
  description_hi?: string;
  requirements_hi?: string;
  benefits_hi?: string;

  // Kashmiri content
  title_ks?: string;
  description_ks?: string;
  requirements_ks?: string;
  benefits_ks?: string;

  // Non-translatable fields
  company_name: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  employment_type: string;
  is_active: boolean;
}

// Define translatable field base names
type TranslatableField = "title" | "description" | "requirements" | "benefits";

// Helper function to get localized content with fallback
function getLocalizedContent(
  job: JobListing,
  field: TranslatableField,
  locale: Locale,
): string {
  // Try to get the localized version
  const localizedField = `${field}_${locale}` as keyof JobListing;
  const localizedContent = job[localizedField] as string;

  if (localizedContent && localizedContent.trim()) {
    return localizedContent;
  }

  // Fallback to English
  const englishField = `${field}_en` as keyof JobListing;
  const englishContent = job[englishField] as string;

  return englishContent || "";
}

// Component to display a single job listing
const JobCard: React.FC<{ job: JobListing }> = ({ job }) => {
  const { locale, t } = useTranslation();

  const title = getLocalizedContent(job, "title", locale);
  const description = getLocalizedContent(job, "description", locale);
  const requirements = getLocalizedContent(job, "requirements", locale);
  const benefits = getLocalizedContent(job, "benefits", locale);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t("jobs.salary") + ": " + t("common.info");
    if (min && max)
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `${t("jobs.salary")}: ${t("common.info")}`;
  };

  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2 text-xl">{title}</CardTitle>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <span>
                {t("jobs.company")}: {job.company_name}
              </span>
              <span>
                {t("jobs.location")}: {job.location}
              </span>
              <span>{formatSalary(job.salary_min, job.salary_max)}</span>
              <span className="capitalize">{job.employment_type}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {description}
            </p>
          </div>

          {requirements && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">
                {t("jobs.requirements") || "Requirements"}
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {requirements}
              </p>
            </div>
          )}

          {benefits && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">
                {t("jobs.benefits") || "Benefits"}
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {benefits}
              </p>
            </div>
          )}

          <Separator />

          <div className="flex gap-2">
            <Button size="sm">{t("jobs.applyNow")}</Button>
            <Button variant="outline" size="sm">
              {t("jobs.viewDetails")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component that fetches and displays job listings
const JobListings: React.FC = () => {
  const { locale, t } = useTranslation();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchJobs();
  }, []); // We don't need to refetch when locale changes since we have all translations

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all job listings with all language columns
      const { data, error: supabaseError } = await supabase
        .from("job_listings")
        .select(
          `
          id,
          created_at,
          title_en,
          description_en,
          requirements_en,
          benefits_en,
          title_hi,
          description_hi,
          requirements_hi,
          benefits_hi,
          title_ks,
          description_ks,
          requirements_ks,
          benefits_ks,
          company_name,
          location,
          salary_min,
          salary_max,
          employment_type,
          is_active
        `,
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        setError("Failed to fetch job listings");
        return;
      }

      setJobs(data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-red-500">
          <p className="font-semibold">{t("common.error")}</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={fetchJobs} variant="outline">
          {t("common.retry") || "Retry"}
        </Button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4 text-lg">
          {t("jobs.noJobsFound")}
        </p>
        <Button onClick={fetchJobs} variant="outline">
          {t("common.search")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("jobs.title")}</h2>
        <Button onClick={fetchJobs} variant="outline" size="sm">
          {t("common.refresh") || "Refresh"}
        </Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobListings;
