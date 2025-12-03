import { useMemo } from 'react';

export interface Fixer {
  id: string;
  name: string;
  city: string;
  rating: number;
  avatar?: string;
}

export interface JobWithFixers {
  jobType: string;
  fixers: Fixer[];
}

export function useFixersByJob(jobs: JobWithFixers[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim()) {
      return jobs.map((job) => ({
        ...job,
        matchCount: job.fixers.length,
        filteredFixers: job.fixers,
      }));
    }

    const query = searchQuery.toLowerCase();

    return jobs
      .map((job) => {
        const filteredFixers = job.fixers.filter((fixer) =>
          fixer.name.toLowerCase().includes(query),
        );
        return {
          ...job,
          matchCount: filteredFixers.length,
          filteredFixers,
        };
      })
      .filter((job) => job.matchCount > 0);
  }, [jobs, searchQuery]);
}
