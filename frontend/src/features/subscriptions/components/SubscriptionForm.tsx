"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/primitives";
import { FormModal } from "@/shared/ui/FormModal";
import { DialogFooter } from "@/shared/ui/dialog";
import {
  AffixInput,
  CheckTile,
  Field,
  FormGrid,
  FormRow,
  FormSelect,
  Input,
  Textarea,
} from "@/shared/ui/form";
import {
  subscriptionCategories,
  type BillingFrequency,
  type Subscription,
  type SubscriptionStatus,
} from "../data";

export function SubscriptionForm({
  item,
  onClose,
  onSave,
}: {
  item?: Subscription;
  onClose: () => void;
  onSave: (item: Subscription) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({
    name: item?.name || "",
    category: item?.category || "",
    amount: item ? String(item.amount) : "",
    frequency: item?.frequency || "",
    start: item?.start ? item.start : "",
    renewal: item?.renewalISO || "",
    status: item?.status || "Active",
    plan: item?.plan || "",
    payment: item?.payment || "",
    account: item?.account || "",
    website: item?.website || "",
    reminder: item?.reminder ?? true,
    reminderTiming: item?.reminderTiming || "3 days before",
    notes: item?.notes || "",
  });

  const set = (key: keyof typeof values, value: string | boolean) =>
    setValues((current) => ({ ...current, [key]: value }));

  const required = [
    "name",
    "category",
    "amount",
    "frequency",
    "start",
    "renewal",
    "status",
  ] as const;
  const invalid = (key: (typeof required)[number]) => submitted && !values[key];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (required.some((key) => !values[key])) return;
    const parsedDate = new Date(`${values.renewal}T12:00:00`);
    onSave({
      id: item?.id || Date.now(),
      name: values.name,
      initials: values.name.slice(0, 2).toUpperCase(),
      brand: item?.brand || "generic",
      category: values.category,
      plan: values.plan || "Standard",
      amount: Number(values.amount),
      frequency: values.frequency as BillingFrequency,
      renewal: parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      renewalISO: values.renewal,
      start: values.start.includes("-")
        ? new Date(`${values.start}T12:00:00`).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : values.start,
      status: values.status as SubscriptionStatus,
      payment: values.payment || "Other",
      account: values.account || "Not specified",
      website: values.website,
      reminder: values.reminder,
      reminderTiming: values.reminderTiming,
      notes: values.notes || "No notes added.",
    });
  };

  return (
    <FormModal
      title={item ? "Edit subscription" : "Add subscription"}
      subtitle={
        item
          ? "Update this recurring payment and renewal details."
          : "Track a recurring payment and its next renewal."
      }
      onSubmit={submit}
      onClose={onClose}
    >
      <FormGrid>
        <Field label="Subscription name" required error={invalid("name") && "Enter a subscription name."}>
          <Input
            invalid={invalid("name")}
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="e.g. Netflix"
          />
        </Field>
        <FormRow>
          <Field label="Category" required>
            <FormSelect
              invalid={invalid("category")}
              value={values.category}
              onChange={(event) => set("category", event.target.value)}
            >
              <option value="">Select category</option>
              {subscriptionCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Plan name" optional>
            <Input
              value={values.plan}
              onChange={(event) => set("plan", event.target.value)}
              placeholder="e.g. Premium"
            />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Amount in INR" required>
            <AffixInput
              prefix="₹"
              type="number"
              min="1"
              invalid={invalid("amount")}
              value={values.amount}
              onChange={(event) => set("amount", event.target.value)}
              placeholder="0.00"
            />
          </Field>
          <Field label="Billing frequency" required>
            <FormSelect
              invalid={invalid("frequency")}
              value={values.frequency}
              onChange={(event) => set("frequency", event.target.value)}
            >
              <option value="">Select frequency</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </FormSelect>
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Start date" required>
            <Input
              invalid={invalid("start")}
              type={values.start.includes("-") || !values.start ? "date" : "text"}
              value={values.start}
              onChange={(event) => set("start", event.target.value)}
            />
          </Field>
          <Field label="Next renewal date" required>
            <Input
              invalid={invalid("renewal")}
              type="date"
              value={values.renewal}
              onChange={(event) => set("renewal", event.target.value)}
            />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Status" required>
            <FormSelect value={values.status} onChange={(event) => set("status", event.target.value)}>
              <option>Active</option>
              <option>Trial</option>
              <option>Paused</option>
              <option>Cancelled</option>
              <option>Expiring soon</option>
            </FormSelect>
          </Field>
          <Field label="Payment method" optional>
            <FormSelect value={values.payment} onChange={(event) => set("payment", event.target.value)}>
              <option value="">Select method</option>
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Bank Transfer</option>
              <option>Other</option>
            </FormSelect>
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Payment account" optional>
            <FormSelect value={values.account} onChange={(event) => set("account", event.target.value)}>
              <option value="">Select account</option>
              <option>HDFC Regalia • 4821</option>
              <option>Axis Ace • 3390</option>
              <option>ICICI Debit • 1074</option>
              <option>Google Pay • sourav@okhdfcbank</option>
            </FormSelect>
          </Field>
          <Field label="Website or service URL" optional>
            <Input
              value={values.website}
              onChange={(event) => set("website", event.target.value)}
              placeholder="service.com"
            />
          </Field>
        </FormRow>
        <FormRow>
          <CheckTile
            title="Renewal reminder"
            description="Notify me before this payment renews."
            checked={values.reminder}
            onChange={(checked) => set("reminder", checked)}
          />
          <Field label="Reminder timing">
            <FormSelect
              value={values.reminderTiming}
              disabled={!values.reminder}
              onChange={(event) => set("reminderTiming", event.target.value)}
            >
              <option>1 day before</option>
              <option>3 days before</option>
              <option>7 days before</option>
              <option>30 days before</option>
            </FormSelect>
          </Field>
        </FormRow>
        <Field
          label="Notes"
          optional
          error={submitted && required.some((key) => !values[key]) && "Complete all required fields before saving."}
        >
          <Textarea
            value={values.notes}
            onChange={(event) => set("notes", event.target.value)}
            placeholder="Add any helpful context..."
          />
        </Field>
      </FormGrid>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{item ? "Save changes" : "Save subscription"}</Button>
      </DialogFooter>
    </FormModal>
  );
}
