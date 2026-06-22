export interface SkillGap {
  skill: string;
  priority: "high" | "medium";
  reason: string;
  learningPath: string[];
}

export interface InterviewTopic {
  topic: string;
  priority: "high" | "medium" | "low";
  reasoning: string;
  preparation: string;
}

export interface CareerAnalysis {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  strengths: string[];
  skillGaps: SkillGap[];
  interviewTopics: InterviewTopic[];
}
