"use client";

import { Download, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { DetailsDrawer } from "@/components/ui/DetailsDrawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
        <span className="drawer-icon">
          <FileText size="1.5rem" />
        </span>
      }
      title={record.name}
      badges={
        <>
          <span className="badge badge-indigo">{record.category}</span>
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
          <Button variant="ghost" className="danger-text" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete
          </Button>
        </>
      }
    >
      <div className="drawer-preview">
        <FileText size="2.625rem" />
        <strong>{record.type} document</strong>
        <small>Secure preview is available</small>
        <Button variant="secondary">
          <Eye size="0.9375rem" />
          Preview file
        </Button>
      </div>
    </DetailsDrawer>
  );
}
