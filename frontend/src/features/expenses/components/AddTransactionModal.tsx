"use client";

import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/shared/ui/primitives";
import { FormModal } from "@/shared/ui/FormModal";
import { DialogFooter } from "@/shared/ui/dialog";
import { AffixInput, Field, FormGrid, FormRow, FormSelect, Input, Textarea } from "@/shared/ui/form";
import { cn } from "@/shared/lib/utils";
import type { NewTransaction } from "../api";
import { expenseCategories, incomeCategories, paymentMethods, type TransactionType } from "../data";

export function AddTransactionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (transaction: NewTransaction) => void;
}) {
  const [type, setType] = useState<TransactionType>("Expense");
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("2026-10-08");
  const [payment, setPayment] = useState("");
  const categories = type === "Expense" ? expenseCategories : incomeCategories;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!description.trim() || !amount || !category || !date || !payment) return;
    onSave({
      description: description.trim(),
      category,
      date: new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      payment,
      type,
      amount: Number(amount),
    });
  };

  const invalid = (value: string) => submitted && !value;

  return (
    <FormModal
      title="Add transaction"
      subtitle="Record a new expense or income entry."
      onSubmit={submit}
      onClose={onClose}
    >
      <div
        role="group"
        aria-label="Transaction type"
        className="mb-3 grid grid-cols-2 gap-1 rounded-md bg-secondary p-1"
      >
        {(
          [
            { value: "Expense", icon: ArrowDownRight },
            { value: "Income", icon: ArrowUpRight },
          ] as const
        ).map(({ value, icon: Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={type === value}
            onClick={() => {
              setType(value);
              setCategory("");
            }}
            className={cn(
              "flex h-8.5 items-center justify-center gap-1.5 rounded-sm text-xs font-semibold text-muted-foreground transition",
              type === value && "bg-card text-primary-strong shadow-card",
            )}
          >
            <Icon size="0.9375rem" />
            {value}
          </button>
        ))}
      </div>
      <FormGrid>
        <Field label="Description" required error={invalid(description) && "Enter a description."}>
          <Input
            invalid={invalid(description)}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Grocery shopping"
          />
        </Field>
        <FormRow>
          <Field label="Amount in INR" required error={invalid(amount) && "Enter an amount."}>
            <AffixInput
              prefix="₹"
              type="number"
              min="1"
              inputMode="decimal"
              invalid={invalid(amount)}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </Field>
          <Field label="Category" required error={invalid(category) && "Select a category."}>
            <FormSelect
              invalid={invalid(category)}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </FormSelect>
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Transaction date" required>
            <Input
              invalid={invalid(date)}
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Field>
          <Field label="Payment method" required error={invalid(payment) && "Select a payment method."}>
            <FormSelect
              invalid={invalid(payment)}
              value={payment}
              onChange={(event) => setPayment(event.target.value)}
            >
              <option value="">Select method</option>
              {paymentMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </FormSelect>
          </Field>
        </FormRow>
        <Field label="Account" optional>
          <FormSelect defaultValue="">
            <option value="">Select account</option>
            <option>HDFC Savings</option>
            <option>ICICI Credit Card</option>
            <option>Cash wallet</option>
          </FormSelect>
        </Field>
        <Field label="Notes" optional>
          <Textarea placeholder="Add any helpful context..." />
        </Field>
      </FormGrid>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save transaction</Button>
      </DialogFooter>
    </FormModal>
  );
}
