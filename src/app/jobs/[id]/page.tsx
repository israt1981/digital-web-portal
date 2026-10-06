'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, ArrowLeft, Check } from 'lucide-react';

interface JobDetails {
  JOBID: number;
  JOBTITLE: string;
  SALARY: number;
  DEADLINE: string;
  COMPANYNAME: string;
  LOCATION: string;
  EMAIL: string;
  WEBSITE: string;
  PHONE: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id;

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        setJob(data.job);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    }
    if (jobId) fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    setError('');
    setSuccess('');
    setApplying(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setApplied(true);
      setSuccess('Application submitted successfully to Oracle database.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h1>
        <Link href="/jobs" className="text-sm font-medium text-slate-600 underline">Back to Job Listings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Job Listings
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded flex items-center">
          <Check className="w-4 h-4 mr-1.5 shrink-0" /> {success}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800 mb-3">
              <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Active Opening
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{job.JOBTITLE}</h1>
            <p className="text-lg font-medium text-slate-600 mt-1 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-slate-400" />
              {job.COMPANYNAME}
            </p>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded-lg p-4 text-left md:text-right shrink-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Offered Salary</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5 flex items-center md:justify-end">
              <DollarSign className="w-5 h-5 text-slate-700" />
              {job.SALARY ? job.SALARY.toLocaleString() : 'Competitive'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 text-sm text-slate-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
            <span>Location: <strong className="text-slate-900">{job.LOCATION || 'Remote'}</strong></span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
            <span>Application Deadline: <strong className="text-slate-900">{job.DEADLINE ? new Date(job.DEADLINE).toLocaleDateString() : 'Open'}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Job Description & Requirements</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              This position at <strong>{job.COMPANYNAME}</strong> is retrieved live from the relational Oracle FreeSQL database. Qualified candidates meeting the academic CGPA and skill criteria are encouraged to submit their application.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Application Action</h3>
            <button
              onClick={handleApply}
              disabled={applying || applied}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {applied ? 'Applied Successfully' : applying ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}