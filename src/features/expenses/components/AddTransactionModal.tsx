"use client";

import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { FormModal } from "@/components/ui/FormModal";
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
      <div className="transaction-segment">
        <button
          type="button"
          className={type === "Expense" ? "active" : ""}
          onClick={() => {
            setType("Expense");
            setCategory("");
          }}
        >
          <ArrowDownRight size="0.9375rem" />
          Expense
        </button>
        <button
          type="button"
          className={type === "Income" ? "active" : ""}
          onClick={() => {
            setType("Income");
            setCategory("");
          }}
        >
          <ArrowUpRight size="0.9375rem" />
          Income
        </button>
      </div>
      <div className="form-grid">
        <label>
          <span>
            Description <b>*</b>
          </span>
          <input
            className={invalid(description) ? "field-error" : ""}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Grocery shopping"
          />
          {invalid(description) && <em>Enter a description.</em>}
        </label>
        <div className="form-row">
          <label>
            <span>
              Amount in INR <b>*</b>
            </span>
            <div className={`currency-input ${invalid(amount) ? "field-error" : ""}`.trim()}>
              <span>₹</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
              />
            </div>
            {invalid(amount) && <em>Enter an amount.</em>}
          </label>
          <label>
            <span>
              Category <b>*</b>
            </span>
            <select
              className={invalid(category) ? "field-error" : ""}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {invalid(category) && <em>Select a category.</em>}
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Transaction date <b>*</b>
            </span>
            <input
              className={invalid(date) ? "field-error" : ""}
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label>
            <span>
              Payment method <b>*</b>
            </span>
            <select
              className={invalid(payment) ? "field-error" : ""}
              value={payment}
              onChange={(event) => setPayment(event.target.value)}
            >
              <option value="">Select method</option>
              {paymentMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
            {invalid(payment) && <em>Select a payment method.</em>}
          </label>
        </div>
        <label>
          <span>
            Account <small>Optional</small>
          </span>
          <select defaultValue="">
            <option value="">Select account</option>
            <option>HDFC Savings</option>
            <option>ICICI Credit Card</option>
            <option>Cash wallet</option>
          </select>
        </label>
        <label>
          <span>
            Notes <small>Optional</small>
          </span>
          <textarea rows={3} placeholder="Add any helpful context..." />
        </label>
      </div>
      <div className="form-modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <button className="button button-primary" type="submit">
          Save transaction
        </button>
      </div>
    </FormModal>
  );
}
