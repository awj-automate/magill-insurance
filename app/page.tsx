import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { cn } from "@/lib/cn";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 pt-6">
        <Image
          src="/logo.png"
          alt="Magill Livestock Insurance"
          width={200}
          height={56}
          priority
          className="h-12 w-auto"
        />
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <LayoutDashboard className="h-4 w-4" />
          View dashboard demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Hero + diagram */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          High level system flow
        </h1>

        <div className="mt-8">
          <ArchitectureDiagram />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6 text-3xl font-semibold text-slate-800">
          <Legend dot="bg-sky-500" label="Intake" />
          <Legend dot="bg-blue-600" label="Data from Airtable" />
          <Legend dot="bg-cyan-500" label="UI / dashboard reads" />
          <Legend dot="bg-rose-500" label="Action" />
        </div>
      </section>
    </main>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className={cn("h-5 w-5 flex-none rounded-full", dot)} />
      <span>{label}</span>
    </div>
  );
}
