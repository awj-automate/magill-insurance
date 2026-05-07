"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Cog,
  FileSignature,
  Filter,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Pencil,
  RefreshCw,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { applications, type AppStatus, type Application } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

const statusMeta: Record<AppStatus, { label: string; pill: string; dot: string }> = {
  new: { label: "New", pill: "bg-sky-500/15 text-sky-300 border-sky-500/30", dot: "bg-sky-400" },
  review: { label: "Awaiting review", pill: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  flagged: { label: "Flagged", pill: "bg-rose-500/15 text-rose-300 border-rose-500/30", dot: "bg-rose-400" },
  approved: { label: "Approved · ready", pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
  sent: { label: "Sent", pill: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", dot: "bg-cyan-400" },
  bound: { label: "Bound · in AMS360", pill: "bg-slate-500/15 text-slate-300 border-slate-500/30", dot: "bg-slate-400" },
};

type FilterKey = "all" | "needs-attention" | "approved" | "sent";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs-attention", label: "Needs attention" },
  { key: "approved", label: "Ready to send" },
  { key: "sent", label: "Sent / Bound" },
];

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState<string>(applications[0].id);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (filter === "needs-attention" && !["flagged", "review"].includes(a.status)) return false;
      if (filter === "approved" && a.status !== "approved") return false;
      if (filter === "sent" && !["sent", "bound"].includes(a.status)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !a.insured.toLowerCase().includes(q) &&
          !a.contact.toLowerCase().includes(q) &&
          !a.id.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [filter, query]);

  const selected = applications.find((a) => a.id === selectedId) ?? applications[0];

  return (
    <div className="flex h-screen w-full bg-ink-950 text-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-none flex-col border-r border-slate-800/80 bg-ink-900/60 lg:flex">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
            <FileSignature className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-50">Magill</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Workflow v0.1</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-3 text-sm">
          <NavItem icon={<LayoutDashboard className="h-4 w-4" />} active>
            Pipeline
            <span className="ml-auto rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
              {applications.filter((a) => ["flagged", "review"].includes(a.status)).length}
            </span>
          </NavItem>
          <NavItem icon={<Inbox className="h-4 w-4" />}>New Business</NavItem>
          <NavItem icon={<RefreshCw className="h-4 w-4" />}>Renewals</NavItem>
          <NavItem icon={<Pencil className="h-4 w-4" />}>Change Forms</NavItem>
          <NavItem icon={<ClipboardCheck className="h-4 w-4" />}>Audit log</NavItem>
          <NavItem icon={<Sparkles className="h-4 w-4" />}>Prompts &amp; Rules</NavItem>
          <NavItem icon={<Cog className="h-4 w-4" />}>Settings</NavItem>
        </nav>
        <div className="border-t border-slate-800/80 px-3 py-3">
          <div className="rounded-lg bg-ink-800/70 px-3 py-2.5">
            <div className="text-xs font-semibold text-slate-200">Mike Magill</div>
            <div className="text-[11px] text-slate-500">Owner · Two-seat license</div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-800/80 bg-ink-900/40 px-6 py-3.5 backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to architecture
          </Link>
          <div className="ml-2 flex flex-1 items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search applications, insureds, contacts…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-ink-950 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-emerald-500/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-ink-900 text-slate-400 transition hover:text-slate-100">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300">
              MM
            </div>
          </div>
        </header>

        {/* Body — 2-pane */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[420px_1fr]">
          {/* List pane */}
          <div className="flex min-h-0 flex-col border-r border-slate-800/80">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-50">Pipeline</div>
                <div className="text-[11px] text-slate-500">{filtered.length} of {applications.length} applications</div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300 transition hover:border-slate-700">
                <Filter className="h-3 w-3" /> Sort
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800/80 px-5 py-2.5">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition",
                    filter === f.key
                      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                      : "text-slate-400 hover:bg-ink-800 hover:text-slate-100",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={cn(
                    "block w-full border-b border-slate-800/50 px-5 py-3.5 text-left transition",
                    selectedId === a.id ? "bg-ink-800/70" : "hover:bg-ink-900/80",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">{a.id}</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">{a.type}</span>
                      </div>
                      <div className="mt-1 truncate text-sm font-semibold text-slate-100">{a.insured}</div>
                      <div className="truncate text-[11px] text-slate-500">
                        {a.contact} · {a.horses} horse{a.horses === 1 ? "" : "s"} · {a.submittedAt}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusPill status={a.status} />
                    {a.flagCount > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                        <AlertTriangle className="h-3 w-3" />
                        {a.flagCount} flag{a.flagCount === 1 ? "" : "s"}
                      </span>
                    ) : null}
                    <ConfidencePill conf={a.aiConfidence} />
                  </div>
                </button>
              ))}
              {filtered.length === 0 ? (
                <div className="px-5 py-8 text-center text-xs text-slate-500">
                  No applications match this filter.
                </div>
              ) : null}
            </div>
          </div>

          {/* Detail pane */}
          <DetailPane app={selected} />
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  children,
  active,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20"
          : "text-slate-400 hover:bg-ink-800 hover:text-slate-100",
      )}
    >
      {icon}
      <span className="flex-1">{children}</span>
    </div>
  );
}

