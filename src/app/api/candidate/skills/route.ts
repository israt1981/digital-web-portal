import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = JSON.parse(sessionCookie.value);
    
    const sql = `
      SELECT s.SkillID, s.SkillName, cs.ProficiencyLevel
      FROM Candidate_Skill cs
      JOIN Skill s ON cs.SkillID = s.SkillID
      WHERE cs.CandidateID = :candidateId
    `;
    const result = await executeQuery(sql, { candidateId: session.id });
    return NextResponse.json({ skills: result.rows || [] });
  } catch (error: unknown) {
    console.error('Error fetching candidate skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = JSON.parse(sessionCookie.value);
    const { skillId, proficiencyLevel } = await request.json();

    if (!skillId || !proficiencyLevel) {
      return NextResponse.json({ error: 'Skill and proficiency level are required.' }, { status: 400 });
    }

    const sql = `
      INSERT INTO Candidate_Skill (CandidateID, SkillID, ProficiencyLevel)
      VALUES (:candidateId, :skillId, :proficiencyLevel)
    `;

    await executeQuery(sql, {
      candidateId: session.id,
      skillId: parseInt(skillId, 10),
      proficiencyLevel,
    });

    return NextResponse.json({ success: true, message: 'Skill added successfully in Oracle.' });
  } catch (error: unknown) {
    console.error('Error adding skill:', error);
    return NextResponse.json({ error: 'Failed to add skill. It may already be added.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = JSON.parse(sessionCookie.value);
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');

    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID is required.' }, { status: 400 });
    }

    const sql = `
      DELETE FROM Candidate_Skill
      WHERE CandidateID = :candidateId AND SkillID = :skillId
    `;

    await executeQuery(sql, {
      candidateId: session.id,
      skillId: parseInt(skillId, 10),
    });

    return NextResponse.json({ success: true, message: 'Skill removed successfully from Oracle.' });
  } catch (error: unknown) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to remove skill.' }, { status: 500 });
  }
}