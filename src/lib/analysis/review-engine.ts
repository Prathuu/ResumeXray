import { analyzeResume } from "@/lib/analysis/ats-engine";
import type { AgentReview, ReviewFeedback } from "@/types/review";

function feedback(
  title: string,
  detail: string,
  priority: ReviewFeedback["priority"] = "important",
): ReviewFeedback {
  return { title, detail, priority };
}

function roast(verdict: string, score: number) {
  if (score >= 80) {
    return `${verdict} Annoyingly competent—but there is still no trophy for making recruiters hunt for the best evidence.`;
  }
  if (score >= 60) {
    return `${verdict} Right now the resume has good ingredients and the plating of a Tuesday leftovers container.`;
  }
  return `${verdict} The experience may be real, but the resume is currently wearing an invisibility cloak.`;
}

export function createAgentReviews(
  resumeText: string,
  roastMode = false,
): AgentReview[] {
  const analysis = analyzeResume(resumeText);
  const lowScores = Object.values(analysis.scores)
    .filter((item) => item.score < 70)
    .sort((a, b) => a.score - b.score);
  const weakBullets = analysis.achievements.filter((item) => item.score < 65);
  const technicalTerms =
    resumeText.match(
      /\b(typescript|javascript|react|next\.js|node|python|java|aws|azure|docker|kubernetes|sql)\b/gi,
    ) ?? [];
  const technicalDepth = new Set(
    technicalTerms.map((term) => term.toLowerCase()),
  ).size;

  const ats: AgentReview = {
    id: "ats",
    name: "Avery",
    role: "ATS reviewer",
    score: analysis.overallScore,
    verdict:
      analysis.overallScore >= 75
        ? "The document is structurally readable and should pass an initial scan."
        : "The document is readable, but weak structure or evidence may reduce ranking.",
    feedback: [
      ...lowScores
        .slice(0, 2)
        .map((item) =>
          feedback(
            `${item.label} needs attention`,
            item.summary,
            item.score < 50 ? "critical" : "important",
          ),
        ),
      feedback(
        "Use exact role language",
        "Mirror relevant terminology from the target description naturally in skills and achievements.",
      ),
      feedback(
        "Keep formatting conventional",
        "Use plain section headings, consistent dates, and text rather than decorative graphics.",
        "polish",
      ),
    ],
    questions: [
      "Does every critical job requirement appear in plain text?",
      "Can the target title be inferred in the first third of the resume?",
    ],
  };

  const recruiter: AgentReview = {
    id: "recruiter",
    name: "Riley",
    role: "Recruiter reviewer",
    score: Math.round(
      (analysis.scores.content.score + analysis.scores.formatting.score) / 2,
    ),
    verdict:
      analysis.strengths.length >= 2
        ? "The profile has visible strengths, but the opening story can be sharper."
        : "The recruiter story is not yet obvious in a quick first-pass read.",
    feedback: [
      feedback(
        "Make the value proposition immediate",
        "The summary should state role identity, domain depth, and the strongest business outcome in two or three lines.",
        analysis.scores.content.score < 60 ? "critical" : "important",
      ),
      feedback(
        "Front-load proof",
        "Move the most relevant quantified achievement into the top half of the first page.",
      ),
      feedback(
        "Remove low-signal detail",
        "Trim bullets that describe expected duties without showing scope, judgment, or results.",
        "polish",
      ),
    ],
    questions: [
      "Why is this candidate a fit for this specific role?",
      "What is the one achievement I should remember after ten seconds?",
    ],
  };

  const hiringManager: AgentReview = {
    id: "hiring-manager",
    name: "Morgan",
    role: "Hiring manager reviewer",
    score: analysis.scores.experience.score,
    verdict:
      analysis.scores.experience.score >= 75
        ? "The resume shows useful ownership and outcomes."
        : "The resume describes activity more clearly than ownership and impact.",
    feedback: [
      feedback(
        "Clarify personal ownership",
        "Distinguish what you decided and delivered from what the broader team accomplished.",
        analysis.scores.experience.score < 55 ? "critical" : "important",
      ),
      feedback(
        "Show decision quality",
        "Add constraints, trade-offs, and why the chosen approach mattered.",
      ),
      ...(weakBullets.length > 0
        ? [
            feedback(
              "Upgrade weak bullets",
              `${weakBullets.length} detected statement${weakBullets.length === 1 ? "" : "s"} need stronger verbs or measurable outcomes.`,
            ),
          ]
        : []),
    ],
    questions: [
      "What was difficult about the most important project?",
      "How did the candidate measure success and respond when results changed?",
    ],
  };

  const engineeringManager: AgentReview = {
    id: "engineering-manager",
    name: "Ellis",
    role: "Engineering manager reviewer",
    score: Math.min(
      100,
      Math.round(analysis.scores.experience.score * 0.7 + technicalDepth * 5),
    ),
    verdict:
      technicalDepth >= 5
        ? "The stack is visible; the next improvement is proving technical judgment."
        : "Technical breadth or depth is difficult to assess from the current evidence.",
    feedback: [
      feedback(
        "Connect technology to outcomes",
        "Explain why a technology was selected and what reliability, speed, cost, or customer result improved.",
        technicalDepth < 3 ? "critical" : "important",
      ),
      feedback(
        "Show engineering scale",
        "Include traffic, data volume, latency, team size, deployment frequency, or system boundaries where relevant.",
      ),
      feedback(
        "Surface collaboration",
        "Show design reviews, mentoring, incident leadership, or cross-functional decisions.",
        "polish",
      ),
    ],
    questions: [
      "What technical trade-off best demonstrates seniority?",
      "How has this candidate improved the engineering system around them?",
    ],
  };

  return [ats, recruiter, hiringManager, engineeringManager].map((review) => ({
    ...review,
    verdict: roastMode ? roast(review.verdict, review.score) : review.verdict,
  }));
}
