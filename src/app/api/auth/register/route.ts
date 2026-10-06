import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, cgpa, university, graduationYear, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Required fields are missing.' }, { status: 400 });
    }

    // Check if email already exists
    const checkSql = `SELECT CandidateID FROM Candidate WHERE Email = :email`;
    const checkResult = await executeQuery(checkSql, { email });
    const existing = checkResult.rows as Record<string, unknown>[];
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 400 });
    }

    // Get next CandidateID from Oracle sequence or max ID
    const idSql = `SELECT NVL(MAX(CandidateID), 0) + 1 AS NextID FROM Candidate`;
    const idResult = await executeQuery(idSql);
    const nextId = (idResult.rows as Record<string, unknown>[])[0].NEXTID;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new candidate into Oracle
    const insertSql = `
      INSERT INTO Candidate (CandidateID, FirstName, LastName, Email, Phone, CGPA, University, GraduationYear, Password)
      VALUES (:id, :firstName, :lastName, :email, :phone, :cgpa, :university, :gradYear, :password)
    `;

    await executeQuery(insertSql, {
      id: nextId,
      firstName,
      lastName,
      email,
      phone: phone || null,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      university: university || null,
      gradYear: graduationYear ? parseInt(graduationYear, 10) : null,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, message: 'Registration successful.' });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error during registration.' }, { status: 500 });
  }
}