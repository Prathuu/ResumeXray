import type {
  AchievementReview,
  AtsAnalysis,
  ResumeSection,
  ScoreDetail,
} from "@/types/analysis";
import { extractResumeSegments } from "../utils";

const SECTION_HEADINGS = [
  "summary",
  "profile",
  "experience",
  "work experience",
  "employment",
  "skills",
  "technical skills",
  "education",
  "projects",
  "certifications",
] as const;

const STRONG_VERBS = [
  "achieved",
  "accelerated",
  "architected",
  "built",
  "delivered",
  "designed",
  "developed",
  "drove",
  "improved",
  "increased",
  "launched",
  "led",
  "optimized",
  "reduced",
  "scaled",
  "spearheaded",
  "streamlined",
] as const;

const WEAK_VERBS: Record<string, string[]> = {
  helped: ["enabled", "accelerated", "delivered"],
  worked: ["built", "executed", "collaborated"],
  responsible: ["owned", "led", "delivered"],
  assisted: ["supported", "enabled", "coordinated"],
  handled: ["managed", "resolved", "operated"],
  participated: ["contributed", "partnered", "executed"],
  used: ["applied", "implemented", "leveraged"],
  did: ["executed", "delivered", "completed"],
};

const COMMON_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node",
  "python",
  "java",
  "sql",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "git",
  "agile",
  "leadership",
  "analytics",
  "machine learning",
  "communication",
  "product",
  "project management",
] as const;

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function scoreDetail(
  label: string,
  score: number,
  strong: string,
  weak: string,
): ScoreDetail {
  return {
    label,
    score: clamp(score),
    summary: score >= 75 ? strong : weak,
  };
}

function splitSections(text: string): ResumeSection[] {
  const lines = extractResumeSegments(text).map((line) => line.trim());
  const boundaries: { index: number; name: string }[] = [];

  lines.forEach((line, index) => {
    const normalized = line
      .toLowerCase()
      .replace(/[:\-–—]/g, "")
      .trim();
    const heading = SECTION_HEADINGS.find(
      (candidate) =>
        normalized === candidate ||
        (normalized.startsWith(candidate) && normalized.length < 30),
    );
    if (heading) boundaries.push({ index, name: line.replace(/[:\-–—]/g, "") });
  });

  if (boundaries.length === 0) {
    return [
      {
        name: "Resume content",
        content: text,
        score: 55,
        sentiment: "mixed",
        note: "Use standard section headings so ATS systems can map your content.",
      },
    ];
  }

  return boundaries.map((boundary, position) => {
    const end = boundaries[position + 1]?.index ?? lines.length;
    const content = lines
      .slice(boundary.index + 1, end)
      .join("\n")
      .trim();
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const hasMetric = /\b\d+(?:[.,]\d+)?%?|\$[\d,.]+/i.test(content);
    const score = clamp(
      45 + Math.min(wordCount, 100) * 0.35 + (hasMetric ? 18 : 0),
    );
    return {
      name: boundary.name,
      content,
      score,
      sentiment: score >= 75 ? "strong" : score >= 55 ? "mixed" : "weak",
      note:
        score >= 75
          ? "Clear, evidence-rich section with useful detail."
          : hasMetric
            ? "Good evidence; tighten language and add more role-specific detail."
            : "Add measurable outcomes and concrete evidence to strengthen this section.",
    };
  });
}

function reviewAchievements(text: string): AchievementReview[] {
  const lines = extractResumeSegments(text)
    .map((line) => line.replace(/^[\s•●▪◦*-]+/, "").trim())
    .filter((line) => line.length >= 30 && line.length <= 300)
    .slice(0, 12);

  return lines.map((bullet) => {
    const firstWord = bullet.toLowerCase().split(/\W+/)[0] ?? "";
    const weakVerb = Object.keys(WEAK_VERBS).find(
      (verb) =>
        firstWord === verb || bullet.toLowerCase().startsWith(`${verb} `),
    );
    const hasStrongVerb = STRONG_VERBS.some((verb) =>
      bullet.toLowerCase().startsWith(`${verb} `),
    );
    const hasMetric = /\b\d+(?:[.,]\d+)?%?|\$[\d,.]+/i.test(bullet);
    const score = clamp(
      38 +
        (hasStrongVerb ? 28 : 0) +
        (hasMetric ? 25 : 0) +
        (bullet.length < 180 ? 9 : 0) -
        (weakVerb ? 18 : 0),
    );

    return {
      bullet,
      score,
      weakVerb,
      strongerVerbs: weakVerb
        ? WEAK_VERBS[weakVerb]
        : hasStrongVerb
          ? []
          : ["Delivered", "Improved", "Led"],
      hasMetric,
      feedback:
        score >= 75
          ? "Strong outcome-oriented statement."
          : !hasMetric
            ? "Add scale, speed, revenue, quality, or adoption evidence."
            : "Lead with a more specific action verb and clarify your ownership.",
    };
  });
}

