export interface ScoreDetail {
  label: string;
  score: number;
  summary: string;
}

export interface ResumeSection {
  name: string;
  content: string;
  score: number;
  sentiment: "strong" | "mixed" | "weak";
  note: string;
}

export interface AchievementReview {
  bullet: string;
  score: number;
  weakVerb?: string;
  strongerVerbs: string[];
  hasMetric: boolean;
  feedback: string;
}

export interface AtsAnalysis {
  overallScore: number;
  scores: {
    formatting: ScoreDetail;
    content: ScoreDetail;
    skills: ScoreDetail;
    experience: ScoreDetail;
  };
  sections: ResumeSection[];
  achievements: AchievementReview[];
  recommendations: string[];
  strengths: string[];
  generatedAt: string;
  engine: string;
}
