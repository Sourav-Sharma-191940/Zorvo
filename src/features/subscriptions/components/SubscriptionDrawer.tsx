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
import { Badge, Button, Overline } from "@/shared/ui/primitives";
import { DetailsDrawer, type DetailItem } from "@/shared/ui/DetailsDrawer";
import { StatusBadge } from "@/shared/ui/StatusBadge";
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
        <span className="inline-flex items-center gap-1.25 text-primary">
          {item.website}
          <ExternalLink size="0.75rem" />
        </span>
      ),
    });
  }

  return (
    <DetailsDrawer
      label={`${item.name} details`}
      icon={<ServiceLogo item={item} large />}
      title={item.name}
      subtitle={item.plan}
      badges={
        <>
          <Badge tone="slate" shape="rounded">{item.category}</Badge>
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
          <Button variant="danger-ghost" onClick={onCancel}>
            <X size="0.9375rem" />
            Cancel subscription
          </Button>
          <Button variant="danger-ghost" onClick={onDelete}>
            <Trash2 size="0.9375rem" />
            Delete
          </Button>
        </>
      }
    >
      <div className="mt-4.5 flex flex-col gap-1.5 rounded-md bg-muted p-3.75">
        <Overline>Current subscription</Overline>
        <strong className="text-4xl tracking-tight">
          {formatCurrency(item.amount)}{" "}
          <small className="text-sm font-medium tracking-normal text-subtle-foreground">
            / {item.frequency.toLowerCase()}
          </small>
        </strong>
        <div className="flex items-center gap-1.75 text-2xs text-muted-foreground">
          <CalendarClock size="0.9375rem" />
          <span>
            Renews on <b className="text-foreground">{item.renewal}</b>
          </span>
        </div>
      </div>
    </DetailsDrawer>
  );
}
