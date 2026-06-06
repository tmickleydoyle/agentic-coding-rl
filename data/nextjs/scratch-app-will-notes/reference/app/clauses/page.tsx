import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function ClausesPage() {
  const { clauses, addClause, deleteClause } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleAdd = () => {
    if (!title || !body) return;
    addClause({ title, body });
    setTitle(""); setBody("");
  };

  return (
    <div data-testid="clauses-page">
      <h1>Will Clauses</h1>
      {clauses.length === 0 ? (
        <p data-testid="no-clauses">No clauses yet.</p>
      ) : (
        <ul data-testid="clause-list">
          {clauses.map((c) => (
            <li key={c.id} data-testid={`clause-item-${c.id}`}>
              <strong data-testid={`clause-title-${c.id}`}>{c.title}</strong>
              <span data-testid={`clause-body-${c.id}`}>{c.body}</span>
              <button data-testid={`delete-clause-${c.id}`} onClick={() => deleteClause(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-clause-form">
        <input data-testid="clause-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea data-testid="clause-body-input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <button data-testid="add-clause-btn" onClick={handleAdd}>Add Clause</button>
      </div>
    </div>
  );
}
