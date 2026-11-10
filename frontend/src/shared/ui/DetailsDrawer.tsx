"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./primitives";
import { Dialog, DialogClose, DialogTitle, SheetContent } from "./dialog";

export interface DetailItem {
  label: string;
  value: ReactNode;
}

/** Small uppercase heading for a drawer/section block. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5.5 mb-2.25 text-xs font-bold tracking-wider text-foreground uppercase">
      {children}
    </div>
  );
}

/**
 * Right-hand details drawer shared by every feature. Renders the common frame
 * (header, title, badges, details list, notes, actions); features pass their
 * unique panel as `children` (after the badges) and extras as `footer` (after
 * the details list). Mount to open, unmount to close.
 */
export function DetailsDrawer({
  label,
  icon,
  title,
  subtitle,
  badges,
  detailsTitle,
  details,
  notes,
  actions,
  stackedActions = false,
  className,
  onClose,
  children,
  footer,
}: {
  /** Accessible dialog label, e.g. "Netflix details". */
  label: string;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  detailsTitle?: string;
  details?: DetailItem[];
  notes?: string;
  actions?: ReactNode;
  /** Full-width vertical action buttons instead of an inline row. */
  stackedActions?: boolean;
  className?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <SheetContent aria-label={label} aria-describedby={undefined} className={className}>
        <div className="flex items-center justify-between">
          {icon}
          <DialogClose asChild>
            <Button variant="icon" ariaLabel="Close details">
              <X size="1.125rem" />
            </Button>
          </DialogClose>
        </div>
        <DialogTitle className="mt-4.5">{title}</DialogTitle>
        {subtitle && <div className="mt-1.25 text-sm text-muted-foreground">{subtitle}</div>}
        {badges && <div className="mt-2.25 flex flex-wrap gap-1.5">{badges}</div>}
        {children}
        {details && details.length > 0 && (
          <>
            {detailsTitle && <SectionLabel>{detailsTitle}</SectionLabel>}
            <dl className="border-t border-border">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-10.75 items-center justify-between gap-5 border-b border-border text-xs"
                >
                  <dt className="text-subtle-foreground">{item.label}</dt>
                  <dd className="text-right font-semibold text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        {footer}
        {notes !== undefined && (
          <>
            <SectionLabel>Notes</SectionLabel>
            <p className="rounded-sm bg-muted p-3 text-xs leading-4 text-muted-foreground">{notes}</p>
          </>
        )}
        {actions && (
          <div className={cn("mt-5.5 flex flex-wrap gap-2", stackedActions && "flex-col *:w-full")}>
            {actions}
          </div>
        )}
      </SheetContent>
    </Dialog>
  );
}
