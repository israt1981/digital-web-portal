import { executeQuery } from '@/lib/db';

export interface MasterSkill {
  SKILLID: number;
  SKILLNAME: string;
}

export interface CandidateSkill {
  SKILLID: number;
  SKILLNAME: string;
  PROFICIENCYLEVEL: string;
}

export async function getAllMasterSkills(): Promise<MasterSkill[]> {
  try {
    const sql = `SELECT SkillID, SkillName FROM Skill ORDER BY SkillName ASC`;
    const result = await executeQuery(sql);
    return (result.rows as MasterSkill[]) || [];
  } catch (error) {
    console.error('Failed to fetch master skills:', error);
    return [];
  }
}

export async function getCandidateSkills(candidateId: number): Promise<CandidateSkill[]> {
  try {
    const sql = `
      SELECT s.SkillID, s.SkillName, cs.ProficiencyLevel
      FROM Candidate_Skill cs
      JOIN Skill s ON cs.SkillID = s.SkillID
      WHERE cs.CandidateID = :candidateId
      ORDER BY s.SkillName ASC
    `;
    const result = await executeQuery(sql, { candidateId });
    return (result.rows as CandidateSkill[]) || [];
  } catch (error) {
    console.error('Failed to fetch candidate skills:', error);
    return [];
  }
}