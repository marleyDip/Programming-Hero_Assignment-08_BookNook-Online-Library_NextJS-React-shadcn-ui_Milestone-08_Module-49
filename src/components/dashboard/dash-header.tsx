import type { LucideIcon } from "lucide-react";

export function DashHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-700/30">
          <Icon className="size-6" />
        </span>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}
