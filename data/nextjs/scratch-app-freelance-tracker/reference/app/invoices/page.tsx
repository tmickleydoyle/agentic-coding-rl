'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Invoice } from '../../lib/types';

export function InvoicesPage() {
  const { projects, invoices, setInvoices } = useApp();
  const [projectId, setProjectId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !dueDate) return;
    const proj = projects.find(p => p.id === projectId);
    const computedAmount = amount ? Number(amount) : (proj ? proj.hourlyRate * proj.hoursLogged : 0);
    const inv: Invoice = {
      id: `i${Date.now()}`,
      projectId,
      amount: computedAmount,
      status: 'unpaid',
      dueDate,
    };
    setInvoices(prev => [...prev, inv]);
    setProjectId(''); setAmount(''); setDueDate('');
  }

  function handlePay(id: string) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i));
  }

  function handleDelete(id: string) {
    setInvoices(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div>
      <h2>Invoices</h2>
      <form data-testid="invoice-add-form" onSubmit={handleAdd}>
        <select data-testid="invoice-project-select" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <input data-testid="invoice-amount-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (optional)" />
        <input data-testid="invoice-due-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <button data-testid="invoice-submit" type="submit">Add Invoice</button>
      </form>
      <ul data-testid="invoice-list">
        {invoices.map(i => (
          <li key={i.id} data-testid="invoice-item">
            <span>{i.amount}</span>
            <span>{i.status}</span>
            <span>{i.dueDate}</span>
            {i.status === 'unpaid' && (
              <button data-testid="invoice-pay" onClick={() => handlePay(i.id)}>Pay</button>
            )}
            <button data-testid="invoice-delete" onClick={() => handleDelete(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
