"use client";

import { Download, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { Badge, Button, IconTile } from "@/shared/ui/primitives";
import { DetailsDrawer } from "@/shared/ui/DetailsDrawer";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { DocumentRecord } from "../data";

export function DocumentDrawer({
  record,
  onClose,
  onDelete,
}: {
  record: DocumentRecord;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <DetailsDrawer
      label={`${record.name} details`}
      icon={
        <IconTile size="lg">
          <FileText size="1.5rem" />
        </IconTile>
      }
      title={record.name}
      badges={
        <>
          <Badge tone="indigo">{record.category}</Badge>
          <StatusBadge status={record.status} />
        </>
      }
      detailsTitle="Document information"
      details={[
        { label: "File", value: `${record.type} · ${record.size}` },
        { label: "Uploaded", value: record.added },
        { label: "Expiry date", value: record.expiry },
        {
          label: "Reminder",
          value: record.expiry === "Not Applicable" ? "Not enabled" : "30 days before expiry",
        },
      ]}
      notes={record.notes}
      onClose={onClose}
      actions={
        <>
          <Button>
            <Download size="1rem" />
            Download
          </Button>
          <Button variant="secondary">
            <Pencil size="0.9375rem" />
            Edit metadata
          </Button>
          <Button variant="danger-ghost" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete
          </Button>
        </>
      }
    >
      <div className="mt-5 flex min-h-44.5 flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-muted text-primary-accent">
        <FileText size="2.625rem" />
        <strong className="mt-2.25 text-sm text-foreground">{record.type} document</strong>
        <small className="mt-0.75 mb-2.75 text-2xs text-subtle-foreground">Secure preview is available</small>
        <Button variant="secondary">
          <Eye size="0.9375rem" />
          Preview file
        </Button>
      </div>
    </DetailsDrawer>
  );
}
