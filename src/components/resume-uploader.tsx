"use client";

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  FileUp,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";
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
import { parseResume } from "@/lib/resume-parser";
import {
  ACCEPTED_RESUME_TYPES,
  MAX_RESUME_SIZE,
  resumeFileSchema,
} from "@/lib/resume-schema";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";

function fileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ResumeUploader() {
  const { resume, setResume, clearResume } = useResumeStore();
  const mutation = useMutation({
    mutationFn: parseResume,
    onSuccess: (parsed, file) => {
      setResume({
        ...parsed,
        previewUrl:
          parsed.fileType === "pdf" ? URL.createObjectURL(file) : undefined,
      });
      toast.success("Resume parsed successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleFiles = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const validation = resumeFileSchema.safeParse(file);
      if (!validation.success) {
        toast.error(validation.error.issues[0]?.message);
        return;
      }
      mutation.mutate(file);
    },
    [mutation],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDropAccepted: handleFiles,
      maxFiles: 1,
      maxSize: MAX_RESUME_SIZE,
      accept: {
        [ACCEPTED_RESUME_TYPES[0]]: [".pdf"],
        [ACCEPTED_RESUME_TYPES[1]]: [".docx"],
      },
      disabled: mutation.isPending,
    });

  return (
    <section aria-labelledby="upload-title" className="mt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-primary text-sm font-semibold">Step 1</p>
          <h2
            id="upload-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Add your resume
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            PDF and DOCX files up to 10 MB. Processing stays in your browser.
          </p>
        </div>
        <Badge>
          <ShieldCheck className="mr-1 size-3.5" />
          No file uploads to a server
        </Badge>
      </div>

      {!resume ? (
        <Card className="p-3">
          <div
            {...getRootProps()}
            className={cn(
              "grid min-h-72 cursor-pointer place-items-center rounded-2xl border border-dashed p-8 text-center transition-colors",
              isDragActive
                ? "border-primary bg-accent/70"
                : "border-border hover:border-primary/50 hover:bg-muted/60",
            )}
          >
            <input {...getInputProps()} aria-label="Upload resume" />
            <div>
              <motion.span
                animate={isDragActive ? { y: [0, -8, 0] } : {}}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
                className="bg-accent text-accent-foreground mx-auto mb-5 grid size-14 place-items-center rounded-2xl"
              >
                {mutation.isPending ? (
                  <LoaderCircle className="size-6 animate-spin" />
                ) : (
                  <FileUp className="size-6" />
                )}
              </motion.span>
              <p className="text-lg font-semibold">
                {mutation.isPending
                  ? "Reading your resume…"
                  : isDragActive
                    ? "Drop it here"
                    : "Drag your resume here"}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                or click to choose a PDF or DOCX file
              </p>
            </div>
          </div>
          {fileRejections.length > 0 && (
            <p className="text-danger mt-3 flex items-center gap-2 px-2 text-sm">
              <AlertCircle className="size-4" />
              Choose one valid PDF or DOCX file no larger than 10 MB.
            </p>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <Card className="min-w-0">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-5" />
                  Parsed content
                </CardTitle>
                <CardDescription className="mt-1 truncate">
                  {resume.fileName} · {fileSize(resume.fileSize)}
                  {resume.pageCount ? ` · ${resume.pageCount} pages` : ""}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Replace resume"
                  onClick={clearResume}
                >
                  <RefreshCw />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove resume"
                  onClick={clearResume}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted text-foreground max-h-[34rem] overflow-auto rounded-xl p-4 font-sans text-sm leading-6 whitespace-pre-wrap">
                {resume.text}
              </pre>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary size-5" />
                  File preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resume.previewUrl ? (
                  <iframe
                    title={`${resume.fileName} preview`}
                    src={resume.previewUrl}
                    className="h-80 w-full rounded-xl border bg-white"
                  />
                ) : (
                  <div className="bg-muted grid h-52 place-items-center rounded-xl p-6 text-center">
                    <div>
                      <FileText className="text-primary mx-auto mb-3 size-8" />
                      <p className="font-semibold">DOCX text extracted</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        The parsed content is the accessible browser preview.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Parsing diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  {resume.diagnostics.map((diagnostic) => (
                    <li key={diagnostic} className="flex gap-2">
                      <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                      {diagnostic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
