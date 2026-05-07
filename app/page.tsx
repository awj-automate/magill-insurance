import Link from "next/link";
import { ArrowRight, Github, LayoutDashboard } from "lucide-react";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Section } from "@/components/section";
import { cn } from "@/lib/cn";

const phases = [
  {
    n: "Phase 1",
    title: "Intake plumbing",
    desc: "Formstack webhook → Make.com router → Airtable schema with form-type discrimination. PDF lands in archive bucket. Idempotent on submission ID.",
    bullets: ["Webhook auth + replay", "Form-type discrimination", "Airtable schema (apps, horses, events)", "PDF archive write"],
  },
  {
    n: "Phase 2",
    title: "Rules engine + multi-entity",
    desc: "Deterministic classifier corrects misfiled new business vs. endorsements via DB lookup. Renewal payloads with multiple horses get split into per-horse rows with stable parent IDs.",
    bullets: ["Misclass auto-fix", "Per-horse normalization", "Lookup against bound business", "Versioned rule definitions"],
  },
  {
    n: "Phase 3",
    title: "Confidence-aware AI layer",
    desc: "Claude generates condition summaries, drafts emails/SMS, and produces renewal diff narratives. Outputs include a confidence band — low confidence routes to a human review queue instead of auto-sending.",
    bullets: ["Disclosed condition summary", "14-template email + SMS twin", "Renewal diff narrative", "Confidence threshold gating"],
  },
  {
    n: "Phase 4",
    title: "Dashboard, audit, tuning",
    desc: "Two-seat Next.js dashboard for pipeline review, draft approval, and send. Every flag, decision, and message is logged. Prompts and rules are editable in-app so the owner can tune without redeploys.",
    bullets: ["Pipeline + detail views", "Draft → approve → send", "Append-only audit log", "Owner-editable prompts/rules"],
  },
];

const stack = [
  {
    layer: "Form intake",
    pick: "Formstack",
    why: "Brief is fixed on this. Already collecting structured fields + signed PDF.",
    note: "No PDF parsing in v1 — structured fields carry the system data.",
    tone: "intake",
  },
  {
    layer: "Workflow orchestration",
    pick: "Make.com",
    why: "Brief is fixed on this. Visual scenarios match the freelancer-maintainable goal.",
    note: "Webhooks signed; idempotency key = Formstack submission ID.",
    tone: "intake",
  },
  {
    layer: "System database",
    pick: "Airtable",
    why: "Brief is fixed on this. Owner-readable, owner-editable, exposes a real REST API.",
    note: "Tables: applications, horses, events, audit_log, prompts, rules.",
    tone: "data",
  },
  {
    layer: "PDF archive",
    pick: "Cloudflare R2",
    why: "Compliance-only blob storage — cheaper than S3, no egress fees.",
    note: "Alt: Google Drive folder if Make.com integration is preferred.",
    tone: "compliance",
  },
  {
    layer: "Frontend",
    pick: "Next.js 14 (App Router) + TypeScript",
    why: "Server components, route handlers, streaming UIs — fits AI workflows well.",
    note: "Deployed on Vercel free tier with preview deploys per branch.",
    tone: "ui",
  },
  {
    layer: "UI kit",
    pick: "Tailwind + shadcn/ui",
    why: "shadcn for tables, dialogs, drawers, command menu — no time spent on plumbing.",
    note: "Lucide icons; Radix primitives under the hood.",
    tone: "ui",
  },
  {
    layer: "Auth",
    pick: "Supabase Auth",
    why: "Two seats (owner + CSR), magic-link or OAuth. Free tier covers it.",
    note: "RLS not strictly required — Airtable is the data store, not Postgres.",
    tone: "ui",
  },
  {
    layer: "AI",
    pick: "Claude (Anthropic API)",
    why: "Best for nuanced text drafting, summarization, and structured outputs with confidence reasoning.",
    note: "Sonnet 4.6 default; Haiku 4.5 for cheap classification fallbacks. Prompt caching enabled.",
    tone: "ai",
  },
  {
    layer: "Rules engine",
    pick: "TypeScript + zod schemas",
    why: "Deterministic logic stays in code; rule parameters live in Airtable so the owner can tune.",
    note: "Versioned rule rows; every fired rule is captured in the audit log.",
    tone: "logic",
  },
  {
    layer: "Email",
    pick: "Resend",
    why: "Cheap, reliable, React Email templates. 14 templates wire up cleanly.",
    note: "Drafts assembled from template + AI body; human approves before send.",
    tone: "action",
  },
  {
    layer: "SMS",
    pick: "Twilio (or OpenPhone)",
    why: "Twilio if owner wants per-template programmatic sending; OpenPhone if they want a real shared inbox.",
    note: "Recommend Twilio for v1 — pairs with the same draft → approve flow.",
    tone: "action",
  },
  {
    layer: "Observability",
    pick: "Sentry + Axiom",
    why: "Sentry for app errors; Axiom for webhook + AI call logs. Both free tiers fit.",
    note: "Audit log lives in Airtable for owner visibility; ops logs in Axiom.",
    tone: "compliance",
  },
];

const toneClasses: Record<string, string> = {
  intake: "border-emerald-400/30 bg-emerald-500/5",
  data: "border-sky-400/30 bg-sky-500/5",
  ai: "border-amber-400/30 bg-amber-500/5",
  ui: "border-cyan-400/30 bg-cyan-500/5",
  action: "border-rose-400/30 bg-rose-500/5",
  logic: "border-violet-400/30 bg-violet-500/5",
  compliance: "border-slate-400/30 bg-slate-500/5",
};

