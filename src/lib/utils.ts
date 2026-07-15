import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractSectionSegments(text: string): string[] {
  return text
    .replace(/([A-Z][A-Z &]{3,}:?)/g, "\n$1")
    .replace(/●|•|▪|◦/g, "\n$&")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function extractAchievementBullets(text: string): string[] {
  const sections = text.match(
    /(EXPERIENCE|PROJECTS)([\s\S]*?)(?=EDUCATION|LANGUAGE|CERTIFICATIONS|$)/i,
  );

  if (!sections) return [];

  return sections[2]
    .split(/(?=●|•|▪|◦)/)
    .map((line) => line.replace(/^[\s•●▪◦*-]+/, "").trim())
    .filter((line) => {
      if (line.length < 30 || line.length > 350) return false;

      // Ignore headings
      if (
        /^(description|key achievements?|experience|projects?)$/i.test(line)
      ) {
        return false;
      }

      // Ignore company names / date lines
      if (
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}|Present)/i.test(
          line,
        ) &&
        line.split(" ").length < 10
      ) {
        return false;
      }

      return true;
    });
}