function StatusPill({ status }: { status: AppStatus }) {
  const m = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold", m.pill)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

function ConfidencePill({ conf }: { conf: number }) {
  const pct = Math.round(conf * 100);
  const tone = conf >= 0.85 ? "emerald" : conf >= 0.75 ? "cyan" : "amber";
  const cls =
    tone === "emerald"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : tone === "cyan"
        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
        : "border-amber-500/30 bg-amber-500/10 text-amber-300";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold", cls)}>
      <Sparkles className="h-3 w-3" />
      AI {pct}%
    </span>
  );
}

function DetailPane({ app }: { app: Application }) {
  const [tab, setTab] = useState<"overview" | "horses" | "drafts" | "audit">("overview");
  return (
    <div className="flex min-h-0 flex-col bg-ink-950">
      {/* Detail header */}
      <div className="border-b border-slate-800/80 px-7 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
              <span className="font-mono text-slate-400">{app.id}</span>
              <span>·</span>
              <span>{app.type}</span>
              <span>·</span>
              <span>Submitted {app.submittedAt}</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-50">{app.insured}</h1>
            <div className="mt-1 text-sm text-slate-400">
              {app.contact} · {app.email} · {app.phone}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusPill status={app.status} />
            <ConfidencePill conf={app.aiConfidence} />
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Horses on schedule" value={String(app.horses)} />
          <Stat label="Annual premium" value={app.premium ? `$${app.premium.toLocaleString()}` : "—"} />
          <Stat label="UW flags" value={String(app.flagCount)} tone={app.flagCount > 0 ? "warn" : "ok"} />
          <Stat label="AI confidence" value={`${Math.round(app.aiConfidence * 100)}%`} tone={app.aiConfidence >= 0.85 ? "ok" : app.aiConfidence >= 0.75 ? "info" : "warn"} />
        </div>

        {/* Reclass note */}
        {app.reclassNote ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-violet-500/30 bg-violet-500/5 px-3 py-2 text-[12px] text-violet-200">
            <RefreshCw className="mt-0.5 h-3.5 w-3.5 flex-none text-violet-300" />
            <div>
              <span className="font-semibold">Auto-reclassified by rules engine.</span>{" "}
              <span className="text-violet-300/80">{app.reclassNote}</span>
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mt-5 flex gap-1 border-b border-slate-800/80 -mb-5">
          {(["overview", "horses", "drafts", "audit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-2 text-sm capitalize transition",
                tab === t
                  ? "border-b-2 border-emerald-400 text-slate-50"
                  : "border-b-2 border-transparent text-slate-400 hover:text-slate-100",
              )}
            >
              {t}
              {t === "horses" && app.horsesList ? (
                <span className="ml-1.5 text-[10px] text-slate-500">{app.horsesList.length}</span>
              ) : null}
              {t === "audit" ? (
                <span className="ml-1.5 text-[10px] text-slate-500">{app.audit.length}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Detail body */}
      <div className="flex-1 overflow-auto px-7 py-6">
        {tab === "overview" ? <OverviewTab app={app} /> : null}
        {tab === "horses" ? <HorsesTab app={app} /> : null}
        {tab === "drafts" ? <DraftsTab app={app} /> : null}
        {tab === "audit" ? <AuditTab app={app} /> : null}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "info" | "neutral";
}) {
  const valueColor =
    tone === "ok" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : tone === "info" ? "text-cyan-300" : "text-slate-100";
  return (
    <div className="rounded-lg border border-slate-800/80 bg-ink-900/40 px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={cn("mt-1 text-base font-semibold", valueColor)}>{value}</div>
    </div>
  );
}

function OverviewTab({ app }: { app: Application }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="md:col-span-2 space-y-5">
        <Card title="AI summary" eyebrow="Claude Sonnet 4.6" eyebrowTone="ai">
          <p className="text-[14px] leading-relaxed text-slate-200">{app.summary}</p>
          {app.conditions.length > 0 ? (
            <ul className="mt-4 space-y-2 text-[13px]">
              {app.conditions.map((c, i) => (
                <li key={i} className="flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-amber-100/90">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-300" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[13px] text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              No underwriting flags. Ready to draft.
            </div>
          )}
        </Card>

        <Card title="Suggested next action" eyebrow="Workflow" eyebrowTone="ui">
          <div className="flex flex-wrap items-center gap-3">
            {app.status === "flagged" || app.status === "review" ? (
              <>
                <ActionButton primary>Approve drafts &amp; send</ActionButton>
                <ActionButton>Edit AI drafts</ActionButton>
                <ActionButton>Add internal note</ActionButton>
              </>
            ) : app.status === "approved" ? (
              <>
                <ActionButton primary icon={<Send className="h-3.5 w-3.5" />}>Send email + SMS</ActionButton>
                <ActionButton>Edit before send</ActionButton>
              </>
            ) : app.status === "sent" ? (
              <>
                <ActionButton>View thread</ActionButton>
                <ActionButton>Mark as bound</ActionButton>
              </>
            ) : (
              <>
                <ActionButton icon={<ArrowUpRight className="h-3.5 w-3.5" />}>Open in AMS360 thread</ActionButton>
              </>
            )}
          </div>
          <p className="mt-3 text-[12px] text-slate-500">
            Every send action records to the audit log with operator, timestamp, and the exact draft body.
          </p>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Compliance" eyebrow="Audit" eyebrowTone="compliance">
          <ul className="space-y-2 text-[13px] text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Signed PDF archived (R2)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Submission ID idempotency-keyed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              All AI calls logged with prompt + confidence
            </li>
          </ul>
        </Card>

        <Card title="Linked records" eyebrow="Airtable" eyebrowTone="data">
          <ul className="space-y-1.5 text-[13px] text-slate-300">
            <li className="flex justify-between">
              <span className="text-slate-400">Application</span>
              <span className="font-mono text-slate-200">{app.id}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Form ref</span>
              <span className="font-mono text-slate-200">FS-{Math.floor(Math.random() * 99999)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Horses</span>
              <span className="font-mono text-slate-200">{app.horsesList?.length ?? app.horses}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Audit entries</span>
              <span className="font-mono text-slate-200">{app.audit.length}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function HorsesTab({ app }: { app: Application }) {
  if (!app.horsesList || app.horsesList.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-ink-900/40 p-6 text-sm text-slate-400">
        No per-horse breakdown for this submission.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-ink-900/40">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-800/70 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Breed</th>
            <th className="px-4 py-3 font-semibold">Age</th>
            <th className="px-4 py-3 font-semibold">Insured value</th>
            <th className="px-4 py-3 font-semibold">Conditions</th>
            <th className="px-4 py-3 font-semibold">Flag</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {app.horsesList.map((h) => (
            <tr key={h.name} className={cn(h.flag === "review" && "bg-amber-500/[0.04]")}>
              <td className="px-4 py-3 font-semibold text-slate-100">{h.name}</td>
              <td className="px-4 py-3 text-slate-300">{h.breed}</td>
              <td className="px-4 py-3 text-slate-300">{h.age}</td>
              <td className="px-4 py-3 text-slate-300">${h.value.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-300">{h.conditions}</td>
              <td className="px-4 py-3">
                {h.flag === "review" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                    <AlertTriangle className="h-3 w-3" /> Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> OK
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DraftsTab({ app }: { app: Application }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card
        title="Email draft"
        eyebrow="Resend · template NB-renewal-01"
        eyebrowTone="action"
        action={
          <div className="flex gap-2">
            <ActionButton compact>Edit</ActionButton>
            <ActionButton compact primary icon={<Send className="h-3 w-3" />}>Send</ActionButton>
          </div>
        }
        icon={<Mail className="h-4 w-4 text-rose-300" />}
      >
        <pre className="whitespace-pre-wrap rounded-md border border-slate-800 bg-ink-950 p-4 text-[12.5px] leading-relaxed text-slate-200 font-mono">
          {app.drafts.email || "(no email draft for this record)"}
        </pre>
        <div className="mt-3 text-[11px] text-slate-500">
          Body composed from template + AI-generated context. Editable before send.
        </div>
      </Card>
      <Card
        title="SMS draft"
        eyebrow="Twilio · template NB-renewal-01-sms"
        eyebrowTone="action"
        action={
          <div className="flex gap-2">
            <ActionButton compact>Edit</ActionButton>
            <ActionButton compact primary icon={<Send className="h-3 w-3" />}>Send</ActionButton>
          </div>
        }
        icon={<MessageSquare className="h-4 w-4 text-rose-300" />}
      >
        <pre className="whitespace-pre-wrap rounded-md border border-slate-800 bg-ink-950 p-4 text-[12.5px] leading-relaxed text-slate-200 font-mono">
          {app.drafts.sms || "(no SMS draft for this record)"}
        </pre>
        <div className="mt-3 text-[11px] text-slate-500">
          Twin of the email — every email template ships with a paired SMS.
        </div>
      </Card>
    </div>
  );
}

function AuditTab({ app }: { app: Application }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-ink-900/40 p-2">
      <ol className="relative space-y-0">
        {app.audit.map((e, i) => {
          const dot =
            e.level === "warn" ? "bg-amber-400" : e.level === "ok" ? "bg-emerald-400" : "bg-sky-400";
          return (
            <li key={i} className="relative flex items-start gap-3 px-3 py-3">
              <div className="relative flex flex-col items-center self-stretch">
                <div className={cn("mt-1.5 h-2 w-2 flex-none rounded-full ring-2 ring-ink-900", dot)} />
                {i < app.audit.length - 1 ? (
                  <div className="flex-1 w-px bg-slate-800/80 mt-1" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-[11px] font-mono text-slate-500">{e.ts}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {e.actor}
                  </span>
                </div>
                <div className="mt-1 text-[13.5px] text-slate-200">{e.event}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Card({
  title,
  eyebrow,
  eyebrowTone = "ui",
  icon,
  action,
  children,
}: {
  title: string;
  eyebrow?: string;
  eyebrowTone?: "ai" | "ui" | "action" | "data" | "compliance";
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const eyebrowColor =
    eyebrowTone === "ai"
      ? "text-amber-300"
      : eyebrowTone === "action"
        ? "text-rose-300"
        : eyebrowTone === "data"
          ? "text-sky-300"
          : eyebrowTone === "compliance"
            ? "text-slate-300"
            : "text-cyan-300";
  return (
    <div className="rounded-xl border border-slate-800 bg-ink-900/40 p-5 shadow-glow">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {eyebrow ? (
            <div className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", eyebrowColor)}>
              {eyebrow}
            </div>
          ) : null}
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-50">
            {icon}
            {title}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ActionButton({
  children,
  primary,
  compact,
  icon,
}: {
  children: React.ReactNode;
  primary?: boolean;
  compact?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-semibold transition",
        compact ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-[12px]",
        primary
          ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          : "border border-slate-700 bg-ink-800/80 text-slate-200 hover:border-slate-600 hover:bg-ink-800",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
