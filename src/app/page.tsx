import Link from 'next/link';
import { Briefcase, Search, ArrowRight, Building2, MapPin, DollarSign, Calendar } from 'lucide-react';
import { getRecentJobs } from '@/lib/queries/jobs';

export default async function Home() {
  // Fetch live jobs directly from Oracle FreeSQL on the server
  const recentJobs = await getRecentJobs(4);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Secure Enterprise Recruitment Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Find Your Next Professional Opportunity with DIGITAL WEB PORTAL
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connecting qualified candidates with top-tier employers through a clean, secure, and Oracle-backed recruitment system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Link
              href="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse All Jobs
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Candidate Register
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Openings</h2>
            <p className="text-sm text-slate-500">Live job listings retrieved directly from Oracle FreeSQL database.</p>
          </div>
          <Link 
            href="/jobs" 
            className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
          >
            View all jobs <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-slate-500 shadow-sm">
            <Briefcase className="w-8 h-8 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">No active job listings found in Oracle.</p>
            <p className="text-xs text-slate-500 mt-1">Make sure your database has sample records in the Job and Company tables.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentJobs.map((job) => (
              <div 
                key={job.JOBID}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">{job.JOBTITLE}</h3>
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                      <DollarSign className="w-3 h-3 mr-0.5" />
                      {job.SALARY ? job.SALARY.toLocaleString() : 'Competitive'}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm text-slate-600 mb-6">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                      {job.COMPANYNAME || 'Confidential Employer'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {job.LOCATION || 'Remote / Unspecified'}
                    </div>
                    <div className="flex items-center text-xs text-slate-500 pt-1">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      Deadline: {job.DEADLINE ? new Date(job.DEADLINE).toLocaleDateString() : 'Open'}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Link
                    href={`/jobs/${job.JOBID}`}
                    className="inline-flex items-center px-4 py-2 text-xs font-medium text-slate-900 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}