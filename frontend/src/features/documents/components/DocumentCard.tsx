import { FileText } from "lucide-react";
import { IconTile } from "@/shared/ui/primitives";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { DocumentRecord } from "../data";

/** Grid-view tile for one document. */
export function DocumentCard({ record, onOpen }: { record: DocumentRecord; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-33.75 min-w-0 flex-col items-start rounded-md border border-border bg-card p-3.5 text-left transition duration-150 hover:-translate-y-px hover:border-primary-muted hover:shadow-card focus-visible:border-primary-accent focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none sm:min-h-36.25"
    >
      <IconTile size="sm" className="size-7.75">
        <FileText size="1.25rem" />
      </IconTile>
      <span className="mt-3.5 max-w-full truncate text-sm font-semibold text-foreground">{record.name}</span>
      <span className="mt-1 mb-3 max-w-full truncate text-2xs text-subtle-foreground">
        {record.category} · {record.type}
      </span>
      <StatusBadge status={record.status} />
    </button>
  );
}
