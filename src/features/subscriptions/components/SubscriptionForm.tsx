"use client";

import { useState, type FormEvent } from "react";
import {} from "lucide-react";
import { Button } from "@/shared/ui/primitives";
import { FormModal } from "@/shared/ui/FormModal";
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
      <div className="form-grid">
        <label>
          <span>
            Subscription name <b>*</b>
          </span>
          <input
            className={invalid("name") ? "field-error" : ""}
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="e.g. Netflix"
          />
          {invalid("name") && <em>Enter a subscription name.</em>}
        </label>
        <div className="form-row">
          <label>
            <span>
              Category <b>*</b>
            </span>
            <select
              className={invalid("category") ? "field-error" : ""}
              value={values.category}
              onChange={(event) => set("category", event.target.value)}
            >
              <option value="">Select category</option>
              {subscriptionCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            <span>
              Plan name <small>Optional</small>
            </span>
            <input
              value={values.plan}
              onChange={(event) => set("plan", event.target.value)}
              placeholder="e.g. Premium"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Amount in INR <b>*</b>
            </span>
            <div className={`currency-input ${invalid("amount") ? "field-error" : ""}`.trim()}>
              <span>₹</span>
              <input
                type="number"
                min="1"
                value={values.amount}
                onChange={(event) => set("amount", event.target.value)}
                placeholder="0.00"
              />
            </div>
          </label>
          <label>
            <span>
              Billing frequency <b>*</b>
            </span>
            <select
              className={invalid("frequency") ? "field-error" : ""}
              value={values.frequency}
              onChange={(event) => set("frequency", event.target.value)}
            >
              <option value="">Select frequency</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Start date <b>*</b>
            </span>
            <input
              className={invalid("start") ? "field-error" : ""}
              type={values.start.includes("-") || !values.start ? "date" : "text"}
              value={values.start}
              onChange={(event) => set("start", event.target.value)}
            />
          </label>
          <label>
            <span>
              Next renewal date <b>*</b>
            </span>
            <input
              className={invalid("renewal") ? "field-error" : ""}
              type="date"
              value={values.renewal}
              onChange={(event) => set("renewal", event.target.value)}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Status <b>*</b>
            </span>
            <select value={values.status} onChange={(event) => set("status", event.target.value)}>
              <option>Active</option>
              <option>Trial</option>
              <option>Paused</option>
              <option>Cancelled</option>
              <option>Expiring soon</option>
            </select>
          </label>
          <label>
            <span>
              Payment method <small>Optional</small>
            </span>
            <select value={values.payment} onChange={(event) => set("payment", event.target.value)}>
              <option value="">Select method</option>
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Bank Transfer</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Payment account <small>Optional</small>
            </span>
            <select value={values.account} onChange={(event) => set("account", event.target.value)}>
              <option value="">Select account</option>
              <option>HDFC Regalia • 4821</option>
              <option>Axis Ace • 3390</option>
              <option>ICICI Debit • 1074</option>
              <option>Google Pay • sourav@okhdfcbank</option>
            </select>
          </label>
          <label>
            <span>
              Website or service URL <small>Optional</small>
            </span>
            <input
              value={values.website}
              onChange={(event) => set("website", event.target.value)}
              placeholder="service.com"
            />
          </label>
        </div>
        <div className="form-row">
          <label className="check-tile">
            <input
              type="checkbox"
              checked={values.reminder}
              onChange={(event) => set("reminder", event.target.checked)}
            />
            <span>
              <strong>Renewal reminder</strong>
              <small>Notify me before this payment renews.</small>
            </span>
          </label>
          <label>
            <span>Reminder timing</span>
            <select
              value={values.reminderTiming}
              disabled={!values.reminder}
              onChange={(event) => set("reminderTiming", event.target.value)}
            >
              <option>1 day before</option>
              <option>3 days before</option>
              <option>7 days before</option>
              <option>30 days before</option>
            </select>
          </label>
        </div>
        <label>
          <span>
            Notes <small>Optional</small>
          </span>
          <textarea
            rows={3}
            value={values.notes}
            onChange={(event) => set("notes", event.target.value)}
            placeholder="Add any helpful context..."
          />
          {submitted && required.some((key) => !values[key]) && (
            <em>Complete all required fields before saving.</em>
          )}
        </label>
      </div>
      <div className="form-modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{item ? "Save changes" : "Save subscription"}</Button>
      </div>
    </FormModal>
  );
}
