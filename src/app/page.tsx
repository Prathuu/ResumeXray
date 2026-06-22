import {
  ArrowRight,
  BrainCircuit,
  FileUp,
  LockKeyhole,
  ScanText,
  Target,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { CareerIntelligence } from "@/components/career-intelligence";
import { ResumeUploader } from "@/components/resume-uploader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const capabilities = [
  {
    icon: ScanText,
    title: "ATS readiness",
    description: "Surface formatting risks, content gaps, and weak evidence.",
  },
  {
    icon: Target,
    title: "Job alignment",
    description: "Compare your experience with the role that matters now.",
  },
  {
    icon: BrainCircuit,
    title: "Career intelligence",
    description:
      "Build a focused skill roadmap and interview preparation plan.",
  },
];

export default function Home() {
  return (
    <AppShell>
      <section className="overflow-hidden rounded-3xl border bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-12 dark:bg-slate-900">
        <div className="relative z-10 max-w-3xl">
          <Badge className="mb-5 bg-white/10 text-cyan-200">
            <LockKeyhole className="mr-1 size-3" />
            Browser-first and private
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            See what recruiters and ATS systems see.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Upload your resume to uncover the strongest signals, hidden gaps,
            and the specific changes most likely to improve your next
            application.
          </p>
          <a
            href="#upload-title"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/8 p-2 pr-5 text-sm transition-colors hover:bg-white/12"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-slate-950">
              <FileUp className="size-5" />
            </span>
            Start with your resume
            <ArrowRight className="size-4 text-cyan-300" />
          </a>
        </div>
      </section>

      <section
        aria-labelledby="capabilities-title"
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        <h2 id="capabilities-title" className="sr-only">
          Analysis capabilities
        </h2>
        {capabilities.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <span className="bg-accent text-accent-foreground mb-3 grid size-10 place-items-center rounded-xl">
                <Icon className="size-5" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="text-primary text-xs font-semibold">
              Included in your analysis
            </CardContent>
          </Card>
        ))}
      </section>
      <ResumeUploader />
      <AnalysisDashboard />
      <CareerIntelligence />
    </AppShell>
  );
}
