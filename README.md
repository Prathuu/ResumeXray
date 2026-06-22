# ResumeXray

ResumeXray is a privacy-first, frontend-only resume analysis workspace. It
extracts PDF and DOCX content in the browser, evaluates ATS readiness, compares
resumes with job descriptions, and turns the results into practical career
guidance.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4 and shadcn/ui conventions
- Zustand and TanStack Query
- React Hook Form and Zod
- Motion and Lucide icons
- PDF.js and Mammoth for browser-side parsing

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality commands

```bash
npm run verify
```

This runs linting, type checking, tests, and a production build.

## Privacy and architecture

Resume parsing and deterministic analysis run locally in the browser. The
application has no authentication, database, or application backend. An
optional provider adapter can call an OpenAI-compatible LLM directly from the
browser after explicit user configuration; provider credentials are never
committed or persisted by default.

## Delivery progress

- [x] Milestone 1 — project foundation and tooling
- [x] Milestone 2 — design system and application shell
- [x] Milestone 3 — resume upload and parsing
- [ ] Milestone 4 — ATS analysis engine
- [ ] Milestone 5 — career intelligence
- [ ] Milestone 6 — multi-agent feedback
- [ ] Milestone 7 — export and UX polish
- [ ] Milestone 8 — production readiness
