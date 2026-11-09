"use client";

import { useEffect, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./primitives";

/**
 * Centered modal shell shared by every add/edit/view dialog: backdrop, panel,
 * title + subtitle header with a close button, and Escape-to-close. When
 * `onSubmit` is provided the panel is a <form>, so a `type="submit"` button in
 * the footer submits it. Put fields in `.form-grid` and buttons in
 * `.form-modal-footer`.
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
  size?: "sm" | "md" | "lg";
  onClose: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const panelProps = {
    className: `form-modal form-modal-${size}`,
    role: "dialog",
    "aria-modal": true,
    "aria-label": label ?? title,
    onMouseDown: (event: MouseEvent) => event.stopPropagation(),
  } as const;

  const content = (
    <>
      <div className="form-modal-header">
        <div>
          <div className="modal-title">{title}</div>
          {subtitle && <div className="section-subtitle">{subtitle}</div>}
        </div>
        <Button variant="icon" onClick={onClose} ariaLabel="Close dialog">
          <X size="1.125rem" />
        </Button>
      </div>
      {children}
    </>
  );

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      {onSubmit ? (
        <form {...panelProps} onSubmit={onSubmit}>
          {content}
        </form>
      ) : (
        <div {...panelProps}>{content}</div>
      )}
    </div>
  );
}
