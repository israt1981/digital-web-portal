'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Building, DollarSign, Calendar, MapPin, Check } from 'lucide-react';

interface HRJob {
  JOBID: number;
  JOBTITLE: string;
  SALARY: number;
  DEADLINE: string;
  LOCATION: string;
}

export default function HRDashboard() {
  const [jobs, setJobs] = useState<HRJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchHRJobs() {
      try {
        const res = await fetch('/api/hr/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load HR dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchHRJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/hr/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, salary, deadline, location }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post job');

      setSuccess('Job posted successfully to Oracle database.');
      setJobTitle('');
      setSalary('');
      setDeadline('');
      setLocation('');

      // Refresh job list
      const refreshRes = await fetch('/api/hr/jobs');
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setJobs(refreshData.jobs || []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Job creation failed');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Loading HR dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">HR Recruiter Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your company job postings and review candidate applications.</p>
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

      {/* Post New Job Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-10">
        <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-2 text-slate-700" /> Post New Career Opening
        </h2>
        <form onSubmit={handleCreateJob} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior React Developer"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Salary ($)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 95000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Application Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              Publish Job Listing
            </button>
          </div>
        </form>
      </div>

      {/* Company Job Openings List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-6 flex items-center">
          <Briefcase className="w-4 h-4 mr-2 text-slate-700" /> Company Job Listings ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No job listings published yet. Use the form above to create your first posting.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.JOBID} className="border border-gray-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{job.JOBTITLE}</h3>
                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span>{job.SALARY ? job.SALARY.toLocaleString() : 'Competitive'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span>{job.LOCATION || 'Remote'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span>Deadline: {job.DEADLINE ? new Date(job.DEADLINE).toLocaleDateString() : 'Open'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}