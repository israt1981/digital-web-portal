'use client';

import { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2, Check } from 'lucide-react';

interface MasterSkill {
  SKILLID: number;
  SKILLNAME: string;
}

interface CandidateSkill {
  SKILLID: number;
  SKILLNAME: string;
  PROFICIENCYLEVEL: string;
}

export default function CandidateSkillsPage() {
  const [candidateSkills, setCandidateSkills] = useState<CandidateSkill[]>([]);
  const [masterSkills, setMasterSkills] = useState<MasterSkill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/candidate/skills');
        const data = await res.json();
        if (res.ok) {
          setCandidateSkills(data.skills || []);
        }

        // Fetch master skills catalog if available, or static list
        const masterRes = await fetch('/api/skills');
        if (masterRes.ok) {
          const masterData = await masterRes.json();
          setMasterSkills(masterData.skills || []);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load skills.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedSkillId) {
      setError('Please select a skill.');
      return;
    }

    try {
      const res = await fetch('/api/candidate/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: selectedSkillId, proficiencyLevel: proficiency }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add skill');

      setSuccess('Skill added successfully to Oracle database.');
      // Refresh skills list
      const refreshRes = await fetch('/api/candidate/skills');
      const refreshData = await refreshRes.json();
      setCandidateSkills(refreshData.skills || []);
      setSelectedSkillId('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/candidate/skills?skillId=${skillId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove skill');

      setCandidateSkills(candidateSkills.filter(s => s.SKILLID !== skillId));
      setSuccess('Skill removed successfully.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500">Loading skills...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Professional Skills</h1>
        <p className="text-sm text-slate-500 mt-1">Add or update your skills stored in the Oracle Candidate_Skill table.</p>
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

      {/* Add Skill Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-2 text-slate-700" /> Add New Skill
        </h2>
        <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Select Skill</label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
              required
            >
              <option value="">-- Choose Skill --</option>
              {masterSkills.map((m) => (
                <option key={m.SKILLID} value={m.SKILLID}>
                  {m.SKILLNAME}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Proficiency Level</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              Add Skill
            </button>
          </div>
        </form>
      </div>

      {/* Current Skills List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
          <Wrench className="w-4 h-4 mr-2 text-slate-700" /> Your Current Skills
        </h2>

        {candidateSkills.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No skills added yet. Use the form above to add your technical stack.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {candidateSkills.map((skill) => (
              <div key={skill.SKILLID} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-slate-900 text-sm">{skill.SKILLNAME}</span>
                  <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                    {skill.PROFICIENCYLEVEL}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteSkill(skill.SKILLID)}
                  className="text-red-600 hover:text-red-800 p-1.5 rounded transition-colors"
                  title="Remove Skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}