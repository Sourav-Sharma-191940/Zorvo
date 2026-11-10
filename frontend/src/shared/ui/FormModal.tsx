"use client";

import type { FormEvent, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, type dialogSizes } from "./dialog";

/**
 * Modal shell for every add/edit/view dialog. Mount it when it should be open
 * and unmount to close (`{open && <FormModal … />}`). When `onSubmit` is given
 * the body is a <form>, so a `type="submit"` button submits it. Build the body
 * with FormGrid/Field (ui/form) and end with <DialogFooter>.
 */
export function FormModal({
  title,
  subtitle,
  label,
  size = "md",
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  /** Accessible dialog label; defaults to the title. */
  label?: string;
  size?: keyof typeof dialogSizes;
  onClose: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        size={size}
        aria-label={label}
        // Without a subtitle there is no description; tell Radix so it doesn't warn.
        {...(subtitle ? {} : { "aria-describedby": undefined })}
      >
        <DialogHeader title={title} subtitle={subtitle} />
        {onSubmit ? <form onSubmit={onSubmit}>{children}</form> : children}
      </DialogContent>
    </Dialog>
  );
}
