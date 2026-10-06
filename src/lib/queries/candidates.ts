import { executeQuery } from '@/lib/db';

export interface CandidateProfile {
  CANDIDATEID: number;
  FIRSTNAME: string;
  LASTNAME: string;
  EMAIL: string;
  PHONE: string;
  CGPA: number;
  UNIVERSITY: string;
  GRADUATIONYEAR: number;
}

export async function getCandidateById(candidateId: number): Promise<CandidateProfile | null> {
  try {
    const sql = `
      SELECT CandidateID, FirstName, LastName, Email, Phone, CGPA, University, GraduationYear
      FROM Candidate
      WHERE CandidateID = :candidateId
    `;
    const result = await executeQuery(sql, { candidateId });
    const rows = result.rows as CandidateProfile[];
    return rows && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Failed to fetch candidate profile from Oracle:', error);
    return null;
  }
}

export async function getCandidateStats(candidateId: number) {
  try {
    const sql = `
      SELECT 
        COUNT(*) AS TotalApps,
        SUM(CASE WHEN Status = 'Applied' THEN 1 ELSE 0 END) AS AppliedCount,
        SUM(CASE WHEN Status = 'Shortlisted' THEN 1 ELSE 0 END) AS ShortlistedCount,
        SUM(CASE WHEN Status = 'Interviewed' THEN 1 ELSE 0 END) AS InterviewedCount,
        SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) AS RejectedCount
      FROM Application
      WHERE CandidateID = :candidateId
    `;
    const result = await executeQuery(sql, { candidateId });
    const rows = result.rows as Record<string, unknown>[];
    return rows && rows.length > 0 ? rows[0] : { TOTALAPPS: 0, APPLIEDCOUNT: 0, SHORTLISTEDCOUNT: 0, INTERVIEWEDCOUNT: 0, REJECTEDCOUNT: 0 };
  } catch (error) {
    console.error('Failed to fetch candidate stats from Oracle:', error);
    return { TOTALAPPS: 0, APPLIEDCOUNT: 0, SHORTLISTEDCOUNT: 0, INTERVIEWEDCOUNT: 0, REJECTEDCOUNT: 0 };
  }
}