const toneLabels: Record<string, string> = {
  intake: "text-emerald-300",
  data: "text-sky-300",
  ai: "text-amber-300",
  ui: "text-cyan-300",
  action: "text-rose-300",
  logic: "text-violet-300",
  compliance: "text-slate-300",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink-950 text-slate-100">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-800/80">
        <div className="dotgrid absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 -top-40 h-[420px] bg-gradient-to-b from-emerald-500/15 via-transparent to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pb-24 md:pt-24">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Magill Specialty Insurance · Workflow Architecture
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-50 md:text-6xl">
            Formstack to bind, in one auditable lane.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
            Webhook intake of new business, renewals, and change forms — classified by a
            deterministic rules engine, summarized by a confidence-aware AI, and reviewed
            from a single two-seat dashboard. Every flag, decision, and message logged for
            compliance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              View dashboard demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#diagram"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-ink-900/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-ink-800"
            >
              See the flow
            </a>
            <a
              href="#stack"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
            >
              Stack rationale
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
            {[
              { k: "Timeline", v: "4–6 weeks" },
              { k: "Budget (Phases 1–4)", v: "$4k–$10k fixed" },
              { k: "Retainer (3–6 mo)", v: "$500–$1.5k/mo" },
              { k: "Out of v1", v: "AMS360 + carrier portals" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-slate-800/80 bg-ink-900/50 p-4">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {s.k}
                </dt>
                <dd className="mt-1 text-base font-semibold text-slate-100">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Diagram */}
      <Section
        id="diagram"
        eyebrow="System flow"
        title="One submission, four lanes, one inbox."
        description="The horizontal arrows are the live data flow. The dashed lines are configuration, auth, and compliance side-channels. Hover to inspect; pinch to zoom."
      >
        <ArchitectureDiagram />

        <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-400 md:grid-cols-4">
          <Legend dot="bg-emerald-400" label="Intake (Formstack → Airtable)" />
          <Legend dot="bg-sky-400" label="Data fan-out from Airtable" />
          <Legend dot="bg-cyan-400" label="UI / dashboard reads" />
          <Legend dot="bg-rose-400" label="Outbound action (email / SMS)" />
        </div>
      </Section>

      {/* Phases */}
      <Section
        id="phases"
        eyebrow="Build plan"
        title="Four phases, milestone-billed."
        description="Each phase is independently shippable. Phases 1–2 give you a working intake-and-classify pipeline before any AI lands."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {phases.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl border border-slate-800 bg-ink-900/50 p-6 shadow-glow"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                {p.n}
              </div>
              <h3 className="mt-1 text-lg font-semibold text-slate-50">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Stack */}
      <Section
        id="stack"
        eyebrow="Stack & rationale"
        title="Locked picks, with a real reason for each."
        description="Formstack, Make.com, and Airtable are fixed by the brief. Everything else is a chosen pick — listed with why, plus the realistic alternative."
      >
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-ink-900/40">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-800/70 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Layer</th>
                <th className="px-5 py-3 font-semibold">Pick</th>
                <th className="px-5 py-3 font-semibold">Why</th>
                <th className="px-5 py-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stack.map((row) => (
                <tr key={row.layer} className={cn("transition", toneClasses[row.tone])}>
                  <td className="px-5 py-3 align-top">
                    <span className={cn("text-[11px] font-semibold uppercase tracking-wider", toneLabels[row.tone])}>
                      {row.layer}
                    </span>
                  </td>
                  <td className="px-5 py-3 align-top text-sm font-semibold text-slate-100">
                    {row.pick}
                  </td>
                  <td className="px-5 py-3 align-top text-sm text-slate-300">{row.why}</td>
                  <td className="px-5 py-3 align-top text-xs text-slate-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Aside
            title="Where it deviates from your defaults"
            body="Brief mandates Airtable, not Supabase Postgres — so the system DB is Airtable. Supabase still earns a spot for auth (free, two seats). Cloudflare R2 over S3 for the PDF archive — no egress fees and brief is cheap-but-reliable."
          />
          <Aside
            title="What stays exactly per your defaults"
            body="Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui. Resend for email. Deployed to Vercel from commit 1 — no local dev. pnpm. zod-validated env."
          />
          <Aside
            title="What I'd push back on"
            body="A 14-template library should be modeled as data, not 14 React Email files. One template engine + Airtable rows = the owner can edit copy without a redeploy. This is critical for AI-system tuning."
          />
        </div>
      </Section>

      {/* Out of scope */}
      <Section
        id="scope"
        eyebrow="Scope guardrails"
        title="What v1 explicitly does not do."
        description="Saying no early is what keeps a 4–6 week build on rails."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Aside
            title="Out of scope (per your brief)"
            body="AMS360 integration. Carrier portal automation. PDF parsing for system data — structured fields cover it. Anything that requires accessing a vendor's authenticated UI."
          />
          <Aside
            title="Deferred but cheap to add later"
            body="Slack notifications for high-priority flags. A second confidence tier for renewal diffs. An owner-facing weekly digest. An AI quality dashboard that tracks low-confidence rate over time."
          />
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 md:flex-row md:items-center">
          <div className="text-xs text-slate-500">
            Architecture preview · Built with Next.js 14, @xyflow/react, Tailwind. Not affiliated
            with Magill or any carrier.
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 hover:text-slate-100">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard demo
            </Link>
            <span className="text-slate-700">·</span>
            <a
              href="https://github.com"
              className="inline-flex items-center gap-1.5 hover:text-slate-100"
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      <span>{label}</span>
    </div>
  );
}

function Aside({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-ink-900/40 p-5">
      <div className="text-sm font-semibold text-slate-100">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
