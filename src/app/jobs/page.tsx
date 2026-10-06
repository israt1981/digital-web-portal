import Link from 'next/link';
import { Briefcase, Search, Building2, MapPin, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { getAllJobs } from '@/lib/queries/jobs';

interface JobsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.q || '';
  
  // Fetch matching jobs from Oracle database
  const jobs = await getAllJobs(searchQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Explore Open Positions</h1>
        <p className="text-sm text-slate-600 mt-1">
          Browse active career listings connected live to the Oracle FreeSQL database.
        </p>
      </div>

      {/* Search Bar Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 shadow-sm">
        <form method="GET" action="/jobs" className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search by job title or company name..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
          >
            Search Jobs
          </button>
          {searchQuery && (
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Showing {jobs.length} active result{jobs.length === 1 ? '' : 's'} {searchQuery ? `for "${searchQuery}"` : ''}
        </p>
      </div>

      {/* Job Cards Grid */}
      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-sm">
          <Briefcase className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No jobs found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or check back later.</p>
          <Link
            href="/jobs"
            className="inline-block mt-4 px-4 py-2 text-xs font-medium text-slate-900 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
          >
            Reset Search
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.JOBID}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{job.JOBTITLE}</h3>
                  <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 shrink-0 ml-2">
                    <DollarSign className="w-3 h-3 mr-0.5" />
                    {job.SALARY ? job.SALARY.toLocaleString() : 'Competitive'}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm text-slate-600 mb-6">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="truncate">{job.COMPANYNAME || 'Confidential'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="truncate">{job.LOCATION || 'Remote'}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 pt-1">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    Deadline: {job.DEADLINE ? new Date(job.DEADLINE).toLocaleDateString() : 'Open'}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Link
                  href={`/jobs/${job.JOBID}`}
                  className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}