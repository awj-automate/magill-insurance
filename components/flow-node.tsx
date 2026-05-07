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

const tones: Record<ToneKey, { border: string; iconBg: string; iconColor: string; tag: string }> = {
  intake: {
    border: "border-sky-200",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    tag: "text-sky-600",
  },
  data: {
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    tag: "text-blue-600",
  },
  logic: {
    border: "border-teal-200",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    tag: "text-teal-600",
  },
  ai: {
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    tag: "text-amber-600",
  },
  ui: {
    border: "border-cyan-200",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    tag: "text-cyan-600",
  },
  action: {
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    tag: "text-rose-600",
  },
  compliance: {
    border: "border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    tag: "text-slate-600",
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
        "rounded-xl border bg-white shadow-soft",
        tone.border,
      )}
    >
      <Handle id="top-t" type="target" position={Position.Top} />
      <Handle id="left-t" type="target" position={Position.Left} />
      <Handle id="bottom-t" type="target" position={Position.Bottom} />
      <Handle id="right-t" type="target" position={Position.Right} />
      <div className="rounded-xl p-3">
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
            <div className="text-[13px] font-semibold leading-tight text-slate-900">
              {data.title}
            </div>
            {data.subtitle ? (
              <div className="mt-1 text-[11px] leading-snug text-slate-500">{data.subtitle}</div>
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
