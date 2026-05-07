export type AppStatus = "new" | "review" | "flagged" | "approved" | "sent" | "bound";

export type Horse = {
  name: string;
  breed: string;
  age: number;
  value: number;
  conditions: string;
  flag: "ok" | "review";
};

export type AuditEntry = {
  ts: string;
  actor: string;
  event: string;
  level?: "info" | "warn" | "ok";
};

export type Application = {
  id: string;
  type: "New Business" | "Renewal" | "Change Form";
  submittedAt: string;
  insured: string;
  contact: string;
  email: string;
  phone: string;
  horses: number;
  premium: number;
  status: AppStatus;
  aiConfidence: number;
  flagCount: number;
  summary: string;
  conditions: string[];
  reclassNote?: string;
  horsesList?: Horse[];
  drafts: { email: string; sms: string };
  audit: AuditEntry[];
};

export const applications: Application[] = [
  {
    id: "M-2026-0481",
    type: "Renewal",
    submittedAt: "2026-05-06 14:22",
    insured: "Whitfield Equestrian LLC",
    contact: "Sarah Whitfield",
    email: "sarah@whitfieldeq.com",
    phone: "+1 (859) 555-0142",
    horses: 9,
    premium: 48200,
    status: "flagged",
    aiConfidence: 0.62,
    flagCount: 3,
    summary:
      "9-horse mortality + major medical renewal. Two horses with disclosed conditions need underwriter review and one valuation jumped >25% YoY.",
    conditions: [
      "Belmont (TB, 11): colic surgery Nov 2025 — recovery noted, returned to work Jan 2026",
      "Quicksilver (Warmblood, 8): suspensory ligament injury Feb 2026 — currently rehab, not in work",
      "Valuation: Quicksilver listed at $120k, prior bound value $88k (+36% YoY) — request supporting appraisal",
    ],
    reclassNote:
      "Auto-corrected: submitted as 'New Business' but matched bound policy MSE-9981 → reclassified to Renewal.",
    horsesList: [
      { name: "Belmont", breed: "Thoroughbred", age: 11, value: 85000, conditions: "Colic surgery (Nov 2025), back to work", flag: "review" },
      { name: "Quicksilver", breed: "Warmblood", age: 8, value: 120000, conditions: "Suspensory injury Feb 2026 — rehab", flag: "review" },
      { name: "Honeycomb", breed: "Quarter Horse", age: 14, value: 35000, conditions: "Clear", flag: "ok" },
      { name: "Mistral", breed: "Andalusian", age: 9, value: 68000, conditions: "Clear", flag: "ok" },
      { name: "Apollo", breed: "Hanoverian", age: 12, value: 95000, conditions: "Clear", flag: "ok" },
      { name: "Rosewood", breed: "Thoroughbred", age: 7, value: 72000, conditions: "Clear", flag: "ok" },
      { name: "Birch", breed: "Quarter Horse", age: 16, value: 22000, conditions: "Clear", flag: "ok" },
      { name: "Saffron", breed: "Warmblood", age: 6, value: 110000, conditions: "Clear", flag: "ok" },
      { name: "Tidepool", breed: "Paint", age: 10, value: 28000, conditions: "Clear", flag: "ok" },
    ],
    drafts: {
      email: `Subject: Whitfield Equestrian — 2026 Renewal · Underwriting Review

Hi Sarah,

We received the renewal submission for Whitfield Equestrian — thanks for getting it in early. Quick read on what we have so far:

• 9 horses on the schedule, 7 are clean and ready to bind at the same terms.
• Two need a brief UW review: Belmont (colic surgery November 2025) and Quicksilver (suspensory injury February 2026, currently in rehab).
• Quicksilver's valuation is up to $120k from $88k last year. To bind at the new value, we'll need a supporting appraisal or sale comp.

Could you grab a 10-minute call this week to walk through the two flagged horses? Otherwise everything looks routine.

— Mike`,
      sms: `Sarah — got your 2026 renewal. 7 of 9 ready to bind. Belmont + Quicksilver need a quick UW chat (vet history + valuation comp for Quicksilver). 10 min call this week? — Mike @ Magill`,
    },
    audit: [
      { ts: "2026-05-06 14:22:08", actor: "Webhook", event: "Submission received · payload validated", level: "info" },
      { ts: "2026-05-06 14:22:09", actor: "Rules engine", event: "Form-type misclass detected: submitted as 'New Business' → reclassified to 'Renewal' (matched bound policy MSE-9981)", level: "warn" },
      { ts: "2026-05-06 14:22:10", actor: "Multi-entity disambig", event: "Split 9 horse rows; parent app M-2026-0481", level: "info" },
      { ts: "2026-05-06 14:22:13", actor: "Rules engine", event: "Valuation rule fired: Quicksilver +36% YoY exceeds 25% threshold → flag for appraisal", level: "warn" },
      { ts: "2026-05-06 14:22:15", actor: "AI", event: "Condition summary generated · low confidence → routed to human review", level: "warn" },
      { ts: "2026-05-06 14:22:16", actor: "System", event: "Status set to 'Flagged · awaiting review'", level: "info" },
    ],
  },
  {
    id: "M-2026-0480",
    type: "New Business",
    submittedAt: "2026-05-06 11:08",
    insured: "Cedarbrook Stables",
    contact: "Daniel Cho",
    email: "dcho@cedarbrook.farm",
    phone: "+1 (606) 555-0193",
    horses: 1,
    premium: 4850,
    status: "approved",
    aiConfidence: 0.91,
    flagCount: 0,
    summary:
      "Single-horse mortality policy, clean disclosures, valuation backed by recent sale comp. Ready to bind pending owner sign-off on draft email.",
    conditions: [],
    horsesList: [
      { name: "Northstar", breed: "Thoroughbred", age: 5, value: 45000, conditions: "Clear · sale comp Jan 2026", flag: "ok" },
    ],
    drafts: {
      email: `Subject: Cedarbrook · Northstar Mortality — Quote Ready

Hi Daniel,

Quote attached for Northstar — $45k mortality, $4,850 annual premium, standard terms. Sale comp from January looks solid; nothing to flag on the vet history.

Reply with the signed app and we'll bind by EOD.

— Mike`,
      sms: `Daniel — Northstar quote ready. $4,850 annual, standard terms. Reply with signed app and we'll bind today. — Mike @ Magill`,
    },
    audit: [
      { ts: "2026-05-06 11:08:02", actor: "Webhook", event: "Submission received", level: "info" },
      { ts: "2026-05-06 11:08:03", actor: "Rules engine", event: "Classified: New Business · single entity", level: "info" },
      { ts: "2026-05-06 11:08:06", actor: "AI", event: "Condition summary · auto-approved", level: "ok" },
      { ts: "2026-05-06 11:08:06", actor: "AI", event: "Email + SMS draft generated", level: "info" },
      { ts: "2026-05-06 11:14:22", actor: "Mike (owner)", event: "Drafts approved", level: "ok" },
    ],
  },
  {
    id: "M-2026-0479",
    type: "Change Form",
    submittedAt: "2026-05-05 16:41",
    insured: "Wexler Performance Horses",
    contact: "Anna Wexler",
    email: "anna@wexlerperf.com",
    phone: "+1 (502) 555-0107",
    horses: 1,
    premium: 0,
    status: "sent",
    aiConfidence: 0.88,
    flagCount: 0,
    summary:
      "Mid-term endorsement adding $15k of medical coverage to 'Tempest'. Renewal-style change, no UW concerns. Email + SMS sent, awaiting client confirmation.",
    conditions: [],
    drafts: {
      email: `Subject: Wexler · Tempest endorsement confirmation\n\nHi Anna, the $15k medical endorsement to Tempest's policy is confirmed effective 2026-05-05. New annual premium $5,420 (prorated $87 due now). Confirm receipt and we're set. — Mike`,
      sms: `Anna — Tempest medical bump confirmed. $87 prorated, new annual $5,420. Confirm receipt please. — Mike`,
    },
    audit: [
      { ts: "2026-05-05 16:41:11", actor: "Webhook", event: "Submission received", level: "info" },
      { ts: "2026-05-05 16:41:12", actor: "Rules engine", event: "Classified: Change Form · endorsement type 'medical-add'", level: "info" },
      { ts: "2026-05-05 16:41:14", actor: "AI", event: "Drafts generated · auto-approve eligible", level: "ok" },
      { ts: "2026-05-05 16:48:09", actor: "CSR (Lauren)", event: "Drafts approved · sent", level: "ok" },
    ],
  },
  {
    id: "M-2026-0478",
    type: "New Business",
    submittedAt: "2026-05-05 09:14",
    insured: "Painted Sky Ranch",
    contact: "Marcus Bell",
    email: "marcus@paintedskyranch.com",
    phone: "+1 (307) 555-0144",
    horses: 4,
    premium: 18900,
    status: "review",
    aiConfidence: 0.78,
    flagCount: 1,
    summary:
      "4-horse new business app. One horse (Cinder) has a prior insurer non-renewal that wasn't disclosed in the 'prior coverage' section.",
    conditions: ["Cinder (QH, 13): prior carrier non-renewal 2024 not disclosed — request clarification before binding"],
    drafts: {
      email: `Subject: Painted Sky Ranch · Quick clarification needed\n\nHi Marcus, before we move forward — our records show Cinder had a prior carrier non-renewal in 2024. Could you confirm whether that was on this horse and share any context? Once cleared we can quote the full schedule. — Mike`,
      sms: `Marcus — quick Q before we quote: any context on Cinder's 2024 non-renewal with the prior carrier? Need that before binding. — Mike`,
    },
    audit: [
      { ts: "2026-05-05 09:14:03", actor: "Webhook", event: "Submission received", level: "info" },
      { ts: "2026-05-05 09:14:04", actor: "Rules engine", event: "Prior-coverage lookup: hit on Cinder (non-renewal 2024) · undisclosed", level: "warn" },
      { ts: "2026-05-05 09:14:08", actor: "AI", event: "Clarification email drafted", level: "info" },
    ],
  },
  {
    id: "M-2026-0477",
    type: "Renewal",
    submittedAt: "2026-05-04 17:55",
    insured: "Highbridge Polo Club",
    contact: "Eve Marston",
    email: "eve@highbridgepolo.com",
    phone: "+1 (914) 555-0188",
    horses: 14,
    premium: 92400,
    status: "review",
    aiConfidence: 0.71,
    flagCount: 2,
    summary:
      "14-horse polo string renewal. Two new horses on the schedule that weren't on prior bound policy — need confirmation they're additions, not replacements.",
    conditions: [
      "New on schedule: 'Inkwell' and 'Halftime' — confirm whether additions or replacements",
      "One horse from prior bound ('Tidewater') not on this submission — sold? deceased? request status",
    ],
    drafts: {
      email: `Subject: Highbridge · Renewal — quick reconciliation\n\nHi Eve, comparing this renewal to the bound 2025 schedule, we have two new horses (Inkwell, Halftime) and one missing (Tidewater). Could you confirm whether the new horses are additions or replacements, and the status of Tidewater? — Mike`,
      sms: `Eve — renewal reconciliation: 2 new (Inkwell, Halftime), 1 missing (Tidewater). Additions or replacements? Tidewater status? — Mike`,
    },
    audit: [
      { ts: "2026-05-04 17:55:21", actor: "Webhook", event: "Submission received", level: "info" },
      { ts: "2026-05-04 17:55:22", actor: "Multi-entity disambig", event: "Split 14 horse rows", level: "info" },
      { ts: "2026-05-04 17:55:24", actor: "Rules engine", event: "Schedule diff vs. MSE-8814: +2 added, -1 removed", level: "warn" },
      { ts: "2026-05-04 17:55:28", actor: "AI", event: "Renewal diff narrative generated", level: "info" },
    ],
  },
  {
    id: "M-2026-0476",
    type: "Change Form",
    submittedAt: "2026-05-04 12:30",
    insured: "Linden Hill Equine",
    contact: "Tom Linden",
    email: "tom@lindenhill.farm",
    phone: "+1 (859) 555-0211",
    horses: 1,
    premium: 0,
    status: "bound",
    aiConfidence: 0.96,
    flagCount: 0,
    summary: "Address change endorsement — handed off to AMS360 (system of record).",
    conditions: [],
    drafts: { email: "", sms: "" },
    audit: [
      { ts: "2026-05-04 12:30:05", actor: "Webhook", event: "Submission received", level: "info" },
      { ts: "2026-05-04 12:30:06", actor: "Rules engine", event: "Classified: Change Form · endorsement 'address-update'", level: "info" },
      { ts: "2026-05-04 12:33:11", actor: "CSR (Lauren)", event: "Approved · entered in AMS360 manually", level: "ok" },
    ],
  },
];
