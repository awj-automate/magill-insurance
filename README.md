# Magill Insurance — Workflow Architecture Preview

Visual architecture for a specialty horse insurance agency's workflow management system, plus an interactive demo of the operator-facing dashboard. Built as a one-shot scoping artifact for a freelancer engagement.

- `/` — interactive system architecture diagram + stack rationale + phase breakdown
- `/dashboard` — clickable mock of the dashboard the agency owner + CSR will use

## The system being designed

Formstack webhook → Make.com → Airtable. A deterministic rules engine classifies submissions and reconciles against bound business. A confidence-aware Claude AI summarizes disclosed conditions, drafts the email + SMS twin for each of 14 templates, and produces renewal diff narratives. A two-seat Next.js dashboard reviews everything and gates the send. Everything is logged.

PDFs are retained as a compliance archive, not a parsing source. AMS360 stays the system of record for bound business — explicitly out of v1 scope.

## Stack

- Next.js 14 (App Router) + TypeScript strict
- Tailwind CSS
- @xyflow/react for the architecture diagram
- lucide-react for icons
- No client-side data layer in this preview — `lib/demo-data.ts` is pure mock

## Deploy

This repo is meant to be deployed on Vercel free tier — push `main` and connect the repo.

```bash
pnpm install
pnpm build       # validates types + Next build
```

No local dev server required to evaluate; the deployed URL is the deliverable.

## File map

```
app/
  layout.tsx          root layout, fonts, dark theme
  page.tsx            architecture page (hero, diagram, phases, stack, scope)
  globals.css         tailwind + @xyflow/react styles
  dashboard/page.tsx  interactive dashboard demo
components/
  flow-node.tsx       custom @xyflow/react node (icon + tag + tone)
  architecture-diagram.tsx  full diagram (nodes + edges + Controls)
  section.tsx         section heading wrapper
lib/
  cn.ts               clsx + tailwind-merge
  demo-data.ts        mock applications + audit entries
```

## Notes on stack deviations

The brief locks Formstack, Make.com, and Airtable. Everything else is a chosen pick:

- **System DB:** Airtable (per brief), not Supabase Postgres. Supabase Auth still recommended for the two-seat login — it's free and bounded.
- **PDF archive:** Cloudflare R2 over S3 — no egress fees, fits the "cheap but reliable" default.
- **AI:** Claude (Sonnet 4.6 default, Haiku 4.5 for cheap classification, prompt caching on).
- **Email:** Resend.
- **SMS:** Twilio recommended over OpenPhone for v1 — pairs cleanly with the same draft → approve flow.
- **Templates:** modeled as Airtable rows, not 14 React Email files. Owner-tunable without redeploys.
