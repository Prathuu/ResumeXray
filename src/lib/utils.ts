import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractResumeSegments(text: string): string[] {
  return text
    .replace(/●/g, "\n●")
    .replace(/•/g, "\n•")
    .replace(/▪/g, "\n▪")
    .replace(/◦/g, "\n◦")
    .replace(/([A-Z][A-Z &]{3,}):?/g, "\n$1")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
