"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
  type NodeTypes,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { FlowNode, type FlowNodeData } from "./flow-node";

const nodeTypes: NodeTypes = { card: FlowNode };

type CardNode = Node<FlowNodeData, "card">;

const initialNodes: CardNode[] = [
  // Row 1 — Intake (spread out so edge labels are readable)
  {
    id: "client",
    type: "card",
    position: { x: 0, y: 40 },
    data: { title: "Client", subtitle: "Submits app, change, or renewal", icon: "users", tone: "intake", tag: "Source", width: 200 },
  },
  {
    id: "formstack",
    type: "card",
    position: { x: 320, y: 40 },
    data: { title: "Formstack", subtitle: "Structured fields + signed PDF", icon: "signature", tone: "intake", tag: "Form", width: 220 },
  },
  {
    id: "make",
    type: "card",
    position: { x: 660, y: 40 },
    data: { title: "Make.com", subtitle: "Webhook router + normalizer", icon: "network", tone: "intake", tag: "Orchestrator", width: 220 },
  },
  {
    id: "airtable",
    type: "card",
    position: { x: 1000, y: 40 },
    data: { title: "Airtable", subtitle: "System DB · structured records", icon: "database", tone: "data", tag: "System DB", width: 220 },
  },
  {
    id: "pdf",
    type: "card",
    position: { x: 1340, y: 40 },
    data: { title: "PDF Archive", subtitle: "Drive / R2 — compliance only", icon: "lock", tone: "compliance", tag: "Legal", width: 220 },
  },

  // Row 2 — Processing
  {
    id: "rules",
    type: "card",
    position: { x: 380, y: 260 },
    data: { title: "Rules Engine", subtitle: "Classifies new biz vs. endorsement, DB lookups", icon: "filter", tone: "logic", tag: "Deterministic", width: 240 },
  },
  {
    id: "ai",
    type: "card",
    position: { x: 760, y: 260 },
    data: { title: "Confidence-aware AI", subtitle: "Summaries, drafts, renewal diffs", icon: "bot", tone: "ai", tag: "AI", width: 260 },
  },
  {
    id: "multi",
    type: "card",
    position: { x: 1140, y: 260 },
    data: { title: "Multi-entity Disambig", subtitle: "Splits 7+ horse renewals cleanly", icon: "layers", tone: "logic", tag: "Per-horse", width: 260 },
  },

  // Row 3 — Dashboard layer
  {
    id: "users",
    type: "card",
    position: { x: 80, y: 480 },
    data: { title: "You + CSR", subtitle: "Two-seat shared visibility", icon: "users", tone: "ui", tag: "Operators", width: 200 },
  },
  {
    id: "dashboard",
    type: "card",
    position: { x: 640, y: 460 },
    data: { title: "Next.js Dashboard", subtitle: "Pipeline · review · approve · send", icon: "layout", tone: "ui", tag: "Front end", width: 320 },
  },
  {
    id: "audit",
    type: "card",
    position: { x: 1240, y: 480 },
    data: { title: "Audit Log", subtitle: "Every flag, decision, message logged", icon: "audit", tone: "compliance", tag: "Compliance", width: 240 },
  },

  // Row 4 — Action
  {
    id: "resend",
    type: "card",
    position: { x: 380, y: 700 },
    data: { title: "Resend", subtitle: "Email · template + AI body", icon: "mail", tone: "action", tag: "Email", width: 240 },
  },
  {
    id: "twilio",
    type: "card",
    position: { x: 760, y: 700 },
    data: { title: "Twilio / OpenPhone", subtitle: "SMS twin of every email", icon: "sms", tone: "action", tag: "SMS", width: 260 },
  },
  {
    id: "ams360",
    type: "card",
    position: { x: 1140, y: 700 },
    data: { title: "AMS360", subtitle: "Manual handoff (system of record)", icon: "shield", tone: "compliance", tag: "Handoff", width: 260 },
  },
];

const flow = "#0ea5e9";       // sky-500
const data = "#2563eb";       // blue-600
const ui = "#06b6d4";         // cyan-500
const action = "#f43f5e";     // rose-500
const compliance = "#94a3b8"; // slate-400

const edge = (
  id: string,
  source: string,
  target: string,
  opts: Partial<Edge> = {},
): Edge => ({
  id,
  source,
  target,
  type: "smoothstep",
  sourceHandle: "right-s",
  targetHandle: "left-t",
  animated: true,
  style: { stroke: flow, strokeWidth: 1.6 },
  ...opts,
});

const initialEdges: Edge[] = [
  // Intake row left→right
  edge("client-formstack", "client", "formstack"),
  edge("formstack-make", "formstack", "make", { label: "webhook" }),
  edge("make-airtable", "make", "airtable", { label: "structured fields" }),
  edge("airtable-pdf", "airtable", "pdf", {
    animated: false,
    style: { stroke: compliance, strokeDasharray: "4 4", strokeWidth: 1.4 },
    label: "PDF archive",
  }),

  // Airtable → processing (top to bottom)
  edge("airtable-rules", "airtable", "rules", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: data, strokeWidth: 1.6 },
    label: "classify",
  }),
  edge("airtable-ai", "airtable", "ai", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: data, strokeWidth: 1.6 },
    label: "summarize",
  }),
  edge("airtable-multi", "airtable", "multi", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: data, strokeWidth: 1.6 },
    label: "split",
  }),

  // Processing → dashboard
  edge("rules-dashboard", "rules", "dashboard", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: ui, strokeWidth: 1.6 },
  }),
  edge("ai-dashboard", "ai", "dashboard", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: ui, strokeWidth: 1.6 },
  }),
  edge("multi-dashboard", "multi", "dashboard", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: ui, strokeWidth: 1.6 },
  }),

  // Users <-> dashboard
  edge("users-dashboard", "users", "dashboard", {
    animated: false,
    style: { stroke: ui, strokeDasharray: "4 4", strokeWidth: 1.4 },
    label: "auth",
  }),

  // Dashboard → audit
  edge("dashboard-audit", "dashboard", "audit", {
    sourceHandle: "right-s",
    targetHandle: "left-t",
    animated: false,
    style: { stroke: compliance, strokeDasharray: "4 4", strokeWidth: 1.4 },
    label: "logs",
  }),

  // Dashboard → actions
  edge("dashboard-resend", "dashboard", "resend", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: action, strokeWidth: 1.6 },
    label: "draft → approve",
  }),
  edge("dashboard-twilio", "dashboard", "twilio", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    style: { stroke: action, strokeWidth: 1.6 },
    label: "draft → approve",
  }),
  edge("dashboard-ams360", "dashboard", "ams360", {
    sourceHandle: "bottom-s",
    targetHandle: "top-t",
    animated: false,
    style: { stroke: compliance, strokeDasharray: "4 4", strokeWidth: 1.4 },
    label: "manual handoff",
  }),
];

export function ArchitectureDiagram() {
  const [nodes, , onNodesChange] = useNodesState<CardNode>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(initialEdges);

  return (
    <div className="h-[680px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-soft">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.04 }}
        minZoom={0.2}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        defaultEdgeOptions={{
          labelStyle: { fill: "#334155", fontSize: 11, fontWeight: 500 },
          labelBgStyle: { fill: "#ffffff", fillOpacity: 0.95 },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 4,
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
          color="rgba(15,23,42,0.08)"
        />
        <Controls showInteractive={false} className="!bottom-4 !left-4" />
      </ReactFlow>
    </div>
  );
}
