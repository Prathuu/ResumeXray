"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  CircleHelp,
  SearchCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { analyzeCareerMatch } from "@/lib/analysis/career-engine";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";
import type { CareerAnalysis } from "@/types/career";

const schema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(120, "Paste at least 120 characters so the match has enough context.")
    .max(20_000, "Keep the job description under 20,000 characters."),
});
type FormValues = z.infer<typeof schema>;

export function CareerIntelligence() {
  const resume = useResumeStore((state) => state.resume);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { jobDescription: "" },
  });
  const descriptionLength =
    useWatch({ control, name: "jobDescription" })?.length ?? 0;
  const matchTone = useMemo(
    () =>
      analysis && analysis.matchPercentage >= 70
        ? "text-emerald-500"
        : analysis && analysis.matchPercentage >= 45
          ? "text-amber-500"
          : "text-rose-500",
    [analysis],
  );

  if (!resume) return null;
  const onSubmit = ({ jobDescription }: FormValues) => {
    setAnalysis(analyzeCareerMatch(resume.text, jobDescription));
  };

  return (
    <section aria-labelledby="career-title" className="mt-10 space-y-6">
      <div>
        <p className="text-primary text-sm font-semibold">Step 3</p>
        <h2 id="career-title" className="text-2xl font-semibold tracking-tight">
          Career intelligence
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Compare your resume with a real role and focus your next moves.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BriefcaseBusiness className="text-primary size-5" />
            Target job description
          </CardTitle>
          <CardDescription>
            Paste the full description, including responsibilities and
            qualifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              {...register("jobDescription")}
              rows={9}
              aria-invalid={Boolean(errors.jobDescription)}
              placeholder="Paste the job description here…"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              {errors.jobDescription ? (
                <p className="text-danger text-sm">
                  {errors.jobDescription.message}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {descriptionLength.toLocaleString()} / 20,000 characters
                </p>
              )}
              <Button type="submit" disabled={isSubmitting}>
                <SearchCheck /> Analyze role match
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <Card>
              <CardHeader>
                <CardDescription>Job match</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn("text-6xl font-semibold", matchTone)}>
                  {analysis.matchPercentage}%
                </div>
                <Progress value={analysis.matchPercentage} className="mt-5" />
                <p className="text-muted-foreground mt-4 text-sm leading-6">
                  {analysis.matchPercentage >= 70
                    ? "Strong alignment. Prioritize tailoring and proof."
                    : "There is meaningful overlap, with specific gaps to address."}
                </p>
              </CardContent>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="size-4 text-emerald-500" />{" "}
                    Alignment strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {analysis.strengths.length > 0 ? (
                    analysis.strengths.map((strength) => (
                      <Badge
                        key={strength}
                        className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        {strength}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No strong keyword overlap detected yet.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="size-4 text-amber-500" /> Missing
                    keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-primary size-5" /> Skill gap
                  roadmap
                </CardTitle>
                <CardDescription>
                  A practical sequence for closing the most relevant gaps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.skillGaps.length > 0 ? (
                  analysis.skillGaps.map((gap) => (
                    <div key={gap.skill} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold capitalize">{gap.skill}</p>
                        <Badge>{gap.priority} priority</Badge>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm leading-6">
                        {gap.reason}
                      </p>
                      <ol className="mt-3 space-y-2">
                        {gap.learningPath.map((step, index) => (
                          <li key={step} className="flex gap-2 text-sm">
                            <span className="text-primary font-mono text-xs">
                              0{index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))
                ) : (
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <BookOpenCheck className="text-primary mx-auto mb-3 size-6" />
                    <p className="font-semibold">
                      No major skill gaps detected
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Focus on proving depth with stronger achievement evidence.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="text-primary size-5" /> Interview
                  predictor
                </CardTitle>
                <CardDescription>
                  Topics the role and your resume are most likely to trigger.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.interviewTopics.map((topic) => (
                  <div key={topic.topic} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{topic.topic}</p>
                      <Badge>{topic.priority}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {topic.reasoning}
                    </p>
                    <div className="bg-muted mt-3 flex gap-2 rounded-lg p-3 text-sm">
                      <CircleHelp className="text-primary mt-0.5 size-4 shrink-0" />
                      {topic.preparation}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </section>
  );
}