export function analyzeResume(resumeText: string): AtsAnalysis {
  const words = resumeText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = resumeText.toLowerCase();
  const sections = splitSections(resumeText);
  const achievements = reviewAchievements(resumeText);
  console.log("========== ACHIEVEMENTS ==========");
  console.log(achievements);
  const foundSkills = COMMON_SKILLS.filter((skill) => lower.includes(skill));
  const contactSignals = [
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(resumeText),
    /(?:\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(resumeText),
    /linkedin\.com/i.test(resumeText),
  ].filter(Boolean).length;
  const conventionalSections = sections.length >= 4;
  const quantifiedBullets = achievements.filter(
    (item) => item.hasMetric,
  ).length;
  const strongBullets = achievements.filter((item) => item.score >= 75).length;

  const formatting = scoreDetail(
    "Formatting",
    46 +
      contactSignals * 8 +
      (conventionalSections ? 20 : 0) +
      (wordCount >= 300 && wordCount <= 1000 ? 10 : 0),
    "Easy to scan with conventional structure.",
    "Improve standard headings, contact details, or resume length.",
  );
  const content = scoreDetail(
    "Content",
    42 +
      Math.min(sections.length, 6) * 5 +
      Math.min(quantifiedBullets, 5) * 5 +
      (wordCount >= 350 ? 8 : 0),
    "Specific content is supported by measurable outcomes.",
    "Add sharper outcomes, context, and evidence.",
  );
  const skills = scoreDetail(
    "Skills",
    40 + Math.min(foundSkills.length, 10) * 5.5,
    `${foundSkills.length} recognizable skills create a clear capability signal.`,
    "Make technical and functional skills easier to identify.",
  );
  const experience = scoreDetail(
    "Experience",
    38 + Math.min(achievements.length, 8) * 3 + Math.min(strongBullets, 5) * 7,
    "Experience bullets emphasize ownership and impact.",
    "Rewrite duties as actions, decisions, and measurable outcomes.",
  );

  const overallScore = clamp(
    formatting.score * 0.2 +
      content.score * 0.3 +
      skills.score * 0.2 +
      experience.score * 0.3,
  );

  const recommendations = [
    ...(contactSignals < 2
      ? ["Add clear email, phone, and professional profile contact details."]
      : []),
    ...(!conventionalSections
      ? [
          "Use conventional headings such as Summary, Experience, Skills, and Education.",
        ]
      : []),
    ...(quantifiedBullets < 3
      ? [
          "Quantify at least three achievements with scale, speed, quality, or business impact.",
        ]
      : []),
    ...(foundSkills.length < 6
      ? [
          "Create a concise skills section using terms that also appear in target job descriptions.",
        ]
      : []),
    ...(wordCount < 300
      ? [
          "Add relevant detail; the resume is currently too sparse for strong matching.",
        ]
      : wordCount > 1000
        ? ["Trim low-value detail to keep the resume focused and scannable."]
        : []),
  ].slice(0, 6);

  if (recommendations.length === 0) {
    recommendations.push(
      "Tailor the summary and top achievements to each target job description.",
      "Keep the strongest, most recent evidence in the top half of the resume.",
    );
  }

  const strengths = [
    ...(conventionalSections ? ["Recognizable ATS-friendly structure"] : []),
    ...(foundSkills.length >= 6 ? ["Clear skills signal"] : []),
    ...(quantifiedBullets >= 3 ? ["Multiple quantified achievements"] : []),
    ...(strongBullets >= 3 ? ["Strong action-oriented experience"] : []),
  ];

  return {
    overallScore,
    scores: { formatting, content, skills, experience },
    sections,
    achievements,
    recommendations,
    strengths:
      strengths.length > 0 ? strengths : ["Readable text extraction completed"],
    generatedAt: new Date().toISOString(),
    engine: "ResumeXray local engine v1",
  };
}
