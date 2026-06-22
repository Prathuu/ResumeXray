import { z } from "zod";

export const MAX_RESUME_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const resumeFileSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_RESUME_TYPES.includes(file.type as never), {
    message: "Upload a PDF or DOCX file.",
  })
  .refine((file) => file.size <= MAX_RESUME_SIZE, {
    message: "Resume files must be 10 MB or smaller.",
  });
