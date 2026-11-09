"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { FormModal } from "@/components/ui/FormModal";
import type { Loan } from "../data";

export function RepaymentModal({
  loans,
  selectedLoan,
  onClose,
  onSave,
}: {
  loans: Loan[];
  selectedLoan?: Loan;
  onClose: () => void;
  onSave: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loanId, setLoanId] = useState(String(selectedLoan?.id ?? ""));
  const [date, setDate] = useState("2026-10-08");
  const [amount, setAmount] = useState(selectedLoan ? String(selectedLoan.emi) : "");
  const [method, setMethod] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!loanId || !date || !amount || !method) return;
    onSave();
  };

  return (
    <FormModal
      title="Record repayment"
      subtitle="Confirm the payment details before recording."
      size="sm"
      onSubmit={submit}
      onClose={onClose}
    >
      <div className="form-grid">
        <label>
          <span>
            Select loan <b>*</b>
          </span>
          <select
            className={submitted && !loanId ? "field-error" : ""}
            value={loanId}
            onChange={(event) => setLoanId(event.target.value)}
          >
            <option value="">Choose a loan</option>
            {loans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.name} · {loan.lender}
              </option>
            ))}
          </select>
        </label>
        <div className="form-row">
          <label>
            <span>
              Payment date <b>*</b>
            </span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            <span>
              Amount paid <b>*</b>
            </span>
            <div className={`currency-input ${submitted && !amount ? "field-error" : ""}`.trim()}>
              <span>₹</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0"
              />
            </div>
          </label>
        </div>
        <label>
          <span>
            Payment method <b>*</b>
          </span>
          <select
            className={submitted && !method ? "field-error" : ""}
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          >
            <option value="">Select payment method</option>
            <option>Bank transfer</option>
            <option>UPI</option>
            <option>Auto-debit</option>
            <option>Cheque</option>
          </select>
          {submitted && (!loanId || !amount || !method) && (
            <em>Complete all required payment details.</em>
          )}
        </label>
        <div className="form-row">
          <label>
            <span>
              Principal component <small>Optional</small>
            </span>
            <div className="currency-input">
              <span>₹</span>
              <input type="number" placeholder="0" />
            </div>
          </label>
          <label>
            <span>
              Interest component <small>Optional</small>
            </span>
            <div className="currency-input">
              <span>₹</span>
              <input type="number" placeholder="0" />
            </div>
          </label>
        </div>
        <label>
          <span>
            Reference number <small>Optional</small>
          </span>
          <input placeholder="e.g. UTR or transaction ID" />
        </label>
        <label>
          <span>
            Notes <small>Optional</small>
          </span>
          <textarea rows={3} placeholder="Add payment notes..." />
        </label>
      </div>
      <div className="repayment-confirm-note">
        <Check size="0.875rem" />
        The payment is recorded only after you select &ldquo;Record payment&rdquo;.
      </div>
      <div className="form-modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <button type="submit" className="button button-primary">
          Record payment
        </button>
      </div>
    </FormModal>
  );
}
