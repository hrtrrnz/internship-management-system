import type { LucideIcon } from "lucide-react";
import { Calendar, CheckCircle2, Circle, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EvaluationPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function EvaluationScheduleSection({
  aside,
  children,
}: {
  aside: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.04] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">{children}</div>
        {aside}
      </div>
    </section>
  );
}

export function ScheduleSectionLabel() {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <Calendar className="h-4 w-4 text-primary" aria-hidden />
      Schedule
    </div>
  );
}

export function ScheduleStatsGrid({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{children}</dl>;
}

export function ScheduleStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 font-medium text-foreground", icon && "flex items-center gap-2")}>
        {icon}
        {value}
      </dd>
    </div>
  );
}

export function PreEvalProgressAside({
  title,
  doneCount,
  total,
  allReady,
  messageReady,
  messagePending,
}: {
  title: string;
  doneCount: number;
  total: number;
  allReady: boolean;
  messageReady: string;
  messagePending: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[220px] flex-col justify-center rounded-xl border px-5 py-4 lg:max-w-xs lg:self-stretch",
        allReady ? "border-stat-green/25 bg-stat-green-bg/80" : "border-stat-orange/20 bg-stat-orange-bg/50"
      )}
    >
      <div className="flex items-center gap-2">
        <ClipboardCheck className={cn("h-5 w-5 shrink-0", allReady ? "text-stat-green" : "text-stat-orange")} aria-hidden />
        <p className="font-display text-sm font-bold text-foreground">{title}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tabular-nums text-foreground">
        {doneCount}
        <span className="text-lg font-semibold text-muted-foreground"> / {total}</span>
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{allReady ? messageReady : messagePending}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", allReady ? "bg-stat-green" : "bg-stat-orange")}
          style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}

export function EvaluationSectionHeader({
  icon: Icon,
  iconClassName,
  title,
  description,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-5 w-5", iconClassName)} aria-hidden />
        <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function CompletedWorkList({
  items,
}: {
  items: { id: string; title: string; detail: string; completedAt: string }[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <CompletedWorkRow key={item.id} {...item} />
      ))}
    </ul>
  );
}

export function CompletedWorkRow({
  title,
  detail,
  completedAt,
}: {
  title: string;
  detail: string;
  completedAt: string;
}) {
  return (
    <li className="rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stat-green-bg">
          <CheckCircle2 className="h-4 w-4 text-stat-green" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-display text-sm font-semibold leading-snug text-foreground">{title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
          <p className="text-[11px] font-medium text-muted-foreground/90">Completed · {completedAt}</p>
        </div>
      </div>
    </li>
  );
}

export type PrerequisiteItem = {
  id: string;
  title: string;
  detail: string;
  dueHint: string;
  done: boolean;
  /** When set, interns can open the shared Tasks modal for this board task from the checklist row. */
  linkedTaskId?: number;
};

export function BeforeEvaluationList({
  items,
  onSelectLinkedTask,
}: {
  items: PrerequisiteItem[];
  onSelectLinkedTask?: (taskId: number) => void;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <BeforeEvaluationRow key={item.id} {...item} onSelectLinkedTask={onSelectLinkedTask} />
      ))}
    </ul>
  );
}

export function BeforeEvaluationRow({
  title,
  detail,
  dueHint,
  done,
  linkedTaskId,
  onSelectLinkedTask,
}: PrerequisiteItem & { onSelectLinkedTask?: (taskId: number) => void }) {
  return (
    <li
      className={cn(
        "rounded-xl border p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]",
        done ? "border-stat-green/20 bg-stat-green-bg/40" : "border-border/80 bg-card"
      )}
    >
      <div className="flex gap-3">
        <div className="shrink-0 pt-0.5" aria-hidden>
          {done ? <CheckCircle2 className="h-5 w-5 text-stat-green" /> : <Circle className="h-5 w-5 text-muted-foreground/70" strokeWidth={2} />}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              "font-display text-sm font-semibold leading-snug",
              done ? "text-muted-foreground line-through decoration-muted-foreground/60" : "text-foreground"
            )}
          >
            {title}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
          <p className="text-[11px] font-medium text-muted-foreground/90">{dueHint}</p>
          {!done && linkedTaskId != null && onSelectLinkedTask ? (
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => onSelectLinkedTask(linkedTaskId)}>
              View related task
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function EvaluationTwoColumnGrid({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {left}
      {right}
    </div>
  );
}
