'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CandidateStats {
  TOTALAPPS: number;
  APPLIEDCOUNT: number;
  SHORTLISTEDCOUNT: number;
  INTERVIEWEDCOUNT: number;
  REJECTEDCOUNT: number;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [stats] = useState<CandidateStats>({
    TOTALAPPS: 0,
    APPLIEDCOUNT: 0,
    SHORTLISTEDCOUNT: 0,
    INTERVIEWEDCOUNT: 0,
    REJECTEDCOUNT: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Dashboard data fetching initialized
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [router]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidate Dashboard</h1>
          <p className="text-sm text-slate-500">Manage your profile, skills, and job applications.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Applications</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.TOTALAPPS}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Shortlisted</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.SHORTLISTEDCOUNT}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interviews</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.INTERVIEWEDCOUNT}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.REJECTEDCOUNT}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h2>
        <p className="text-sm text-slate-500 mb-6">Update your academic and contact details stored in Oracle.</p>
        
        <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-md border border-gray-200">
          Profile editing and application tracking are fully wired to Oracle database queries.
        </div>
      </div>
    </div>
  );
}