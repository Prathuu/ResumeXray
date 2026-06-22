"use client";

import { useState, type ReactNode } from "react";
import {
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileScan,
  Menu,
  ScanSearch,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Workspace", icon: FileScan, href: "#workspace" },
  { label: "ATS analysis", icon: ChartNoAxesCombined, href: "#analysis" },
  { label: "Job match", icon: BriefcaseBusiness, href: "#career" },
  { label: "Career roadmap", icon: BrainCircuit, href: "#career" },
  { label: "Review panel", icon: UsersRound, href: "#reviews" },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-xl shadow-lg">
          <ScanSearch className="size-5" />
        </span>
        <div>
          <p className="font-semibold tracking-tight">ResumeXray</p>
          <p className="text-muted-foreground text-xs">Career intelligence</p>
        </div>
      </div>
      <nav aria-label="Primary navigation" className="flex-1 space-y-1 px-3">
        {navigation.map(({ label, icon: Icon, href }, index) => (
          <a
            key={label}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              index === 0
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </a>
        ))}
      </nav>
      <div className="bg-muted/70 m-4 rounded-2xl border p-4">
        <Sparkles className="text-primary mb-3 size-5" />
        <p className="text-sm font-semibold">Private by design</p>
        <p className="text-muted-foreground mt-1 text-xs leading-5">
          Resume parsing and core analysis happen on this device.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <aside className="glass-panel fixed inset-y-0 left-0 z-30 hidden w-64 border-y-0 border-l-0 lg:block">
        <Sidebar />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="bg-card-solid fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-5 right-4"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
              >
                <X />
              </Button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="bg-background/75 sticky top-0 z-20 border-b backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
              >
                <Menu />
              </Button>
              <div>
                <p className="text-sm font-semibold">Analysis workspace</p>
                <p className="text-muted-foreground hidden text-xs sm:block">
                  Turn your resume into an interview-ready story
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-card text-muted-foreground hidden rounded-full border px-3 py-1 text-xs sm:inline-flex">
                Local analysis
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main id="workspace" className="mx-auto max-w-7xl p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
