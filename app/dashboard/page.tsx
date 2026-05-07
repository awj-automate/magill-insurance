"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  Cog,
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
import {
  applications as baseApplications,
  type AppStatus,
  type Application,
} from "@/lib/demo-data";
import { cn } from "@/lib/cn";

type View = "pipeline" | "new-business" | "renewals" | "change-forms" | "audit" | "prompts" | "settings";
type DetailTab = "overview" | "horses" | "drafts" | "audit";

const navItems: { key: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "pipeline", label: "Pipeline", icon: LayoutDashboard },
  { key: "new-business", label: "New Business", icon: Inbox },
  { key: "renewals", label: "Renewals", icon: RefreshCw },
  { key: "change-forms", label: "Change Forms", icon: Pencil },
  { key: "audit", label: "Audit log", icon: ClipboardCheck },
  { key: "prompts", label: "Prompts & Rules", icon: Sparkles },
  { key: "settings", label: "Settings", icon: Cog },
];

const statusMeta: Record<AppStatus, { label: string; pill: string; dot: string }> = {
  new: { label: "New", pill: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
  review: { label: "Awaiting review", pill: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  flagged: { label: "Flagged", pill: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
  approved: { label: "Approved · ready", pill: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  sent: { label: "Sent", pill: "bg-cyan-50 text-cyan-700 border-cyan-200", dot: "bg-cyan-500" },
  bound: { label: "Bound · in AMS360", pill: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
};

type FilterKey = "all" | "needs-attention" | "approved" | "sent";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs-attention", label: "Needs attention" },
  { key: "approved", label: "Ready to send" },
  { key: "sent", label: "Sent / Bound" },
];

const viewMeta: Record<View, { title: string; subtitle: string }> = {
  pipeline: { title: "Pipeline", subtitle: "Every active application across all form types." },
  "new-business": { title: "New Business", subtitle: "First-time applications submitted via Formstack." },
  renewals: { title: "Renewals", subtitle: "Annual renewal submissions, reconciled against bound policies." },
  "change-forms": { title: "Change Forms", subtitle: "Mid-term endorsements, address updates, schedule changes." },
  audit: { title: "Audit log", subtitle: "Append-only record of every system + operator event." },
  prompts: { title: "Prompts & Rules", subtitle: "Tune the rules engine and AI prompts without a redeploy." },
  settings: { title: "Settings", subtitle: "Team, integrations, and notification preferences." },
};

function applicationsForView(view: View, apps: Application[]): Application[] {
  if (view === "new-business") return apps.filter((a) => a.type === "New Business");
  if (view === "renewals") return apps.filter((a) => a.type === "Renewal");
  if (view === "change-forms") return apps.filter((a) => a.type === "Change Form");
  return apps;
}

export default function DashboardPage() {
  const [view, setView] = useState<View>("pipeline");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AppStatus>>({});
  const [draftOverrides, setDraftOverrides] = useState<Record<string, { email?: string; sms?: string }>>({});
  const [selectedId, setSelectedId] = useState<string>(baseApplications[0].id);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const apps = useMemo<Application[]>(
    () =>
      baseApplications.map((a) => ({
        ...a,
        status: statusOverrides[a.id] ?? a.status,
        drafts: {
          email: draftOverrides[a.id]?.email ?? a.drafts.email,
          sms: draftOverrides[a.id]?.sms ?? a.drafts.sms,
        },
      })),
    [statusOverrides, draftOverrides],
  );

  const onUpdateStatus = (id: string, next: AppStatus) =>
    setStatusOverrides((p) => ({ ...p, [id]: next }));
  const onUpdateDraft = (id: string, field: "email" | "sms", value: string) =>
    setDraftOverrides((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));

  const isListView =
    view === "pipeline" || view === "new-business" || view === "renewals" || view === "change-forms";

  const viewApps = useMemo(() => applicationsForView(view, apps), [view, apps]);

  const filtered = useMemo(() => {
    return viewApps.filter((a) => {
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
  }, [viewApps, filter, query]);

  const selected =
    filtered.find((a) => a.id === selectedId) ??
    viewApps.find((a) => a.id === selectedId) ??
    viewApps[0];

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-none flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-200">
          <Image
            src="/logo.png"
            alt="Magill Livestock Insurance"
            width={180}
            height={48}
            priority
            className="h-9 w-auto"
          />
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-3 text-sm">
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              icon={<item.icon className="h-4 w-4" />}
              active={view === item.key}
              onClick={() => setView(item.key)}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to architecture
          </Link>
          <div className="ml-2 flex flex-1 items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications, insureds, contacts…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>
          </div>
        </header>

        {/* Body */}
        {isListView ? (
          <ListAndDetail
            view={view}
            applications={viewApps}
            filtered={filtered}
            filter={filter}
            setFilter={setFilter}
            selected={selected}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onUpdateStatus={onUpdateStatus}
            onUpdateDraft={onUpdateDraft}
          />
        ) : view === "audit" ? (
          <AuditView apps={apps} />
        ) : view === "prompts" ? (
          <PromptsView />
        ) : (
          <SettingsView />
        )}
      </div>
    </div>
  );
}

function NavItem({
  icon,
  children,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      {icon}
      <span className="flex-1 text-left">{children}</span>
    </button>
  );
}

function StatusPill({ status }: { status: AppStatus }) {
  const m = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold", m.pill)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

function ListAndDetail({
  view,
  applications: viewApps,
  filtered,
  filter,
  setFilter,
  selected,
  selectedId,
  setSelectedId,
  onUpdateStatus,
  onUpdateDraft,
}: {
  view: View;
  applications: Application[];
  filtered: Application[];
  filter: FilterKey;
  setFilter: (f: FilterKey) => void;
  selected: Application | undefined;
  selectedId: string;
  setSelectedId: (id: string) => void;
  onUpdateStatus: (id: string, next: AppStatus) => void;
  onUpdateDraft: (id: string, field: "email" | "sms", value: string) => void;
}) {
  const meta = viewMeta[view];

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[420px_1fr]">
      <div className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3">
          <div className="text-sm font-semibold text-slate-900">{meta.title}</div>
          <div className="text-[11px] text-slate-500">{filtered.length} of {viewApps.length} applications</div>
        </div>
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 px-5 py-2.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition",
                filter === f.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
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
                "block w-full border-b border-slate-100 px-5 py-3.5 text-left transition",
                selectedId === a.id ? "bg-slate-50" : "hover:bg-slate-50/60",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">{a.id}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">{a.type}</span>
              </div>
              <div className="mt-1 truncate text-sm font-semibold text-slate-900">{a.insured}</div>
              <div className="truncate text-[11px] text-slate-500">
                {a.contact} · {a.horses} horse{a.horses === 1 ? "" : "s"} · {a.submittedAt}
              </div>
              <div className="mt-2">
                <StatusPill status={a.status} />
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

      {selected ? (
        <DetailPane app={selected} onUpdateStatus={onUpdateStatus} onUpdateDraft={onUpdateDraft} />
      ) : (
        <EmptyDetail />
      )}
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="flex items-center justify-center bg-slate-50 text-sm text-slate-500">
      Select an application to see details.
    </div>
  );
}

function DetailPane({
  app,
  onUpdateStatus,
  onUpdateDraft,
}: {
  app: Application;
  onUpdateStatus: (id: string, next: AppStatus) => void;
  onUpdateDraft: (id: string, field: "email" | "sms", value: string) => void;
}) {
  const [tab, setTab] = useState<DetailTab>("overview");
  return (
    <div className="flex min-h-0 flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-7 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
              <span className="font-mono text-slate-600">{app.id}</span>
              <span>·</span>
              <span>{app.type}</span>
              <span>·</span>
              <span>Submitted {app.submittedAt}</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">{app.insured}</h1>
            <div className="mt-1 text-sm text-slate-500">
              {app.contact} · {app.email} · {app.phone}
            </div>
          </div>
          <StatusPill status={app.status} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="Horses on schedule" value={String(app.horses)} />
          <Stat label="Annual premium" value={app.premium ? `$${app.premium.toLocaleString()}` : "—"} />
          <Stat label="Submitted" value={app.submittedAt} />
        </div>

        {app.reclassNote ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-700">
            <RefreshCw className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-500" />
            <div>
              <span className="font-semibold">Auto-reclassified by rules engine.</span>{" "}
              <span className="text-slate-600">{app.reclassNote}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex gap-1 border-b border-slate-200 -mb-5">
          {(["overview", "horses", "drafts", "audit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-2 text-sm capitalize transition",
                tab === t
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "border-b-2 border-transparent text-slate-500 hover:text-slate-900",
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

      <div className="flex-1 overflow-auto px-7 py-6">
        {tab === "overview" ? (
          <OverviewTab app={app} onSwitchTab={setTab} onUpdateStatus={onUpdateStatus} />
        ) : null}
        {tab === "horses" ? <HorsesTab app={app} /> : null}
        {tab === "drafts" ? (
          <DraftsTab app={app} onUpdateStatus={onUpdateStatus} onUpdateDraft={onUpdateDraft} />
        ) : null}
        {tab === "audit" ? <AuditTab app={app} /> : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function OverviewTab({
  app,
  onSwitchTab,
  onUpdateStatus,
}: {
  app: Application;
  onSwitchTab: (t: DetailTab) => void;
  onUpdateStatus: (id: string, next: AppStatus) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="md:col-span-2 space-y-5">
        <Card title="AI summary">
          <p className="text-[14px] leading-relaxed text-slate-700">{app.summary}</p>
          {app.conditions.length > 0 ? (
            <ul className="mt-4 space-y-1.5 text-[13px] text-slate-700">
              {app.conditions.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-slate-400" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 text-[13px] text-slate-500">No underwriting flags. Ready to draft.</div>
          )}
        </Card>

        <Card title="Suggested next action">
          <NextActions app={app} onSwitchTab={onSwitchTab} onUpdateStatus={onUpdateStatus} />
          <p className="mt-3 text-[12px] text-slate-500">
            Every send action records to the audit log with operator, timestamp, and the exact draft body.
          </p>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Compliance">
          <ul className="space-y-2 text-[13px] text-slate-700">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              Signed PDF archived
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              Submission ID idempotency-keyed
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              All AI calls logged
            </li>
          </ul>
        </Card>

        <Card title="Linked records">
          <ul className="space-y-1.5 text-[13px] text-slate-700">
            <li className="flex justify-between">
              <span className="text-slate-500">Application</span>
              <span className="font-mono text-slate-800">{app.id}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Horses</span>
              <span className="font-mono text-slate-800">{app.horsesList?.length ?? app.horses}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Audit entries</span>
              <span className="font-mono text-slate-800">{app.audit.length}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function NextActions({
  app,
  onSwitchTab,
  onUpdateStatus,
}: {
  app: Application;
  onSwitchTab: (t: DetailTab) => void;
  onUpdateStatus: (id: string, next: AppStatus) => void;
}) {
  if (app.status === "flagged" || app.status === "review") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton primary icon={<Send className="h-3.5 w-3.5" />} onClick={() => onUpdateStatus(app.id, "sent")}>
          Approve drafts &amp; send
        </ActionButton>
        <ActionButton onClick={() => onSwitchTab("drafts")}>Edit AI drafts</ActionButton>
      </div>
    );
  }
  if (app.status === "approved" || app.status === "new") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton primary icon={<Send className="h-3.5 w-3.5" />} onClick={() => onUpdateStatus(app.id, "sent")}>
          Send email + SMS
        </ActionButton>
        <ActionButton onClick={() => onSwitchTab("drafts")}>Edit before send</ActionButton>
      </div>
    );
  }
  if (app.status === "sent") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton primary onClick={() => onUpdateStatus(app.id, "bound")}>
          Mark as bound
        </ActionButton>
      </div>
    );
  }
  return (
    <div className="text-[13px] text-slate-600">
      Bound — managed in AMS360. No further action in this system.
    </div>
  );
}

function HorsesTab({ app }: { app: Application }) {
  const list = app.horsesList ?? [];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Breed</th>
            <th className="px-4 py-3 font-semibold">Age</th>
            <th className="px-4 py-3 font-semibold">Insured value</th>
            <th className="px-4 py-3 font-semibold">Conditions</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((h) => (
            <tr key={h.name}>
              <td className="px-4 py-3 font-semibold text-slate-900">{h.name}</td>
              <td className="px-4 py-3 text-slate-700">{h.breed}</td>
              <td className="px-4 py-3 text-slate-700">{h.age}</td>
              <td className="px-4 py-3 text-slate-700">${h.value.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-700">{h.conditions}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                    h.flag === "review"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-slate-50 text-slate-600",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      h.flag === "review" ? "bg-amber-500" : "bg-slate-400",
                    )}
                  />
                  {h.flag === "review" ? "Review" : "OK"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DraftsTab({
  app,
  onUpdateStatus,
  onUpdateDraft,
}: {
  app: Application;
  onUpdateStatus: (id: string, next: AppStatus) => void;
  onUpdateDraft: (id: string, field: "email" | "sms", value: string) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <DraftCard
        title="Email draft"
        icon={<Mail className="h-4 w-4 text-slate-500" />}
        body={app.drafts.email}
        emptyLabel="No email draft for this record."
        onSave={(v) => onUpdateDraft(app.id, "email", v)}
        onSend={() => onUpdateStatus(app.id, "sent")}
      />
      <DraftCard
        title="SMS draft"
        icon={<MessageSquare className="h-4 w-4 text-slate-500" />}
        body={app.drafts.sms}
        emptyLabel="No SMS draft for this record."
        onSave={(v) => onUpdateDraft(app.id, "sms", v)}
        onSend={() => onUpdateStatus(app.id, "sent")}
      />
    </div>
  );
}

function DraftCard({
  title,
  icon,
  body,
  emptyLabel,
  onSave,
  onSend,
}: {
  title: string;
  icon: React.ReactNode;
  body: string;
  emptyLabel: string;
  onSave: (v: string) => void;
  onSend: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          {icon}
          {title}
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <ActionButton compact onClick={() => { setDraft(body); setEditing(false); }}>
                Cancel
              </ActionButton>
              <ActionButton
                compact
                primary
                onClick={() => {
                  onSave(draft);
                  setEditing(false);
                }}
              >
                Save
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton compact onClick={() => { setDraft(body); setEditing(true); }} disabled={!body}>
                Edit
              </ActionButton>
              <ActionButton compact primary icon={<Send className="h-3 w-3" />} onClick={onSend} disabled={!body}>
                Send
              </ActionButton>
            </>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="block w-full min-h-[260px] resize-y rounded-md border border-slate-300 bg-white p-4 text-[12.5px] leading-relaxed text-slate-800 font-mono outline-none focus:border-slate-500"
        />
      ) : (
        <pre className="whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-[12.5px] leading-relaxed text-slate-800 font-mono">
          {body || `(${emptyLabel})`}
        </pre>
      )}
    </div>
  );
}

function AuditTab({ app }: { app: Application }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2">
      <ol className="relative space-y-0">
        {app.audit.map((e, i) => (
          <li key={i} className="relative flex items-start gap-3 px-3 py-3">
            <div className="relative flex flex-col items-center self-stretch">
              <div className="mt-1.5 h-2 w-2 flex-none rounded-full bg-slate-400 ring-2 ring-white" />
              {i < app.audit.length - 1 ? (
                <div className="flex-1 w-px bg-slate-200 mt-1" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[11px] font-mono text-slate-500">{e.ts}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {e.actor}
                </span>
              </div>
              <div className="mt-1 text-[13.5px] text-slate-800">{e.event}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Card({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          {icon}
          {title}
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
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  primary?: boolean;
  compact?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-semibold transition",
        compact ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-[12px]",
        disabled && "cursor-not-allowed opacity-50",
        primary
          ? "bg-slate-900 text-white hover:bg-slate-800"
          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function AuditView({ apps }: { apps: Application[] }) {
  const allEntries = useMemo(() => {
    return apps
      .flatMap((a) =>
        a.audit.map((e) => ({
          ...e,
          appId: a.id,
          insured: a.insured,
          type: a.type,
        })),
      )
      .sort((a, b) => (a.ts < b.ts ? 1 : -1));
  }, [apps]);

  return (
    <div className="flex-1 overflow-auto bg-slate-50 px-7 py-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Audit log</h1>
          <p className="mt-1 text-sm text-slate-500">{viewMeta.audit.subtitle}</p>
        </header>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Application</th>
                <th className="px-5 py-3 font-semibold">Actor</th>
                <th className="px-5 py-3 font-semibold">Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allEntries.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 align-top font-mono text-[12px] text-slate-500 whitespace-nowrap">{e.ts}</td>
                  <td className="px-5 py-3 align-top">
                    <div className="font-mono text-[11px] text-slate-500">{e.appId}</div>
                    <div className="text-[12.5px] font-semibold text-slate-900">{e.insured}</div>
                  </td>
                  <td className="px-5 py-3 align-top text-[12px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    {e.actor}
                  </td>
                  <td className="px-5 py-3 align-top text-[13px] text-slate-800">{e.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PromptsView() {
  const sections: { title: string; description: string; items: { name: string; preview: string }[] }[] = [
    {
      title: "Email & SMS templates",
      description: "Each row pairs an email body and an SMS twin. AI fills in the variable parts at draft time.",
      items: [
        { name: "NB-quote-01", preview: "New business quote ready · single horse" },
        { name: "NB-clarify-01", preview: "Clarification request · prior coverage gap" },
        { name: "RN-review-01", preview: "Renewal · two or more flagged horses" },
        { name: "RN-cleanbind-01", preview: "Renewal · all clean, ready to bind" },
        { name: "CF-confirm-01", preview: "Change form · endorsement confirmation" },
      ],
    },
    {
      title: "Classification rules",
      description: "Deterministic rules that classify or auto-correct each submission. Tunable parameters only — the underlying logic ships in code.",
      items: [
        { name: "form-type-discriminator", preview: "Resolves new biz vs. endorsement vs. renewal via DB lookup" },
        { name: "valuation-yoy-threshold", preview: "Flag when value increase exceeds 25% YoY" },
        { name: "prior-coverage-lookup", preview: "Cross-check declared prior carrier against internal ledger" },
        { name: "schedule-diff", preview: "Compare renewal schedule to bound policy; flag adds/removes" },
      ],
    },
    {
      title: "AI prompts",
      description: "The system prompts that shape AI behavior. Edit, save, and changes apply on the next submission.",
      items: [
        { name: "condition-summarizer", preview: "Summarize disclosed conditions in plain English." },
        { name: "renewal-diff-narrative", preview: "Narrate how this renewal differs from the bound policy." },
        { name: "email-drafter", preview: "Draft owner-voice email from a template + context." },
        { name: "confidence-self-check", preview: "Output a confidence score with reasoning." },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 px-7 py-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Prompts &amp; Rules</h1>
          <p className="mt-1 text-sm text-slate-500">{viewMeta.prompts.subtitle}</p>
        </header>
        <div className="space-y-6">
          {sections.map((s) => (
            <PromptSection key={s.title} title={s.title} description={s.description} items={s.items} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PromptSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: { name: string; preview: string }[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((i) => [i.name, i.preview])),
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-[12px] text-slate-500">{description}</p>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => {
          const isEditing = editing === item.name;
          return (
            <li key={item.name} className="px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[12px] text-slate-500">{item.name}</div>
                  {isEditing ? (
                    <textarea
                      value={drafts[item.name]}
                      onChange={(e) => setDrafts((p) => ({ ...p, [item.name]: e.target.value }))}
                      className="mt-1 block w-full min-h-[80px] resize-y rounded-md border border-slate-300 bg-white p-2 text-[13px] text-slate-800 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <div className="text-[13px] text-slate-800">{drafts[item.name]}</div>
                  )}
                </div>
                <div className="flex flex-none gap-2">
                  {isEditing ? (
                    <>
                      <ActionButton
                        compact
                        onClick={() => {
                          setDrafts((p) => ({ ...p, [item.name]: item.preview }));
                          setEditing(null);
                        }}
                      >
                        Cancel
                      </ActionButton>
                      <ActionButton compact primary onClick={() => setEditing(null)}>
                        Save
                      </ActionButton>
                    </>
                  ) : (
                    <ActionButton compact onClick={() => setEditing(item.name)}>
                      Edit
                    </ActionButton>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SettingsView() {
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    "high-priority-flag": true,
    "auto-reclassified": true,
    "ai-low-confidence": true,
    "daily-digest": false,
  });
  const toggle = (k: string) => setNotifs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex-1 overflow-auto bg-slate-50 px-7 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">{viewMeta.settings.subtitle}</p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Team</h2>
            <p className="mt-1 text-[12px] text-slate-500">Two-seat license. Both seats see the same pipeline.</p>
          </div>
          <ul className="divide-y divide-slate-100">
            <SettingsRow name="Mike Magill" role="Owner" email="mike@magillinsurance.com" />
            <SettingsRow name="Lauren Park" role="CSR" email="lauren@magillinsurance.com" />
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Integrations</h2>
            <p className="mt-1 text-[12px] text-slate-500">Connected services for intake, archive, and outbound.</p>
          </div>
          <ul className="divide-y divide-slate-100">
            <IntegrationRow name="Formstack" detail="Webhook · 4 forms wired" status="connected" />
            <IntegrationRow name="Make.com" detail="Active scenarios · 3" status="connected" />
            <IntegrationRow name="Airtable" detail="Base · Magill Workflow v1" status="connected" />
            <IntegrationRow name="PDF archive" detail="Cloudflare R2 bucket" status="connected" />
            <IntegrationRow name="Email" detail="Resend · magillinsurance.com domain" status="connected" />
            <IntegrationRow name="SMS" detail="Twilio · +1 (859) 555-0100" status="connected" />
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
            <p className="mt-1 text-[12px] text-slate-500">Email or SMS me when these events fire.</p>
          </div>
          <ul className="divide-y divide-slate-100">
            <NotifRow label="High-priority flag (UW review)" enabled={notifs["high-priority-flag"]} onToggle={() => toggle("high-priority-flag")} />
            <NotifRow label="Auto-reclassified submission" enabled={notifs["auto-reclassified"]} onToggle={() => toggle("auto-reclassified")} />
            <NotifRow label="AI low-confidence routed to review" enabled={notifs["ai-low-confidence"]} onToggle={() => toggle("ai-low-confidence")} />
            <NotifRow label="Daily pipeline digest" enabled={notifs["daily-digest"]} onToggle={() => toggle("daily-digest")} />
          </ul>
        </section>
      </div>
    </div>
  );
}

function SettingsRow({ name, role, email }: { name: string; role: string; email: string }) {
  return (
    <li className="px-5 py-3">
      <div className="text-[13.5px] font-semibold text-slate-900">{name}</div>
      <div className="text-[12px] text-slate-500">{role} · {email}</div>
    </li>
  );
}

function IntegrationRow({ name, detail, status }: { name: string; detail: string; status: "connected" | "disconnected" }) {
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-slate-900">{name}</div>
        <div className="text-[12px] text-slate-500">{detail}</div>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
          status === "connected"
            ? "border-slate-200 bg-slate-50 text-slate-700"
            : "border-rose-200 bg-rose-50 text-rose-700",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", status === "connected" ? "bg-slate-400" : "bg-rose-500")} />
        {status === "connected" ? "Connected" : "Disconnected"}
      </span>
    </li>
  );
}

function NotifRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="text-[13.5px] text-slate-800">{label}</div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "inline-flex h-5 w-9 items-center rounded-full p-0.5 transition",
          enabled ? "bg-slate-900" : "bg-slate-200",
        )}
        aria-pressed={enabled}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white transition",
            enabled ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
    </li>
  );
}
