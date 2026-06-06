import React, { useState } from "react";
import { getRequests, addRequest, fulfillRequest } from "../../lib/store";
import type { AidCategory } from "../../lib/types";

export function RequestsPage() {
  const [, setTick] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AidCategory>("Food");
  const [requester, setRequester] = useState("");

  const requests = getRequests();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !requester.trim()) return;
    addRequest(title.trim(), category, requester.trim());
    setTitle(""); setRequester(""); setCategory("Food");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="requests-page">
      <h2>Aid Requests</h2>
      <form data-testid="request-form" onSubmit={handleSubmit}>
        <input data-testid="request-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select data-testid="request-category" value={category} onChange={(e) => setCategory(e.target.value as AidCategory)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Childcare">Childcare</option>
          <option value="Other">Other</option>
        </select>
        <input data-testid="request-requester" placeholder="Requester" value={requester} onChange={(e) => setRequester(e.target.value)} />
        <button data-testid="request-submit" type="submit">Add Request</button>
      </form>
      {requests.map((r) => (
        <div key={r.id} data-testid={`request-row-${r.id}`}>
          <span data-testid={`request-title-${r.id}`}>{r.title}</span>
          <span data-testid={`request-status-${r.id}`}>{r.status}</span>
          <span data-testid={`request-category-${r.id}`}>{r.category}</span>
          {r.status === "Open" && (
            <button data-testid={`fulfill-${r.id}`} onClick={() => { fulfillRequest(r.id); setTick((t) => t + 1); }}>
              Fulfill
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
