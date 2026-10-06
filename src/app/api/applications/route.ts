import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';
import { checkExistingApplication } from '@/lib/queries/applications';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized. Please login as a candidate.' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    if (session.role !== 'candidate') {
      return NextResponse.json({ error: 'Only candidates can apply for jobs.' }, { status: 403 });
    }

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
    }

    const candidateId = session.id;
    const parsedJobId = parseInt(jobId, 10);

    // Check if already applied
    const alreadyApplied = await checkExistingApplication(candidateId, parsedJobId);
    if (alreadyApplied) {
      return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 400 });
    }

    // Insert into Oracle Application table with default status 'Applied' and current date SYSDATE
    const sql = `
      INSERT INTO Application (CandidateID, JobID, ApplyDate, Status)
      VALUES (:candidateId, :jobId, SYSDATE, 'Applied')
    `;

    await executeQuery(sql, { candidateId, jobId: parsedJobId });

    return NextResponse.json({ success: true, message: 'Application submitted successfully to Oracle.' });
  } catch (error: unknown) {
    console.error('Application submission error:', error);
    return NextResponse.json({ error: 'Internal server error while submitting application.' }, { status: 500 });
  }
}