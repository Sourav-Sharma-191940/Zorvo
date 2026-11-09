"use client";

import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./primitives";

/** Destructive confirmation modal shared by every feature. */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  icon,
  onCancel,
  onConfirm,
}: {
  title: ReactNode;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <div className="confirm-dialog" role="alertdialog" aria-modal="true">
        <span className="confirm-icon">{icon ?? <Trash2 size="1.25rem" />}</span>
        <div className="confirm-title">{title}</div>
        <p>{description}</p>
        <div className="confirm-actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <button type="button" className="delete-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
