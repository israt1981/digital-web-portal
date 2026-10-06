import { executeQuery } from '@/lib/db';

export interface JobListing {
  JOBID: number;
  JOBTITLE: string;
  SALARY: number;
  DEADLINE: Date | string;
  COMPANYNAME: string;
  LOCATION: string;
  EMAIL?: string;
  WEBSITE?: string;
  PHONE?: string;
}

export async function getRecentJobs(limit: number = 6): Promise<JobListing[]> {
  try {
    const sql = `
      SELECT 
        j.JobID, 
        j.JobTitle, 
        j.Salary, 
        j.Deadline, 
        c.CompanyName, 
        c.Location
      FROM Job j
      JOIN Company c ON j.CompanyID = c.CompanyID
      FETCH FIRST :limit ROWS ONLY
    `;

    const result = await executeQuery(sql, { limit });
    return (result.rows as JobListing[]) || [];
  } catch (error) {
    console.error('Failed to fetch recent jobs from Oracle:', error);
    return [];
  }
}

export async function getAllJobs(searchQuery: string = ''): Promise<JobListing[]> {
  try {
    let sql = `
      SELECT 
        j.JobID, 
        j.JobTitle, 
        j.Salary, 
        j.Deadline, 
        c.CompanyName, 
        c.Location
      FROM Job j
      JOIN Company c ON j.CompanyID = c.CompanyID
    `;

    const binds: Record<string, unknown> = {};

    if (searchQuery.trim() !== '') {
      sql += ` WHERE LOWER(j.JobTitle) LIKE :search OR LOWER(c.CompanyName) LIKE :search`;
      binds.search = `%${searchQuery.toLowerCase()}%`;
    }

    sql += ` ORDER BY j.JobID DESC`;

    const result = await executeQuery(sql, binds);
    return (result.rows as JobListing[]) || [];
  } catch (error) {
    console.error('Failed to fetch jobs from Oracle:', error);
    return [];
  }
}

export async function getJobById(jobId: number): Promise<JobListing | null> {
  try {
    const sql = `
      SELECT 
        j.JobID, 
        j.JobTitle, 
        j.Salary, 
        j.Deadline, 
        c.CompanyName, 
        c.Location,
        c.Email,
        c.Website,
        c.Phone
      FROM Job j
      JOIN Company c ON j.CompanyID = c.CompanyID
      WHERE j.JobID = :jobId
    `;

    const result = await executeQuery(sql, { jobId });
    const rows = result.rows as JobListing[];
    return rows && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(`Failed to fetch job ID ${jobId} from Oracle:`, error);
    return null;
  }
}