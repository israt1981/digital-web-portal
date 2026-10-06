import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized. Please login as HR.' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    if (session.role !== 'hr' || !session.companyId) {
      return NextResponse.json({ error: 'Forbidden. HR privileges required.' }, { status: 403 });
    }

    const { jobTitle, salary, deadline, location } = await request.json();

    if (!jobTitle) {
      return NextResponse.json({ error: 'Job title is required.' }, { status: 400 });
    }

    // Get next JobID from Oracle sequence or max ID
    const idSql = `SELECT NVL(MAX(JobID), 0) + 1 AS NextID FROM Job`;
    const idResult = await executeQuery(idSql);
    const nextId = (idResult.rows as Record<string, unknown>[])[0].NEXTID;

    // Insert new job into Oracle Job table
    const sql = `
      INSERT INTO Job (JobID, CompanyID, JobTitle, Salary, Deadline, Location)
      VALUES (:jobId, :companyId, :jobTitle, :salary, TO_DATE(:deadline, 'YYYY-MM-DD'), :location)
    `;

    await executeQuery(sql, {
      jobId: nextId,
      companyId: session.companyId,
      jobTitle,
      salary: salary ? parseFloat(salary) : null,
      deadline: deadline || new Date().toISOString().split('T')[0],
      location: location || 'Remote',
    });

    return NextResponse.json({ success: true, message: 'Job posted successfully to Oracle.' });
  } catch (error: unknown) {
    console.error('HR job creation error:', error);
    return NextResponse.json({ error: 'Internal server error while creating job.' }, { status: 500 });
  }
}