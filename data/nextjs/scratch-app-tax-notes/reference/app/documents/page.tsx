import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { TaxDocument, DocType } from "../../lib/types";

const DOC_TYPES: DocType[] = ["w2", "1099", "1098", "schedule_c", "other"];

export function DocumentsPage() {
  const { documents, addDocument, deleteDocument } = useApp();
  const [name, setName] = useState("");
  const [type, setType] = useState<DocType>("other");
  const [year, setYear] = useState("2023");
  const [amount, setAmount] = useState("");

  function handleAdd() {
    const amt = parseFloat(amount);
    const yr = parseInt(year);
    if (!name || isNaN(amt) || isNaN(yr)) return;
    addDocument({ id: `doc-${Date.now()}`, name, type, year: yr, amount: amt });
    setName(""); setAmount(""); setType("other");
  }

  return (
    <div data-testid="documents-page">
      <h1>Documents</h1>
      <div data-testid="add-document-form">
        <input data-testid="doc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select data-testid="doc-type" value={type} onChange={(e) => setType(e.target.value as DocType)}>
          {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input data-testid="doc-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
        <input data-testid="doc-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <button data-testid="add-doc-btn" onClick={handleAdd}>Add Document</button>
      </div>
      <ul data-testid="document-list">
        {documents.map((d) => (
          <li key={d.id} data-testid={`doc-${d.id}`}>
            <span data-testid={`doc-name-${d.id}`}>{d.name}</span>
            <span data-testid={`doc-type-${d.id}`}>{d.type}</span>
            <span data-testid={`doc-year-${d.id}`}>{d.year}</span>
            <span data-testid={`doc-amount-${d.id}`}>${d.amount.toFixed(2)}</span>
            <button data-testid={`delete-doc-${d.id}`} onClick={() => deleteDocument(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
