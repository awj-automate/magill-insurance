import { cn } from "@/lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-6 py-16 md:py-20", className)}>
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-[15px] leading-relaxed text-slate-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
