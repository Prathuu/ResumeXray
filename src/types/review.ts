export type ReviewerId =
  | "ats"
  | "recruiter"
  | "hiring-manager"
  | "engineering-manager";

export interface ReviewFeedback {
  title: string;
  detail: string;
  priority: "critical" | "important" | "polish";
}

export interface AgentReview {
  id: ReviewerId;
  name: string;
  role: string;
  verdict: string;
  score: number;
  feedback: ReviewFeedback[];
  questions: string[];
}
