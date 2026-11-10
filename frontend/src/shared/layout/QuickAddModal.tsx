"use client";

import { Clock3, CreditCard, FileText, ReceiptText, type LucideIcon } from "lucide-react";
import { IconTile } from "@/shared/ui/primitives";
import { Dialog, DialogContent, DialogHeader } from "@/shared/ui/dialog";

const quickAddItems: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ReceiptText, title: "Expense", text: "Record a new purchase" },
  { icon: CreditCard, title: "Payment", text: "Schedule an upcoming bill" },
  { icon: FileText, title: "Document", text: "Upload and organize a file" },
  { icon: Clock3, title: "Reminder", text: "Never miss an important date" },
];

export function QuickAddModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader title="Quick add" subtitle="What would you like to capture?" />
        <div className="grid grid-cols-1 gap-2.25 sm:grid-cols-2">
          {quickAddItems.map(({ icon: Icon, title, text }) => (
            <button
              type="button"
              key={title}
              className="flex items-center gap-2.75 rounded-lg border border-border bg-card p-3.25 text-left transition hover:-translate-y-px hover:border-primary-muted hover:bg-primary-soft"
            >
              <IconTile>
                <Icon size="1.1875rem" />
              </IconTile>
              <span className="flex flex-col gap-0.75">
                <strong className="text-sm">{title}</strong>
                <small className="text-2xs text-subtle-foreground">{text}</small>
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
