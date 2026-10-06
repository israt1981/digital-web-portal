import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    if (session.role !== 'candidate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { phone, cgpa, university, graduationYear } = body;

    const sql = `
      UPDATE Candidate
      SET Phone = :phone,
          CGPA = :cgpa,
          University = :university,
          GraduationYear = :gradYear
      WHERE CandidateID = :candidateId
    `;

    await executeQuery(sql, {
      phone: phone || null,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      university: university || null,
      gradYear: graduationYear ? parseInt(graduationYear, 10) : null,
      candidateId: session.id,
    });

    return NextResponse.json({ success: true, message: 'Profile updated successfully in Oracle.' });
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error while updating profile.' }, { status: 500 });
  }
}