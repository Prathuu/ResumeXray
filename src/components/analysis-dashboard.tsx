"use client";

import { useMemo } from "react";
import {
  ArrowUpRight,
  Check,
  CircleGauge,
  Flame,
  Lightbulb,
  ScanLine,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analyzeResume } from "@/lib/analysis/ats-engine";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";

function scoreTone(score: number) {
  return score >= 75
    ? "text-emerald-600 dark:text-emerald-400"
    : score >= 55
      ? "text-amber-600 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";
}

export function AnalysisDashboard() {
  const resume = useResumeStore((state) => state.resume);
  const analysis = useMemo(
    () => (resume ? analyzeResume(resume.text) : null),
    [resume],
  );

  if (!analysis) return null;

  return (
    <section
      id="analysis"
      aria-labelledby="analysis-title"
      className="mt-10 space-y-6"
    >
      <div>
        <p className="text-primary text-sm font-semibold">Step 2</p>
        <h2
          id="analysis-title"
          className="text-2xl font-semibold tracking-tight"
        >
          ATS analysis
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Evidence-based scoring from the content parsed in your browser.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="relative overflow-hidden bg-slate-950 text-white dark:bg-slate-900">
          <div className="absolute -top-20 -right-20 size-56 rounded-full bg-cyan-400/15 blur-3xl" />
          <CardHeader>
            <CardDescription className="text-slate-400">
              Overall ATS readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl font-semibold tracking-tighter"
              >
                {analysis.overallScore}
              </motion.span>
              <span className="mb-2 text-lg text-slate-400">/100</span>
            </div>
            <Progress
              value={analysis.overallScore}
              className="mt-6 bg-white/10"
              indicatorClassName="bg-cyan-300"
            />
            <p className="mt-5 text-sm leading-6 text-slate-300">
              {analysis.overallScore >= 75
                ? "Strong foundation. Tailoring for the target role is now the highest-value move."
                : "A promising base with clear, fixable opportunities to improve scanability and evidence."}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-cyan-200">
              <ScanLine className="size-4" />
              {analysis.engine}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {Object.values(analysis.scores).map((score) => (
            <Card key={score.label}>
              <CardHeader className="mb-4 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{score.label}</CardTitle>
                <span
                  className={cn(
                    "text-2xl font-semibold",
                    scoreTone(score.score),
                  )}
                >
                  {score.score}
                </span>
              </CardHeader>
              <CardContent>
                <Progress value={score.score} />
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  {score.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="text-primary size-5" />
              Resume heatmap
            </CardTitle>
            <CardDescription>
              Section strength based on structure, detail, and measurable
              evidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.sections.map((section) => (
              <div
                key={section.name}
                className="bg-card-solid/60 rounded-xl border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{section.name}</p>
                  <Badge
                    className={cn(
                      section.sentiment === "strong" &&
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                      section.sentiment === "mixed" &&
                        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                      section.sentiment === "weak" &&
                        "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
                    )}
                  >
                    {section.score}/100
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {section.note}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-primary size-5" />
              Highest-impact recommendations
            </CardTitle>
            <CardDescription>
              Work from top to bottom for the fastest score improvement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <li
                  key={recommendation}
                  className="bg-card-solid/60 flex gap-3 rounded-xl border p-4"
                >
                  <span className="bg-accent text-accent-foreground grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6">{recommendation}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleGauge className="text-primary size-5" />
            Achievement strength
          </CardTitle>
          <CardDescription>
            Bullet-level review of action, ownership, and measurable impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.achievements.length > 0 ? (
            <div className="space-y-3">
              {analysis.achievements.map((item) => (
                <div key={item.bullet} className="rounded-xl border p-4">
                  <div className="flex items-start gap-3">
                    {item.score >= 75 ? (
                      <Check className="mt-1 size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <TriangleAlert className="mt-1 size-4 shrink-0 text-amber-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-6 font-medium">
                        {item.bullet}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge>{item.score}/100 impact</Badge>
                        <span className="text-muted-foreground text-xs">
                          {item.feedback}
                        </span>
                      </div>
                      {item.strongerVerbs.length > 0 && (
                        <p className="text-muted-foreground mt-2 text-xs">
                          Try:{" "}
                          <span className="text-foreground font-semibold">
                            {item.strongerVerbs.join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                    <ArrowUpRight className="text-muted-foreground size-4 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-8 text-center">
              <Sparkles className="text-primary mx-auto mb-3 size-6" />
              <p className="font-semibold">No achievement bullets detected</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Add concise bullet points under experience and projects.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
