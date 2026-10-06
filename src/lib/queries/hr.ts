import { executeQuery } from '@/lib/db';

export interface HRJobListing {
  JOBID: number;
  JOBTITLE: string;
  SALARY: number;
  DEADLINE: Date | string;
  LOCATION: string;
}

export async function getJobsByCompany(companyId: number): Promise<HRJobListing[]> {
  try {
    const sql = `
      SELECT JobID, JobTitle, Salary, Deadline, Location
      FROM Job
      WHERE CompanyID = :companyId
      ORDER BY JobID DESC
    `;
    const result = await executeQuery(sql, { companyId });
    return (result.rows as HRJobListing[]) || [];
  } catch (error) {
    console.error('Failed to fetch company jobs from Oracle:', error);
    return [];
  }
}