"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./primitives";

export interface DetailItem {
  label: string;
  value: ReactNode;
}

/**
 * Right-hand details drawer shared by every feature. Renders the common frame
 * (backdrop, header, title, badges, details list, notes, actions); features
 * pass their unique panel as `children`, which renders between the badges and
 * the details list.
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
  className = "",
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
  /** Extra content rendered after the details list (before notes). */
  footer?: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className={`details-drawer ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          {icon}
          <Button variant="icon" onClick={onClose} ariaLabel="Close details">
            <X size="1.125rem" />
          </Button>
        </div>
        <div className="drawer-title">{title}</div>
        {subtitle && <div className="drawer-subtitle">{subtitle}</div>}
        {badges && <div className="drawer-title-row">{badges}</div>}
        {children}
        {details && details.length > 0 && (
          <>
            {detailsTitle && <div className="details-section-title">{detailsTitle}</div>}
            <dl className="details-list">
              {details.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        {footer}
        {notes !== undefined && (
          <>
            <div className="details-section-title">Notes</div>
            <p className="drawer-notes">{notes}</p>
          </>
        )}
        {actions && (
          <div className={`drawer-actions ${stackedActions ? "stacked" : ""}`.trim()}>
            {actions}
          </div>
        )}
      </aside>
    </div>
  );
}
