"use client";

import { useMemo, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Bot,
  Briefcase,
  Code2,
  Flame,
  MessageSquareQuote,
  ScanSearch,
  UsersRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createAgentReviews } from "@/lib/analysis/review-engine";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";
import type { ReviewerId } from "@/types/review";

const icons: Record<ReviewerId, typeof Bot> = {
  ats: ScanSearch,
  recruiter: UsersRound,
  "hiring-manager": Briefcase,
  "engineering-manager": Code2,
};

const priorityTone = {
  critical: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  important:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  polish: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

export function ReviewPanel() {
  const resume = useResumeStore((state) => state.resume);
  const [roastMode, setRoastMode] = useState(false);
  const reviews = useMemo(
    () => (resume ? createAgentReviews(resume.text, roastMode) : []),
    [resume, roastMode],
  );

  if (!resume) return null;

  return (
    <section
      id="reviews"
      aria-labelledby="review-title"
      className="mt-10 space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-semibold">Step 4</p>
          <h2
            id="review-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Multi-agent review panel
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Four hiring perspectives, each looking for a different signal.
          </p>
        </div>
        <label className="bg-card flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5">
          <Flame className="size-4 text-orange-500" />
          <span className="text-sm font-semibold">Roast mode</span>
          <Switch.Root
            checked={roastMode}
            onCheckedChange={setRoastMode}
            className="bg-muted relative h-6 w-11 rounded-full transition-colors data-[state=checked]:bg-orange-500"
          >
            <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-5" />
          </Switch.Root>
        </label>
      </div>

      <Tabs.Root defaultValue="ats">
        <Tabs.List
          aria-label="Reviewer perspectives"
          className="bg-card mb-5 grid gap-2 rounded-2xl border p-2 sm:grid-cols-2 xl:grid-cols-4"
        >
          {reviews.map((review) => {
            const Icon = icons[review.id];
            return (
              <Tabs.Trigger
                key={review.id}
                value={review.id}
                className="text-muted-foreground hover:bg-muted data-[state=active]:bg-accent data-[state=active]:text-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors data-[state=active]:font-semibold"
              >
                <Icon className="size-4 shrink-0" />
                <span>
                  <span className="block">{review.name}</span>
                  <span className="block text-xs font-normal opacity-75">
                    {review.role}
                  </span>
                </span>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        <AnimatePresence mode="wait">
          {reviews.map((review) => (
            <Tabs.Content key={review.id} value={review.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <CardTitle>{review.name}&apos;s assessment</CardTitle>
                        <CardDescription>{review.role}</CardDescription>
                      </div>
                      <span className="text-3xl font-semibold">
                        {review.score}
                      </span>
                    </div>
                    <Progress value={review.score} className="mt-4" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "mb-5 rounded-xl p-4 text-sm leading-6",
                        roastMode
                          ? "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200"
                          : "bg-accent text-accent-foreground",
                      )}
                    >
                      {review.verdict}
                    </div>
                    <div className="space-y-3">
                      {review.feedback.map((item) => (
                        <div key={item.title} className="rounded-xl border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold">{item.title}</p>
                            <Badge className={priorityTone[item.priority]}>
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-2 text-sm leading-6">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquareQuote className="text-primary size-5" />
                      Likely follow-ups
                    </CardTitle>
                    <CardDescription>
                      Questions this reviewer would use to test the story.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {review.questions.map((question, index) => (
                      <div key={question} className="bg-muted rounded-xl p-4">
                        <p className="text-primary mb-2 text-xs font-semibold">
                          QUESTION {index + 1}
                        </p>
                        <p className="text-sm leading-6">{question}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </Tabs.Content>
          ))}
        </AnimatePresence>
      </Tabs.Root>
    </section>
  );
}
