export type ResumeFileType = "pdf" | "docx";

export interface ParsedResume {
  fileName: string;
  fileType: ResumeFileType;
  fileSize: number;
  text: string;
  pageCount?: number;
  parsedAt: string;
  diagnostics: string[];
}

export interface ResumeDocument extends ParsedResume {
  previewUrl?: string;
}
