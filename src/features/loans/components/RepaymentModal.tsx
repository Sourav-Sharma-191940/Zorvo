"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/primitives";
import { FormModal } from "@/shared/ui/FormModal";
import { DialogFooter } from "@/shared/ui/dialog";
import { AffixInput, Field, FormGrid, FormRow, FormSelect, Input, Textarea } from "@/shared/ui/form";
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
      <FormGrid>
        <Field label="Select loan" required>
          <FormSelect invalid={submitted && !loanId} value={loanId} onChange={(event) => setLoanId(event.target.value)}>
            <option value="">Choose a loan</option>
            {loans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.name} · {loan.lender}
              </option>
            ))}
          </FormSelect>
        </Field>
        <FormRow>
          <Field label="Payment date" required>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </Field>
          <Field label="Amount paid" required>
            <AffixInput
              prefix="₹"
              type="number"
              min="1"
              inputMode="decimal"
              invalid={submitted && !amount}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0"
            />
          </Field>
        </FormRow>
        <Field
          label="Payment method"
          required
          error={submitted && (!loanId || !amount || !method) && "Complete all required payment details."}
        >
          <FormSelect invalid={submitted && !method} value={method} onChange={(event) => setMethod(event.target.value)}>
            <option value="">Select payment method</option>
            <option>Bank transfer</option>
            <option>UPI</option>
            <option>Auto-debit</option>
            <option>Cheque</option>
          </FormSelect>
        </Field>
        <FormRow>
          <Field label="Principal component" optional>
            <AffixInput prefix="₹" type="number" inputMode="decimal" placeholder="0" />
          </Field>
          <Field label="Interest component" optional>
            <AffixInput prefix="₹" type="number" inputMode="decimal" placeholder="0" />
          </Field>
        </FormRow>
        <Field label="Reference number" optional>
          <Input placeholder="e.g. UTR or transaction ID" />
        </Field>
        <Field label="Notes" optional>
          <Textarea placeholder="Add payment notes..." />
        </Field>
      </FormGrid>
      <p className="mt-3 flex items-center gap-1.5 rounded-sm bg-primary-soft px-2.5 py-2.25 text-3xs text-primary-strong">
        <Check size="0.875rem" className="shrink-0" />
        The payment is recorded only after you select &ldquo;Record payment&rdquo;.
      </p>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Record payment</Button>
      </DialogFooter>
    </FormModal>
  );
}
