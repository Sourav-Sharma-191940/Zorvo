import { ChevronDown, ShieldCheck } from "lucide-react";
import { Badge, IconTile, type Tone } from "@/shared/ui/primitives";

/** Clickable row in the "Expiring documents" panel. */
export function ExpiryItem({
  tone,
  title,
  meta,
  badge,
  onOpen,
}: {
  tone: Tone;
  title: string;
  meta: string;
  badge: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid min-h-14.25 min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-md border border-border bg-muted px-2.5 py-2 text-left text-subtle-foreground transition hover:border-border-strong hover:bg-card focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none sm:grid-cols-[auto_minmax(0,1fr)_auto_auto]"
    >
      <IconTile tone={tone} size="sm" className="size-8.5">
        <ShieldCheck size="1.125rem" />
      </IconTile>
      <span className="flex min-w-0 flex-col gap-0.75">
        <strong className="truncate text-xs text-foreground">{title}</strong>
        <small className="truncate text-2xs text-subtle-foreground">{meta}</small>
      </span>
      <Badge tone={tone} className="max-sm:hidden">
        {badge}
      </Badge>
      <ChevronDown size="1rem" />
    </button>
  );
}
