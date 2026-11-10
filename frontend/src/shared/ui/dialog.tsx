"use client";

import type { ComponentProps, ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./primitives";

/**
 * Low-level dialog building blocks (Radix): focus is trapped inside, Escape and
 * outside-click close it, page scroll is locked, and it's announced to screen
 * readers. Prefer the higher-level FormModal / DetailsDrawer / ConfirmDialog.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;

const overlayClass =
  "fixed inset-0 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0";

export const dialogSizes = {
  sm: "sm:max-w-145",
  md: "sm:max-w-160",
  lg: "sm:max-w-232.5",
} as const;

/** Centred panel on tablets/desktops; bottom sheet on phones. */
export function DialogContent({
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { size?: keyof typeof dialogSizes }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={cn(overlayClass, "z-(--z-modal) bg-overlay")} />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-(--z-modal) max-h-[calc(100dvh-0.75rem)] w-full overflow-y-auto rounded-t-xl border border-border bg-popover p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-popover-foreground shadow-modal outline-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4",
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-3rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:p-5 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-2",
          dialogSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Right-hand side panel; full width on phones. */
export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={cn(overlayClass, "z-(--z-drawer) bg-overlay-soft")} />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-(--z-drawer) h-full w-full overflow-y-auto border-l border-border bg-card p-4.5 text-card-foreground shadow-drawer outline-none sm:max-w-105 sm:p-5.5",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-5",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Standard modal header: title, optional subtitle, close button. */
export function DialogHeader({ title, subtitle }: { title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        {subtitle ? (
          <DialogDescription className="mt-0.75 text-xs text-subtle-foreground">{subtitle}</DialogDescription>
        ) : null}
      </div>
      <DialogClose asChild>
        <Button variant="icon" ariaLabel="Close dialog">
          <X size="1.125rem" />
        </Button>
      </DialogClose>
    </div>
  );
}

/** Button row at the bottom of a modal. */
export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-4.5 flex justify-end gap-2 border-t border-border pt-3.5", className)}>
      {children}
    </div>
  );
}
