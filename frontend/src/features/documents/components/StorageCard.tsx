import { HardDrive } from "lucide-react";
import { Card } from "@/shared/ui/primitives";
import { Progress } from "@/shared/ui/Progress";

/** Storage usage summary: icon, "x of y used" and a progress bar. */
export function StorageCard({ usedLabel, totalLabel, percent }: { usedLabel: string; totalLabel: string; percent: number }) {
  return (
    <Card className="flex min-h-13.5 items-center gap-3 px-3 py-2.5 sm:min-h-14.5 sm:px-3.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-primary-soft text-primary">
        <HardDrive size="1.125rem" />
      </span>
      <div className="grid min-w-0 flex-1 gap-1.75 text-xs text-muted-foreground">
        <div>
          <strong className="text-sm text-foreground">{usedLabel}</strong> of {totalLabel} used
        </div>
        <Progress value={percent} label="Storage used" />
      </div>
      <span className="text-xs font-semibold text-muted-foreground max-sm:hidden">{percent}% used</span>
    </Card>
  );
}
