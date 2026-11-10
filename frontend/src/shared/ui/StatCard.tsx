import type { ReactNode } from "react";
import { TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card, IconTile, type Tone } from "./primitives";

/** Responsive row for StatCards: 1 column on small phones, 2 on phones/tablets, 4 from laptops. */
export function StatGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-2 xs:grid-cols-2 sm:gap-3 md:grid-cols-4", className)}>
      {children}
    </div>
  );
}

/** Compact KPI card used in the summary row of every management page. */
export function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: Tone;
  /** "good" highlights the detail line in green with a downward trend icon. */
  trend?: "good";
}) {
  return (
    <Card className="min-h-23.5 p-3 sm:min-h-28.75 sm:px-4 sm:py-3.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <IconTile tone={tone} size="sm">
          <Icon size="1.0625rem" />
        </IconTile>
        <span>{label}</span>
      </div>
      <strong className="mt-2 block text-3xl leading-6 font-bold tracking-tight sm:mt-2.5 sm:text-4xl">
        {value}
      </strong>
      <small
        className={cn(
          "mt-1.25 flex min-h-3.5 items-center gap-1 truncate text-2xs text-subtle-foreground",
          trend === "good" && "font-semibold text-success",
        )}
      >
        {trend === "good" && <TrendingDown size="0.8125rem" />}
        {detail}
      </small>
    </Card>
  );
}
