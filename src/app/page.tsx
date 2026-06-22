import { ScanSearch } from "lucide-react";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="max-w-xl text-center">
        <ScanSearch className="mx-auto mb-6 size-12 text-cyan-300" />
        <p className="mb-3 text-sm font-semibold tracking-[0.22em] text-cyan-300 uppercase">
          Resume intelligence, in your browser
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          ResumeXray
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          A privacy-first workspace for ATS analysis, job matching, and
          practical career feedback.
        </p>
      </div>
    </main>
  );
}
