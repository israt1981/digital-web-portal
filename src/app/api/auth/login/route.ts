import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body; // role: 'candidate' or 'hr'

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required.' }, { status: 400 });
    }

    if (role === 'candidate') {
      const sql = `SELECT CandidateID, FirstName, LastName, Email, Password FROM Candidate WHERE Email = :email`;
      const result = await executeQuery(sql, { email });
      const rows = result.rows as Record<string, unknown>[];

      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      const candidate = rows[0];
      const isValid = await verifyPassword(password, candidate.PASSWORD as string);

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      // Set secure cookie session
      const cookieStore = await cookies();
      cookieStore.set('session', JSON.stringify({ id: candidate.CANDIDATEID, role: 'candidate', email: candidate.EMAIL }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.json({ success: true, redirect: '/candidate/dashboard' });

    } else if (role === 'hr') {
      const sql = `SELECT HR_ID, CompanyID, FirstName, LastName, Email, Role, Password FROM HR_User WHERE Email = :email`;
      const result = await executeQuery(sql, { email });
      const rows = result.rows as Record<string, unknown>[];

      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      const hr = rows[0];
      const isValid = await verifyPassword(password, hr.PASSWORD as string);

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      // Set secure cookie session for HR
      const cookieStore = await cookies();
      cookieStore.set('session', JSON.stringify({ id: hr.HR_ID, companyId: hr.COMPANYID, role: 'hr', email: hr.EMAIL }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return NextResponse.json({ success: true, redirect: '/hr/dashboard' });
    }

    return NextResponse.json({ error: 'Invalid role specified.' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during login.' }, { status: 500 });
  }
}