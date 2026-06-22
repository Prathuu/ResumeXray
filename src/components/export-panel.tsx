"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileJson,
  FileText,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { analyzeResume } from "@/lib/analysis/ats-engine";
import { createAgentReviews } from "@/lib/analysis/review-engine";
import {
  exportReportJson,
  exportReportPdf,
  type ResumeXrayReport,
} from "@/lib/report-export";
import { useResumeStore } from "@/store/resume-store";

export function ExportPanel() {
  const resume = useResumeStore((state) => state.resume);
  const [exportingPdf, setExportingPdf] = useState(false);
  const report = useMemo<ResumeXrayReport | null>(() => {
    if (!resume) return null;
    const { previewUrl: _previewUrl, ...safeResume } = resume;
    void _previewUrl;
    return {
      product: "ResumeXray",
      exportedAt: new Date().toISOString(),
      resume: safeResume,
      atsAnalysis: analyzeResume(resume.text),
      reviews: createAgentReviews(resume.text),
    };
  }, [resume]);

  if (!report) return null;

  const exportPdf = async () => {
    setExportingPdf(true);
    try {
      await exportReportPdf({
        ...report,
        exportedAt: new Date().toISOString(),
      });
      toast.success("PDF report downloaded");
    } catch {
      toast.error("The PDF report could not be generated.");
    } finally {
      setExportingPdf(false);
    }
  };

  const exportJson = () => {
    exportReportJson({ ...report, exportedAt: new Date().toISOString() });
    toast.success("JSON report downloaded");
  };

  const weakest = Object.values(report.atsAnalysis.scores).sort(
    (a, b) => a.score - b.score,
  )[0];

  return (
    <section id="export" aria-labelledby="export-title" className="mt-10 mb-8">
      <Card className="border-primary/20 overflow-hidden bg-slate-950 text-white dark:bg-slate-900">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <Badge className="mb-5 bg-white/10 text-cyan-200">
              <Sparkles className="mr-1 size-3.5" />
              Career insights
            </Badge>
            <CardHeader className="mb-6 p-0">
              <CardTitle id="export-title" className="text-2xl sm:text-3xl">
                Your strongest next move is clear.
              </CardTitle>
              <CardDescription className="max-w-xl text-slate-300">
                Keep the strengths that already scan well, then improve the
                weakest signal before your next application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-0">
              {report.atsAnalysis.strengths.slice(0, 3).map((strength) => (
                <div key={strength} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="size-4 text-cyan-300" />
                  {strength}
                </div>
              ))}
              <div className="mt-5 flex gap-3 rounded-xl bg-white/8 p-4">
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                <p className="text-sm leading-6 text-slate-200">
                  <strong>Focus next:</strong> {weakest?.summary}
                </p>
              </div>
            </CardContent>
          </div>

          <div className="rounded-2xl bg-white/8 p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-slate-950">
                <Download className="size-5" />
              </span>
              <div>
                <p className="font-semibold">Export your report</p>
                <p className="text-xs text-slate-400">
                  Generated entirely in this browser
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={exportPdf}
                disabled={exportingPdf}
              >
                {exportingPdf ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <FileText />
                )}
                Download PDF report
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                onClick={exportJson}
              >
                <FileJson />
                Download JSON data
              </Button>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="size-3.5" />
              No account or server storage required
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
