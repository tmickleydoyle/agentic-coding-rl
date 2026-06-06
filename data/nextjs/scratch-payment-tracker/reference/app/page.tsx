"use client";
import React, { useState } from "react";

interface ClientRecord {
  name: string;
  expected: number;
}

interface Payment {
  id: number;
  client: string;
  amount: number;
  date: string;
  reference: string;
}

const CLIENTS: ClientRecord[] = [
  { name: "Acme Corp", expected: 5000 },
  { name: "Beta Studio", expected: 2400 },
  { name: "Gamma LLC", expected: 3200 },
];

const SEED_PAYMENTS: Payment[] = [
  { id: 1, client: "Acme Corp", amount: 2500, date: "2024-01-10", reference: "ACH-20240110" },
  { id: 2, client: "Beta Studio", amount: 2400, date: "2024-01-12", reference: "WIRE-20240112" },
  { id: 3, client: "Acme Corp", amount: 1500, date: "2024-01-20", reference: "ACH-20240120" },
  { id: 4, client: "Gamma LLC", amount: 1000, date: "2024-01-22", reference: "CHECK-001" },
];

export default function App() {
  const [payments, setPayments] = useState<Payment[]>(SEED_PAYMENTS);
  const [nextId, setNextId] = useState(5);

  const [formClient, setFormClient] = useState(CLIENTS[0].name);
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formReference, setFormReference] = useState("");

  const totalReceived = payments.reduce((s, p) => s + p.amount, 0);

  const sorted = [...payments].sort((a, b) => b.date.localeCompare(a.date));

  function getPaid(clientName: string) {
    return payments.filter((p) => p.client === clientName).reduce((s, p) => s + p.amount, 0);
  }

  function handleLog() {
    const amount = parseFloat(formAmount);
    if (isNaN(amount) || amount <= 0) return;
    setPayments((prev) => [
      ...prev,
      { id: nextId, client: formClient, amount, date: formDate, reference: formReference.trim() },
    ]);
    setNextId((n) => n + 1);
    setFormAmount("");
    setFormDate("");
    setFormReference("");
  }

  function handleDelete(id: number) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 800 }}>
      <h1 data-testid="page-heading">Payment Tracker</h1>

      <p data-testid="total-received">Total Received: ${totalReceived.toFixed(2)}</p>

      <section data-testid="client-balances" style={{ marginBottom: 24 }}>
        <h2>Client Balances</h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Client</th>
              <th style={{ textAlign: "right" }}>Expected</th>
              <th style={{ textAlign: "right" }}>Paid</th>
              <th style={{ textAlign: "right" }}>Balance Due</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => {
              const paid = getPaid(c.name);
              const balance = c.expected - paid;
              return (
                <tr key={c.name} data-testid={`balance-row-${c.name.replace(/\s+/g, "-")}`}>
                  <td data-testid={`balance-client-${c.name.replace(/\s+/g, "-")}`}>{c.name}</td>
                  <td style={{ textAlign: "right" }} data-testid={`balance-expected-${c.name.replace(/\s+/g, "-")}`}>${c.expected.toFixed(2)}</td>
                  <td style={{ textAlign: "right" }} data-testid={`balance-paid-${c.name.replace(/\s+/g, "-")}`}>${paid.toFixed(2)}</td>
                  <td
                    style={{ textAlign: "right", color: balance > 0 ? "red" : "green" }}
                    data-testid={`balance-due-${c.name.replace(/\s+/g, "-")}`}
                  >
                    ${balance.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div data-testid="log-form" style={{ border: "1px solid #ccc", padding: 16, marginBottom: 24 }}>
        <h2>Log Payment</h2>
        <div>
          <label htmlFor="form-client">Client</label>
          <select id="form-client" data-testid="form-client" value={formClient} onChange={(e) => setFormClient(e.target.value)} style={{ marginLeft: 8 }}>
            {CLIENTS.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="form-amount">Amount</label>
          <input id="form-amount" data-testid="form-amount" type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <div>
          <label htmlFor="form-date">Date</label>
          <input id="form-date" data-testid="form-date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <div>
          <label htmlFor="form-reference">Reference</label>
          <input id="form-reference" data-testid="form-reference" value={formReference} onChange={(e) => setFormReference(e.target.value)} style={{ marginLeft: 8 }} />
        </div>
        <button data-testid="log-btn" onClick={handleLog} style={{ marginTop: 8 }}>Log Payment</button>
      </div>

      <section>
        <h2>Payments</h2>
        <ul data-testid="payments-list" style={{ listStyle: "none", padding: 0 }}>
          {sorted.map((p) => (
            <li key={p.id} data-testid={`payment-row-${p.id}`} style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
              <span data-testid={`payment-client-${p.id}`} style={{ marginRight: 8 }}>{p.client}</span>
              <span data-testid={`payment-amount-${p.id}`} style={{ marginRight: 8 }}>${p.amount.toFixed(2)}</span>
              <span data-testid={`payment-date-${p.id}`} style={{ marginRight: 8 }}>{p.date}</span>
              <span data-testid={`payment-reference-${p.id}`} style={{ marginRight: 8 }}>{p.reference}</span>
              <button data-testid={`delete-payment-${p.id}`} onClick={() => handleDelete(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
