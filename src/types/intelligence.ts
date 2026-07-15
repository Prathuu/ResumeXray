export type ResumeType =
  | "Technical"
  | "Business"
  | "Creative"
  | "Academic"
  | "Sales"
  | "Healthcare"
  | "General";

export type Seniority =
  | "Entry"
  | "Junior"
  | "Mid"
  | "Senior"
  | "Lead"
  | "Manager"
  | "Executive";

export interface ResumeProfile {
  role: string;
  specialization?: string;
  industry?: string;

  resumeType: ResumeType;
  seniority: Seniority;

  experienceYears?: number;

  expectedSections: string[];

  evaluationCriteria: string[];

  confidence: number;
}
