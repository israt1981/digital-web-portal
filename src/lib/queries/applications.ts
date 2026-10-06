import { executeQuery } from '@/lib/db';

export interface ApplicationRecord {
  JOBID: number;
  JOBTITLE: string;
  COMPANYNAME: string;
  APPLYDATE: Date | string;
  STATUS: string;
}

export async function getCandidateApplications(candidateId: number): Promise<ApplicationRecord[]> {
  try {
    const sql = `
      SELECT 
        j.JobID, 
        j.JobTitle, 
        c.CompanyName, 
        a.ApplyDate, 
        a.Status
      FROM Application a
      JOIN Job j ON a.JobID = j.JobID
      JOIN Company c ON j.CompanyID = c.CompanyID
      WHERE a.CandidateID = :candidateId
      ORDER BY a.ApplyDate DESC
    `;
    const result = await executeQuery(sql, { candidateId });
    return (result.rows as ApplicationRecord[]) || [];
  } catch (error) {
    console.error('Failed to fetch candidate applications:', error);
    return [];
  }
}

export async function checkExistingApplication(candidateId: number, jobId: number): Promise<boolean> {
  try {
    const sql = `
      SELECT COUNT(*) AS CNT 
      FROM Application 
      WHERE CandidateID = :candidateId AND JobID = :jobId
    `;
    const result = await executeQuery(sql, { candidateId, jobId });
    const rows = result.rows as Record<string, unknown>[];
    return rows && rows.length > 0 && Number(rows[0].CNT) > 0;
  } catch (error) {
    console.error('Failed to check existing application:', error);
    return false;
  }
}