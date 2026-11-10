"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/primitives";
import { FormModal } from "@/shared/ui/FormModal";
import { DialogFooter } from "@/shared/ui/dialog";
import { AffixInput, Field, FormGrid, FormRow, FormSelect, Input, Textarea } from "@/shared/ui/form";
import type { NewLoan } from "../api";
import { loanTypes } from "../data";

const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const required = ["name", "lender", "type", "original", "outstanding", "rate", "emi", "start", "end", "due"] as const;

export function AddLoanModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (loan: NewLoan) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({
    name: "",
    lender: "",
    type: "",
    original: "",
    outstanding: "",
    rate: "",
    emi: "",
    start: "",
    end: "",
    due: "",
    notes: "",
  });

  const set = (key: keyof typeof values, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const invalid = (key: keyof typeof values) => submitted && !values[key];
  const incomplete = submitted && required.some((key) => !values[key]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (required.some((key) => !values[key])) return;
    onSave({
      name: values.name,
      lender: values.lender,
      type: values.type,
      original: Number(values.original),
      outstanding: Number(values.outstanding),
      rate: Number(values.rate),
      emi: Number(values.emi),
      due: formatDate(values.due),
      start: formatDate(values.start),
      end: formatDate(values.end),
      notes: values.notes || "No notes added.",
    });
  };

  return (
    <FormModal
      title="Add loan"
      subtitle="Add a loan to track balances and repayments."
      onSubmit={submit}
      onClose={onClose}
    >
      <FormGrid>
        <FormRow>
          <Field label="Loan name" required error={invalid("name") && "Enter a loan name."}>
            <Input
              invalid={invalid("name")}
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="e.g. Home Loan"
            />
          </Field>
          <Field label="Lender" required error={invalid("lender") && "Enter a lender."}>
            <Input
              invalid={invalid("lender")}
              value={values.lender}
              onChange={(event) => set("lender", event.target.value)}
              placeholder="e.g. HDFC Bank"
            />
          </Field>
        </FormRow>
        <Field label="Loan type" required error={invalid("type") && "Select a loan type."}>
          <FormSelect invalid={invalid("type")} value={values.type} onChange={(event) => set("type", event.target.value)}>
            <option value="">Select loan type</option>
            {loanTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FormSelect>
        </Field>
        <FormRow>
          <Field label="Original principal" required>
            <AffixInput
              prefix="₹"
              type="number"
              min="1"
              inputMode="decimal"
              invalid={invalid("original")}
              value={values.original}
              onChange={(event) => set("original", event.target.value)}
              placeholder="0"
            />
          </Field>
          <Field label="Outstanding principal" required>
            <AffixInput
              prefix="₹"
              type="number"
              min="0"
              inputMode="decimal"
              invalid={invalid("outstanding")}
              value={values.outstanding}
              onChange={(event) => set("outstanding", event.target.value)}
              placeholder="0"
            />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Annual interest rate" required>
            <AffixInput
              suffix="%"
              type="number"
              step=".1"
              min="0"
              inputMode="decimal"
              invalid={invalid("rate")}
              value={values.rate}
              onChange={(event) => set("rate", event.target.value)}
              placeholder="0.0"
            />
          </Field>
          <Field label="Monthly EMI" required>
            <AffixInput
              prefix="₹"
              type="number"
              min="1"
              inputMode="decimal"
              invalid={invalid("emi")}
              value={values.emi}
              onChange={(event) => set("emi", event.target.value)}
              placeholder="0"
            />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Loan start date" required>
            <Input invalid={invalid("start")} type="date" value={values.start} onChange={(event) => set("start", event.target.value)} />
          </Field>
          <Field label="Loan end date" required>
            <Input invalid={invalid("end")} type="date" value={values.end} onChange={(event) => set("end", event.target.value)} />
          </Field>
        </FormRow>
        <Field label="Next due date" required error={incomplete && "Complete all required fields before saving."}>
          <Input invalid={invalid("due")} type="date" value={values.due} onChange={(event) => set("due", event.target.value)} />
        </Field>
        <Field label="Notes" optional>
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
        <Button type="submit">Save loan</Button>
      </DialogFooter>
    </FormModal>
  );
}
