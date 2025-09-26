"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Users, X, Loader2, BrainCircuit } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import SpotlightCard from "@/components/SpotlightCard";
import ScrollFade from "@/components/ScrollFade";

// Updated Job interface to match the detailed data from the JSearch API.
interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city: string | null;
  job_state: string | null;
  job_country: string | null;
  job_apply_link: string;
  job_posted_at_timestamp: number;
  job_employment_type: string;
}

// Interface to type the nested API response structure
interface JSearchApiResponse {
  data?: Job[];
}

interface Tag {
  id: string;
  name: string;
  category: "skill" | "location" | "trade";
}

const JobsPage = () => {
  const { t } = useTranslation();
  const [searchTags, setSearchTags] = useState<Tag[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Backend Integration State ---
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [shouldSearchAfterTagsUpdate, setShouldSearchAfterTagsUpdate] =
    useState(false);
  const [isFetchingSkills, setIsFetchingSkills] = useState(false);

  const addTag = (tag: Tag) => {
    setSearchTags([...searchTags, tag]);
    setSearchInput("");
    searchInputRef.current?.focus();
  };

  const removeTag = (tagId: string) => {
    setSearchTags(searchTags.filter((tag) => tag.id !== tagId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      e.preventDefault();
      const newTag: Tag = {
        id: `user-${Date.now()}`,
        name: searchInput.trim(),
        category: "skill", // Default category for user-entered tags
      };
      if (
        !searchTags.some(
          (tag) => tag.name.toLowerCase() === newTag.name.toLowerCase(),
        )
      ) {
        addTag(newTag);
      } else {
        setSearchInput(""); // Clear input even if it's a duplicate
      }
    }
  };

  const handleSearch = async () => {
    if (searchTags.length === 0 && searchInput.trim() === "") {
      setError(t("jobs.searchError"));
      return;
    }
    setLoading(true);
    setError(null);
    setJobs([]);
    setInitialLoad(false);

    // Combine tags and the current input value for the query
    const allSearchTerms = [
      ...searchTags.map((tag) => tag.name),
      searchInput.trim(),
    ].filter(Boolean);
    const query = allSearchTerms.join(" ");

    try {
      const response = await fetch(
        `/api/search-jobs?query=${encodeURIComponent(query)}`,
      );
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.");
      }
      const result = (await response.json()) as {
        data?: JSearchApiResponse | Job[];
      };

      // Safely access the jobs array, which might be nested one or two levels deep
      const jobsArray = Array.isArray(result.data)
        ? result.data
        : (result.data?.data ?? []);
      setJobs(jobsArray);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSkills = async () => {
    setIsFetchingSkills(true);
    try {
      // This would typically fetch skills from the user's profile/skill wallet
      // For now, we'll add some dummy skills as tags
      const dummySkills = [
        { id: "skill-1", name: "JavaScript", category: "skill" as const },
        { id: "skill-2", name: "React", category: "skill" as const },
        { id: "skill-3", name: "Node.js", category: "skill" as const },
      ];

      // Add skills as tags (avoiding duplicates)
      const newSkills = dummySkills.filter(
        (skill) =>
          !searchTags.some(
            (tag) => tag.name.toLowerCase() === skill.name.toLowerCase(),
          ),
      );

      if (newSkills.length > 0) {
        setSearchTags([...searchTags, ...newSkills]);
        setShouldSearchAfterTagsUpdate(true);
      }
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setIsFetchingSkills(false);
    }
  };

  // --- useEffect to trigger search after skills are added ---
  useEffect(() => {
    if (shouldSearchAfterTagsUpdate) {
      handleSearch();
      setShouldSearchAfterTagsUpdate(false); // Reset the flag
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTags, shouldSearchAfterTagsUpdate]);

  // Helper to format the job posting date
  const formatJobPostDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return "Today";
    if (diffDays <= 2) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-svh">
      <main className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            {t("jobs.title")}
          </h2>
          <p className="mb-8 text-lg text-gray-600">{t("jobs.subtitle")}</p>

          <div className="relative mx-auto max-w-2xl">
            <div className="relative">
              <div className="flex items-center rounded-2xl border border-orange-200/30 bg-gradient-to-r from-orange-50/20 via-amber-50/15 to-yellow-50/20 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-yellow-900/20 backdrop-blur-2xl ring-1 ring-orange-300/20 shadow-lg focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-300/50">
                <Search className="ml-3 h-5 w-5 text-orange-600/80 dark:text-orange-400/80" />
                <div className="flex flex-1 flex-wrap items-center gap-2 p-2">
                  {searchTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
                    >
                      {tag.name}
                      <button
                        onClick={() => removeTag(tag.id)}
                        className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-orange-600 hover:bg-orange-200 hover:text-orange-800 dark:text-orange-400 dark:hover:bg-orange-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={
                      searchTags.length === 0
                        ? t("jobs.searchPlaceholder")
                        : t("jobs.addMore")
                    }
                    className="min-w-0 flex-1 border-none bg-transparent px-2 py-3 text-neutral-900 placeholder:text-neutral-500 dark:text-neutral-100 dark:placeholder:text-neutral-400 focus:ring-0 focus:outline-none"
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="self-stretch rounded-r-2xl bg-orange-600 px-6 py-3 text-white transition-colors hover:bg-orange-700 shadow-lg hover:shadow-orange-500/25"
                >
                  {t("jobs.searchButton")}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleFetchSkills}
              disabled={isFetchingSkills}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-green-300"
            >
              {isFetchingSkills ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("jobs.fetchingSkills")}
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  {t("jobs.skillWalletButton")}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12">
          {loading && (
            <div className="text-center text-gray-600">
              {t("jobs.loadingJobs")}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-100 p-4 text-center text-red-500">
              {error}
            </div>
          )}
          {!loading && !error && !initialLoad && (
            <div>
              {jobs.length > 0 ? (
                <ScrollFade maxHeight="65vh">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job, index) => (
                      <SpotlightCard 
                        key={job.job_id} 
                        variant={index % 2 === 0 ? "orange" : "rusty"}
                        className="p-6 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <a
                          href={job.job_apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                        <div className="flex items-start space-x-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            job.employer_logo ??
                            `https://placehold.co/60x60/E2E8F0/4A5568?text=${job.employer_name.charAt(0)}`
                          }
                          alt={`${job.employer_name} logo`}
                          className="h-14 w-14 rounded-md border border-gray-100 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://placehold.co/60x60/E2E8F0/4A5568?text=${job.employer_name.charAt(0)}`;
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="line-clamp-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                {job.job_title}
                              </h3>
                              <p className="text-neutral-700 dark:text-neutral-300">
                                {job.employer_name}
                              </p>
                            </div>
                            <span className="pt-1 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                              {job.job_posted_at}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <MapPin className="mr-2 h-4 w-4 shrink-0" />
                            <span>{`${job.job_city ?? ""}${job.job_city && (job.job_state ?? job.job_country) ? ", " : ""}${job.job_state ?? ""}${job.job_state && job.job_country ? ", " : ""}${job.job_country ?? t("jobs.notSpecified")}`}</span>
                          </div>
                          <div className="mt-4">
                            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 capitalize dark:bg-orange-900/50 dark:text-orange-200">
                              {job.job_employment_type
                                ?.toLowerCase()
                                .replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                      </a>
                    </SpotlightCard>
                  ))}
                  </div>
                </ScrollFade>
              ) : (
                <div className="py-10 text-center text-gray-500">
                  <h3 className="text-xl font-semibold">
                    {t("jobs.noJobsFound")}
                  </h3>
                  <p>{t("jobs.tryAdjusting")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobsPage;
