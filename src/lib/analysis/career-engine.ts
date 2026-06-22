import type { CareerAnalysis, InterviewTopic, SkillGap } from "@/types/career";

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "but",
  "can",
  "for",
  "from",
  "have",
  "into",
  "our",
  "that",
  "the",
  "their",
  "this",
  "through",
  "using",
  "will",
  "with",
  "you",
  "your",
  "years",
  "work",
  "role",
  "team",
]);

const SKILLS = [
  "agile",
  "analytics",
  "angular",
  "aws",
  "azure",
  "ci/cd",
  "communication",
  "css",
  "data analysis",
  "docker",
  "figma",
  "git",
  "go",
  "graphql",
  "java",
  "javascript",
  "kubernetes",
  "leadership",
  "machine learning",
  "next.js",
  "node.js",
  "product management",
  "python",
  "react",
  "rest api",
  "sql",
  "tailwind",
  "typescript",
] as const;

function keywordFrequency(text: string) {
  const words = text.toLowerCase().match(/[a-z][a-z0-9+#./-]{2,}/g) ?? [];
  const frequency = new Map<string, number>();
  words.forEach((word) => {
    if (!STOP_WORDS.has(word)) {
      frequency.set(word, (frequency.get(word) ?? 0) + 1);
    }
  });
  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

function includesTerm(text: string, term: string) {
  return text.toLowerCase().includes(term.toLowerCase());
}

function buildSkillGap(skill: string, rank: number): SkillGap {
  const isTechnical = !["leadership", "communication", "agile"].includes(skill);
  return {
    skill,
    priority: rank < 3 ? "high" : "medium",
    reason: `The role emphasizes ${skill}, but the resume does not surface it clearly.`,
    learningPath: isTechnical
      ? [
          `Learn the core ${skill} concepts`,
          `Build a small applied ${skill} project`,
          "Document the outcome with a measurable resume bullet",
        ]
      : [
          `Collect a concrete ${skill} example`,
          "Frame the challenge, action, and result",
          "Practice a two-minute interview story",
        ],
  };
}

function buildInterviewTopics(
  resumeText: string,
  jobDescription: string,
  missingSkills: string[],
  strengths: string[],
): InterviewTopic[] {
  const topics: InterviewTopic[] = missingSkills.slice(0, 3).map((skill) => ({
    topic: `${skill} depth`,
    priority: "high",
    reasoning: `The role values ${skill}, while the resume offers limited direct evidence.`,
    preparation: `Prepare one practical example and explain how you would apply ${skill} in this role.`,
  }));

  strengths.slice(0, 2).forEach((strength) => {
    topics.push({
      topic: `${strength} experience`,
      priority: "medium",
      reasoning:
        "This alignment strength is likely to invite a deeper follow-up.",
      preparation:
        "Prepare a STAR story with scope, trade-offs, your decisions, and a measurable result.",
    });
  });

  if (/\b(lead|manager|mentor|stakeholder)\w*/i.test(jobDescription)) {
    topics.push({
      topic: "Leadership and influence",
      priority: includesTerm(resumeText, "led") ? "medium" : "high",
      reasoning: "The role expects influence across people or stakeholders.",
      preparation:
        "Choose an example where you aligned people, handled disagreement, and improved an outcome.",
    });
  }

  if (topics.length < 4) {
    topics.push({
      topic: "Career narrative",
      priority: "medium",
      reasoning: "Interviewers will test how this move fits your trajectory.",
      preparation:
        "Connect your recent experience, this role, and the capability you want to deepen next.",
    });
  }
  return topics.slice(0, 6);
}

export function analyzeCareerMatch(
  resumeText: string,
  jobDescription: string,
): CareerAnalysis {
  const topKeywords = keywordFrequency(jobDescription).slice(0, 24);
  const matchedKeywords = topKeywords.filter((keyword) =>
    includesTerm(resumeText, keyword),
  );
  const missingKeywords = topKeywords.filter(
    (keyword) => !includesTerm(resumeText, keyword),
  );
  const relevantSkills = SKILLS.filter((skill) =>
    includesTerm(jobDescription, skill),
  );
  const matchedSkills = relevantSkills.filter((skill) =>
    includesTerm(resumeText, skill),
  );
  const missingSkills = relevantSkills.filter(
    (skill) => !includesTerm(resumeText, skill),
  );
  const keywordScore =
    topKeywords.length > 0 ? matchedKeywords.length / topKeywords.length : 0;
  const skillScore =
    relevantSkills.length > 0
      ? matchedSkills.length / relevantSkills.length
      : 1;
  const matchPercentage = Math.round(keywordScore * 65 + skillScore * 35);
  const strengths = [
    ...matchedSkills.slice(0, 5),
    ...matchedKeywords
      .filter((keyword) => !matchedSkills.includes(keyword as never))
      .slice(0, 3),
  ];

  return {
    matchPercentage,
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 12),
    missingSkills,
    strengths,
    skillGaps: missingSkills
      .slice(0, 6)
      .map((skill, index) => buildSkillGap(skill, index)),
    interviewTopics: buildInterviewTopics(
      resumeText,
      jobDescription,
      missingSkills,
      strengths,
    ),
  };
}
