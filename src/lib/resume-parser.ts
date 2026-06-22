import type { ParsedResume, ResumeFileType } from "@/types/resume";

function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function parsePdf(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      content.items.map((item) => ("str" in item ? item.str : "")).join(" "),
    );
  }

  return { text: pages.join("\n\n"), pageCount: pdf.numPages };
}

async function parseDocx(file: File) {
  const mammoth = await import("mammoth/mammoth.browser");
  const result = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  return {
    text: result.value,
    diagnostics: result.messages.map(
      (message) => `${message.type}: ${message.message}`,
    ),
  };
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const isPdf = file.type === "application/pdf";
  const fileType: ResumeFileType = isPdf ? "pdf" : "docx";
  const diagnostics: string[] = [];

  try {
    const result = isPdf ? await parsePdf(file) : await parseDocx(file);
    const text = normalizeText(result.text);

    if (!text) {
      throw new Error(
        "No readable text was found. The file may contain scanned images.",
      );
    }

    if ("diagnostics" in result) {
      diagnostics.push(...result.diagnostics);
    }
    diagnostics.push(
      `${text.split(/\s+/).length.toLocaleString()} words extracted`,
      `${text.length.toLocaleString()} characters available for analysis`,
    );

    return {
      fileName: file.name,
      fileType,
      fileSize: file.size,
      text,
      pageCount: "pageCount" in result ? result.pageCount : undefined,
      parsedAt: new Date().toISOString(),
      diagnostics,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The resume could not be parsed.";
    throw new Error(`Parsing failed: ${message}`);
  }
}
