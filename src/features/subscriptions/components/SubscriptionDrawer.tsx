"use client";

import {
  CalendarClock,
  Check,
  CirclePause,
  CirclePlay,
  ExternalLink,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { DetailsDrawer, type DetailItem } from "@/components/ui/DetailsDrawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, type Subscription } from "../data";
import { ServiceLogo } from "./ServiceLogo";

export function SubscriptionDrawer({
  item,
  onClose,
  onEdit,
  onPaid,
  onTogglePause,
  onCancel,
  onDelete,
}: {
  item: Subscription;
  onClose: () => void;
  onEdit: () => void;
  onPaid: () => void;
  onTogglePause: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const paused = item.status === "Paused";
  const details: DetailItem[] = [
    { label: "Start date", value: item.start },
    { label: "Payment method", value: item.payment },
    { label: "Payment account", value: item.account },
    { label: "Reminder", value: item.reminder ? item.reminderTiming : "Off" },
  ];
  if (item.website) {
    details.push({
      label: "Website",
      value: (
        <span className="website-value">
          {item.website}
          <ExternalLink size="0.75rem" />
        </span>
      ),
    });
  }

  return (
    <DetailsDrawer
      label={`${item.name} details`}
      className="subscription-drawer"
      icon={<ServiceLogo item={item} />}
      title={item.name}
      subtitle={item.plan}
      badges={
        <>
          <span className="badge badge-slate">{item.category}</span>
          <StatusBadge status={item.status} />
        </>
      }
      detailsTitle="Subscription information"
      details={details}
      notes={item.notes}
      onClose={onClose}
      stackedActions
      actions={
        <>
          <Button onClick={onPaid}>
            <Check size="0.9375rem" />
            Mark payment as paid
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            <Pencil size="0.9375rem" />
            Edit subscription
          </Button>
          <Button variant="secondary" onClick={onTogglePause}>
            {paused ? <CirclePlay size="0.9375rem" /> : <CirclePause size="0.9375rem" />}
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="ghost" className="danger-text" onClick={onCancel}>
            <X size="0.9375rem" />
            Cancel subscription
          </Button>
          <Button variant="ghost" className="danger-text" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete
          </Button>
        </>
      }
    >
      <div className="subscription-price-panel">
        <span>Current subscription</span>
        <strong>
          {formatCurrency(item.amount)} <small>/ {item.frequency.toLowerCase()}</small>
        </strong>
        <div>
          <CalendarClock size="0.9375rem" />
          <span>
            Renews on <b>{item.renewal}</b>
          </span>
        </div>
      </div>
    </DetailsDrawer>
  );
}
