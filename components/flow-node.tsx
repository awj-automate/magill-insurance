"use client";

import { Handle, Position } from "@xyflow/react";
import {
  Activity,
  BookLock,
  BotMessageSquare,
  ClipboardCheck,
  Database,
  FileSignature,
  Filter,
  Inbox,
  LayoutDashboard,
  Layers,
  Mail,
  MessageSquare,
  Network,
  Settings2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

type ToneKey = "intake" | "data" | "logic" | "ai" | "ui" | "action" | "compliance";

const tones: Record<ToneKey, { ring: string; bg: string; iconBg: string; iconColor: string; tag: string }> = {
  intake: {
    ring: "ring-emerald-400/40",
    bg: "from-emerald-500/10 to-emerald-500/0",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-300",
    tag: "text-emerald-300",
  },
  data: {
    ring: "ring-sky-400/40",
    bg: "from-sky-500/10 to-sky-500/0",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-300",
    tag: "text-sky-300",
  },
  logic: {
    ring: "ring-violet-400/40",
    bg: "from-violet-500/10 to-violet-500/0",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-300",
    tag: "text-violet-300",
  },
  ai: {
    ring: "ring-amber-400/40",
    bg: "from-amber-500/10 to-amber-500/0",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-300",
    tag: "text-amber-300",
  },
  ui: {
    ring: "ring-cyan-400/40",
    bg: "from-cyan-500/10 to-cyan-500/0",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-300",
    tag: "text-cyan-300",
  },
  action: {
    ring: "ring-rose-400/40",
    bg: "from-rose-500/10 to-rose-500/0",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-300",
    tag: "text-rose-300",
  },
  compliance: {
    ring: "ring-slate-400/40",
    bg: "from-slate-500/10 to-slate-500/0",
    iconBg: "bg-slate-500/15",
    iconColor: "text-slate-300",
    tag: "text-slate-300",
  },
};

const iconMap: Record<string, LucideIcon> = {
  inbox: Inbox,
  network: Network,
  database: Database,
  filter: Filter,
  bot: BotMessageSquare,
  layers: Layers,
  layout: LayoutDashboard,
  users: Users,
  audit: ClipboardCheck,
  mail: Mail,
  sms: MessageSquare,
  shield: ShieldCheck,
  signature: FileSignature,
  settings: Settings2,
  activity: Activity,
  lock: BookLock,
};

export type FlowNodeData = {
  title: string;
  subtitle?: string;
  tag?: string;
  icon: keyof typeof iconMap;
  tone: ToneKey;
  width?: number;
};

export function FlowNode({ data }: { data: FlowNodeData }) {
  const tone = tones[data.tone];
  const Icon = iconMap[data.icon];
  return (
    <div
      style={{ width: data.width ?? 200 }}
      className={cn(
        "rounded-xl ring-1 shadow-glow backdrop-blur-sm",
        "bg-gradient-to-br from-ink-800/90 to-ink-900/80",
        tone.ring,
      )}
    >
      <Handle id="top-t" type="target" position={Position.Top} />
      <Handle id="left-t" type="target" position={Position.Left} />
      <Handle id="bottom-t" type="target" position={Position.Bottom} />
      <Handle id="right-t" type="target" position={Position.Right} />
      <div className={cn("rounded-xl bg-gradient-to-br p-3", tone.bg)}>
        <div className="flex items-start gap-2.5">
          <div className={cn("rounded-md p-1.5", tone.iconBg)}>
            <Icon className={cn("h-4 w-4", tone.iconColor)} />
          </div>
          <div className="min-w-0 flex-1">
            {data.tag ? (
              <div className={cn("mb-0.5 text-[10px] font-semibold uppercase tracking-wider", tone.tag)}>
                {data.tag}
              </div>
            ) : null}
            <div className="text-[13px] font-semibold leading-tight text-slate-100">
              {data.title}
            </div>
            {data.subtitle ? (
              <div className="mt-1 text-[11px] leading-snug text-slate-400">{data.subtitle}</div>
            ) : null}
          </div>
        </div>
      </div>
      <Handle id="top-s" type="source" position={Position.Top} />
      <Handle id="left-s" type="source" position={Position.Left} />
      <Handle id="bottom-s" type="source" position={Position.Bottom} />
      <Handle id="right-s" type="source" position={Position.Right} />
    </div>
  );
}
