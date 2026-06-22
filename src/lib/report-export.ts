import type { AtsAnalysis } from "@/types/analysis";
import type { ResumeDocument } from "@/types/resume";
import type { AgentReview } from "@/types/review";

export interface ResumeXrayReport {
  product: "ResumeXray";
  exportedAt: string;
  resume: Omit<ResumeDocument, "previewUrl">;
  atsAnalysis: AtsAnalysis;
  reviews: AgentReview[];
}

function safeName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-");
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function exportReportJson(report: ResumeXrayReport) {
  downloadBlob(
    new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json;charset=utf-8",
    }),
    `${safeName(report.resume.fileName)}-resumexray-report.json`,
  );
}

export async function exportReportPdf(report: ResumeXrayReport) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = width - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > height - margin) {
      pdf.addPage();
      y = margin;
    }
  };
  const text = (
    value: string,
    options: { size?: number; bold?: boolean; gap?: number } = {},
  ) => {
    const { size = 10, bold = false, gap = 8 } = options;
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(value, contentWidth) as string[];
    const lineHeight = size * 1.35;
    ensureSpace(lines.length * lineHeight + gap);
    pdf.text(lines, margin, y);
    y += lines.length * lineHeight + gap;
  };

  pdf.setTextColor(8, 127, 140);
  text("ResumeXray", { size: 22, bold: true, gap: 4 });
  pdf.setTextColor(23, 32, 51);
  text("Resume Analysis Report", { size: 16, bold: true });
  text(
    `${report.resume.fileName} · Exported ${new Date(report.exportedAt).toLocaleString()}`,
    { size: 9, gap: 20 },
  );

  text(`ATS readiness: ${report.atsAnalysis.overallScore}/100`, {
    size: 18,
    bold: true,
    gap: 14,
  });
  Object.values(report.atsAnalysis.scores).forEach((score) => {
    text(`${score.label}: ${score.score}/100`, {
      size: 11,
      bold: true,
      gap: 2,
    });
    text(score.summary, { size: 9, gap: 8 });
  });

  text("Recommendations", { size: 14, bold: true, gap: 8 });
  report.atsAnalysis.recommendations.forEach((item, index) => {
    text(`${index + 1}. ${item}`, { size: 10, gap: 6 });
  });

  text("Section heatmap", { size: 14, bold: true, gap: 8 });
  report.atsAnalysis.sections.forEach((section) => {
    text(`${section.name} — ${section.score}/100`, {
      size: 10,
      bold: true,
      gap: 2,
    });
    text(section.note, { size: 9, gap: 7 });
  });

  text("Reviewer panel", { size: 14, bold: true, gap: 8 });
  report.reviews.forEach((review) => {
    text(`${review.name}, ${review.role} — ${review.score}/100`, {
      size: 11,
      bold: true,
      gap: 3,
    });
    text(review.verdict, { size: 9, gap: 6 });
    review.feedback.slice(0, 2).forEach((item) => {
      text(`• ${item.title}: ${item.detail}`, { size: 9, gap: 5 });
    });
  });

  pdf.save(`${safeName(report.resume.fileName)}-resumexray-report.pdf`);
}
