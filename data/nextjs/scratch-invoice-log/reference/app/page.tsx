"use client";
import React, { useState } from "react";

type InvoiceStatus = "pending" | "paid" | "overdue";

interface Invoice {
  id: number;
  invoiceNumber: string;
  client: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

const SEED_INVOICES: Invoice[] = [
  { id: 1, invoiceNumber: "INV-001", client: "Acme Corp", amount: 2400, issueDate: "2024-01-01", dueDate: "2024-01-31", status: "paid" },
  { id: 2, invoiceNumber: "INV-002", client: "Beta Studio", amount: 950, issueDate: "2024-01-10", dueDate: "2024-02-09", status: "pending" },
  { id: 3, invoiceNumber: "INV-003", client: "Gamma LLC", amount: 1600, issueDate: "2024-01-15", dueDate: "2024-02-14", status: "pending" },
  { id: 4, invoiceNumber: "INV-004", client: "Delta Partners", amount: 3300, issueDate: "2024-01-20", dueDate: "2024-02-19", status: "overdue" },
];

type FilterType = "All" | InvoiceStatus;
const FILTERS: FilterType[] = ["All", "pending", "paid", "overdue"];

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);
  const [nextId, setNextId] = useState(5);
  const [filter, setFilter] = useState<FilterType>("All");

  const [formNumber, setFormNumber] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formIssueDate, setFormIssueDate] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState<InvoiceStatus>("pending");

  const outstanding = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((s, inv) => s + inv.amount, 0);

  const filtered = filter === "All" ? invoices : invoices.filter((inv) => inv.status === filter);

  function handleAdd() {
    const amount = parseFloat(formAmount);
    if (!formNumber.trim() || !formClient.trim() || isNaN(amount) || amount <= 0) return;
    setInvoices((prev) => [
      ...prev,
      {
        id: nextId,
        invoiceNumber: formNumber.trim(),
        client: formClient.trim(),
        amount,
        issueDate: formIssueDate,
        dueDate: formDueDate,
        status: formStatus,
      },
    ]);
    setNextId((n) => n + 1);
    setFormNumber("");
    setFormClient("");
    setFormAmount("");
    setFormIssueDate("");
    setFormDueDate("");
    setFormStatus("pending");
  }

  function handleMarkPaid(id: number) {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );
  }

  function handleDelete(id: number) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 900 }}>
      <h1 data-testid="page-heading">Invoice Log</h1>

      <p data-testid="outstanding-total">Outstanding: ${outstanding.toFixed(2)}</p>

      <div data-testid="filter-bar" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            data-testid={`filter-${f}`}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p data-testid="empty-state">No invoices found.</p>
      ) : (
        <ul data-testid="invoice-list" style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((inv) => (
            <li key={inv.id} data-testid={`invoice-row-${inv.id}`} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <span data-testid={`invoice-number-${inv.id}`} style={{ marginRight: 8 }}>{inv.invoiceNumber}</span>
              <span data-testid={`invoice-client-${inv.id}`} style={{ marginRight: 8 }}>{inv.client}</span>
              <span data-testid={`invoice-amount-${inv.id}`} style={{ marginRight: 8 }}>${inv.amount.toFixed(2)}</span>
              <span data-testid={`invoice-issue-${inv.id}`} style={{ marginRight: 8 }}>{inv.issueDate}</span>
              <span data-testid={`invoice-due-${inv.id}`} style={{ marginRight: 8 }}>{inv.dueDate}</span>
              <span data-testid={`invoice-status-${inv.id}`} style={{ marginRight: 8 }}>[{inv.status}]</span>
              {inv.status !== "paid" && (
                <button data-testid={`mark-paid-${inv.id}`} onClick={() => handleMarkPaid(inv.id)} style={{ marginRight: 4 }}>
                  Mark Paid
                </button>
              )}
              <button data-testid={`delete-invoice-${inv.id}`} onClick={() => handleDelete(inv.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div data-testid="add-form" style={{ border: "1px solid #ccc", padding: 16, marginTop: 24 }}>
        <h2>Add Invoice</h2>
        <div>
          <label htmlFor="form-number">Invoice #</label>
          <input id="form-number" data-testid="form-number" value={formNumber} onChange={(e) => setFormNumber(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <div>
          <label htmlFor="form-client">Client</label>
          <input id="form-client" data-testid="form-client" value={formClient} onChange={(e) => setFormClient(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <div>
          <label htmlFor="form-amount">Amount</label>
          <input id="form-amount" data-testid="form-amount" type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <div>
          <label htmlFor="form-issue-date">Issue Date</label>
          <input id="form-issue-date" data-testid="form-issue-date" type="date" value={formIssueDate} onChange={(e) => setFormIssueDate(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <div>
          <label htmlFor="form-due-date">Due Date</label>
          <input id="form-due-date" data-testid="form-due-date" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <div>
          <label htmlFor="form-status">Status</label>
          <select id="form-status" data-testid="form-status" value={formStatus} onChange={(e) => setFormStatus(e.target.value as InvoiceStatus)} style={{ marginLeft: 8 }}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <button data-testid="add-btn" onClick={handleAdd} style={{ marginTop: 8 }}>Add</button>
      </div>
    </main>
  );
}
