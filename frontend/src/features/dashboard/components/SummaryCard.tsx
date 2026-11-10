import { Clock3, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Card, IconTile, type Tone } from "@/shared/ui/primitives";
import { cn } from "@/shared/lib/utils";

type Trend = "up" | "down" | "neutral";

const trendColor: Record<Trend, string> = {
  down: "text-success",
  up: "text-warning",
  neutral: "text-muted-foreground",
};

export function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  trend: Trend;
  tone: Tone;
}) {
  return (
    <Card className="flex min-h-30.5 flex-col items-start p-3.25 max-xs:min-h-29 sm:min-h-32 sm:px-4.5 sm:py-4">
      <div className="mb-2.25 flex w-full items-center gap-2.25 sm:mb-3">
        <IconTile tone={tone} className="size-7 rounded-sm sm:size-7.5">
          <Icon size="1.0625rem" strokeWidth={1.9} />
        </IconTile>
        <div className="truncate text-xs font-semibold text-muted-foreground sm:text-sm">{label}</div>
      </div>
      <div className="text-4xl leading-6.25 font-bold tracking-tight tabular-nums max-xs:text-3xl sm:leading-7">
        {value}
      </div>
      <div
        className={cn(
          "mt-2 flex items-center gap-1 text-3xs font-semibold whitespace-nowrap sm:text-2xs",
          trendColor[trend],
        )}
      >
        {trend === "up" && <TrendingUp size="0.875rem" />}
        {trend === "down" && <TrendingDown size="0.875rem" />}
        {trend === "neutral" && <Clock3 size="0.875rem" />}
        <span>{detail}</span>
      </div>
    </Card>
  );
}
