import { create } from "zustand";

import type { ResumeDocument } from "@/types/resume";

interface ResumeState {
  resume: ResumeDocument | null;
  setResume: (resume: ResumeDocument) => void;
  clearResume: () => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: null,
  setResume: (resume) => {
    const currentUrl = get().resume?.previewUrl;
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    set({ resume });
  },
  clearResume: () => {
    const currentUrl = get().resume?.previewUrl;
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    set({ resume: null });
  },
}));
