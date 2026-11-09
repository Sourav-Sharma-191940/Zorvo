"use client";

import { useEffect, useRef } from "react";
import { Clock3, CreditCard, FileText, ReceiptText, X, type LucideIcon } from "lucide-react";

const quickAddItems: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ReceiptText, title: "Expense", text: "Record a new purchase" },
  { icon: CreditCard, title: "Payment", text: "Schedule an upcoming bill" },
  { icon: FileText, title: "Document", text: "Upload and organize a file" },
  { icon: Clock3, title: "Reminder", text: "Never miss an important date" },
];

export function QuickAddModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title" id="quick-add-title">
              Quick add
            </div>
            <div className="section-subtitle">What would you like to capture?</div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="button button-icon"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size="1.1875rem" />
          </button>
        </div>
        <div className="quick-grid">
          {quickAddItems.map(({ icon: Icon, title, text }) => (
            <button type="button" className="quick-item" key={title}>
              <span className="icon-tile icon-indigo">
                <Icon size="1.1875rem" />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
