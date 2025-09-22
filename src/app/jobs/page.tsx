'use client';

import React, { useState, useRef } from 'react';
import { Search, MapPin, Users, X } from 'lucide-react';

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
  job_posted_at: string;
  job_employment_type: string;
}

// Interface to type the nested API response structure
interface JSearchApiResponse {
  data?: Job[];
}

interface Tag {
  id: string;
  name: string;
  category: 'skill' | 'location' | 'trade';
}

const JobsPage = () => {
  const [searchTags, setSearchTags] = useState<Tag[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Backend Integration State ---
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const addTag = (tag: Tag) => {
    setSearchTags([...searchTags, tag]);
    setSearchInput('');
    searchInputRef.current?.focus();
  };

  const removeTag = (tagId: string) => {
    setSearchTags(searchTags.filter(tag => tag.id !== tagId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim() !== '') {
      e.preventDefault();
      const newTag: Tag = {
        id: `user-${Date.now()}`,
        name: searchInput.trim(),
        category: 'skill', // Default category for user-entered tags
      };
      if (!searchTags.some(tag => tag.name.toLowerCase() === newTag.name.toLowerCase())) {
        addTag(newTag);
      } else {
        setSearchInput(''); // Clear input even if it's a duplicate
      }
    }
  };

  const handleSearch = async () => {
    if (searchTags.length === 0 && searchInput.trim() === '') {
      setError("Please add a tag or type in the search bar to search.");
      return;
    }
    setLoading(true);
    setError(null);
    setJobs([]);
    setInitialLoad(false);

    // Combine tags and the current input value for the query
    const allSearchTerms = [...searchTags.map(tag => tag.name), searchInput.trim()].filter(Boolean);
    const query = allSearchTerms.join(' ');

    try {
      const response = await fetch(`/api/search-jobs?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Something went wrong. Please try again later.');
      }
      const result = await response.json() as { data?: JSearchApiResponse | Job[] };

      // Safely access the jobs array, which might be nested one or two levels deep
      const jobsArray = Array.isArray(result.data) ? result.data : result.data?.data ?? [];
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">TradeUp</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Job</h2>
          <p className="text-lg text-gray-600 mb-8">Discover Jobs Tailor-made for you</p>

          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Search className="w-5 h-5 text-gray-400 ml-3" />
                <div className="flex flex-wrap items-center gap-2 p-2 flex-1">
                  {searchTags.map((tag) => (
                    <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tag.name}
                      <button onClick={() => removeTag(tag.id)} className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchTags.length === 0 ? "Search for jobs, skills, or location..." : "Add more..."}
                    className="flex-1 min-w-0 px-2 py-3 border-none focus:ring-0 focus:outline-none bg-transparent"
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button onClick={handleSearch} className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors self-stretch">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          {loading && (
            <div className="text-center text-gray-600">Loading jobs...</div>
          )}
          {error && (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
          )}
          {!loading && !error && !initialLoad && (
            <div>
              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <a key={job.job_id} href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={job.employer_logo ?? `https://placehold.co/60x60/E2E8F0/4A5568?text=${job.employer_name.charAt(0)}`}
                          alt={`${job.employer_name} logo`}
                          className="w-14 h-14 rounded-md object-contain border border-gray-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/60x60/E2E8F0/4A5568?text=${job.employer_name.charAt(0)}`; }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800 line-clamp-2">{job.job_title}</h3>
                              <p className="text-gray-600">{job.employer_name}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap pt-1">{job.job_posted_at}</span>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2 shrink-0" />
                            <span>{`${job.job_city ?? ''}${job.job_city && (job.job_state ?? job.job_country) ? ', ' : ''}${job.job_state ?? ''}${job.job_state && job.job_country ? ', ' : ''}${job.job_country ?? 'Not specified'}`}</span>
                          </div>
                          <div className="mt-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {job.job_employment_type?.toLowerCase().replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <h3 className="text-xl font-semibold">No jobs found</h3>
                  <p>Try adjusting your search tags to find more results.</p>
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


