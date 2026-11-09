"use client";

import { useState, type FormEvent } from "react";
import {} from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { FormModal } from "@/components/ui/FormModal";
import type { NewLoan } from "../api";
import { loanTypes } from "../data";

const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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

  const required = [
    "name",
    "lender",
    "type",
    "original",
    "outstanding",
    "rate",
    "emi",
    "start",
    "end",
    "due",
  ] as const;

  const set = (key: keyof typeof values, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

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

  const invalid = (key: keyof typeof values) => submitted && !values[key];

  return (
    <FormModal
      title="Add loan"
      subtitle="Add a loan to track balances and repayments."
      onSubmit={submit}
      onClose={onClose}
    >
      <div className="form-grid">
        <div className="form-row">
          <label>
            <span>
              Loan name <b>*</b>
            </span>
            <input
              className={invalid("name") ? "field-error" : ""}
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="e.g. Home Loan"
            />
            {invalid("name") && <em>Enter a loan name.</em>}
          </label>
          <label>
            <span>
              Lender <b>*</b>
            </span>
            <input
              className={invalid("lender") ? "field-error" : ""}
              value={values.lender}
              onChange={(event) => set("lender", event.target.value)}
              placeholder="e.g. HDFC Bank"
            />
            {invalid("lender") && <em>Enter a lender.</em>}
          </label>
        </div>
        <label>
          <span>
            Loan type <b>*</b>
          </span>
          <select
            className={invalid("type") ? "field-error" : ""}
            value={values.type}
            onChange={(event) => set("type", event.target.value)}
          >
            <option value="">Select loan type</option>
            {loanTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          {invalid("type") && <em>Select a loan type.</em>}
        </label>
        <div className="form-row">
          <label>
            <span>
              Original principal <b>*</b>
            </span>
            <div className={`currency-input ${invalid("original") ? "field-error" : ""}`.trim()}>
              <span>₹</span>
              <input
                type="number"
                min="1"
                value={values.original}
                onChange={(event) => set("original", event.target.value)}
                placeholder="0"
              />
            </div>
          </label>
          <label>
            <span>
              Outstanding principal <b>*</b>
            </span>
            <div className={`currency-input ${invalid("outstanding") ? "field-error" : ""}`.trim()}>
              <span>₹</span>
              <input
                type="number"
                min="0"
                value={values.outstanding}
                onChange={(event) => set("outstanding", event.target.value)}
                placeholder="0"
              />
            </div>
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Annual interest rate <b>*</b>
            </span>
            <div className={`suffix-input ${invalid("rate") ? "field-error" : ""}`.trim()}>
              <input
                type="number"
                step=".1"
                min="0"
                value={values.rate}
                onChange={(event) => set("rate", event.target.value)}
                placeholder="0.0"
              />
              <span>%</span>
            </div>
          </label>
          <label>
            <span>
              Monthly EMI <b>*</b>
            </span>
            <div className={`currency-input ${invalid("emi") ? "field-error" : ""}`.trim()}>
              <span>₹</span>
              <input
                type="number"
                min="1"
                value={values.emi}
                onChange={(event) => set("emi", event.target.value)}
                placeholder="0"
              />
            </div>
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Loan start date <b>*</b>
            </span>
            <input
              className={invalid("start") ? "field-error" : ""}
              type="date"
              value={values.start}
              onChange={(event) => set("start", event.target.value)}
            />
          </label>
          <label>
            <span>
              Loan end date <b>*</b>
            </span>
            <input
              className={invalid("end") ? "field-error" : ""}
              type="date"
              value={values.end}
              onChange={(event) => set("end", event.target.value)}
            />
          </label>
        </div>
        <label>
          <span>
            Next due date <b>*</b>
          </span>
          <input
            className={invalid("due") ? "field-error" : ""}
            type="date"
            value={values.due}
            onChange={(event) => set("due", event.target.value)}
          />
          {submitted && required.some((key) => !values[key]) && (
            <em>Complete all required fields before saving.</em>
          )}
        </label>
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
        </label>
      </div>
      <div className="form-modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <button type="submit" className="button button-primary">
          Save loan
        </button>
      </div>
    </FormModal>
  );
}
