"use client";

import type { ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";
import { Button, IconTile } from "./primitives";

/**
 * Confirmation for destructive actions (Radix AlertDialog): focus starts on
 * Cancel, Escape cancels, and clicking outside does nothing, so a delete can't
 * be confirmed by accident.
 */
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
    <AlertDialog.Root open onOpenChange={(open) => !open && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-(--z-modal) bg-overlay backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-(--z-modal) w-[calc(100%-1.5rem)] max-w-100 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-5.5 text-popover-foreground shadow-modal outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <IconTile tone="rose" className="size-10">
            {icon ?? <Trash2 size="1.25rem" />}
          </IconTile>
          <AlertDialog.Title className="mt-3.75 text-xl font-bold">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-1.5 mb-5 text-xs leading-4 text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </AlertDialog.Cancel>
            {/* Not AlertDialog.Action: that also closes the dialog, which would
                fire onCancel after onConfirm. The page unmounts it instead. */}
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
