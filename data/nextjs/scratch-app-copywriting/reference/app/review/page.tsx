"use client";
import React, { useEffect, useState } from "react";
import { Copy } from "../../lib/types";

export function ReviewPage() {
  const [copies, setCopies] = useState<Copy[]>([]);

  const load = () => {
    fetch("/api/copies?status=review").then((r) => r.json()).then((d) => setCopies(d.copies ?? []));
  };
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    await fetch("/api/copies/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "approved" }),
    });
    load();
  };

  const requestRevision = async (id: string) => {
    await fetch("/api/copies/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "revision" }),
    });
    load();
  };

  return (
    <div data-testid="review-page">
      <h1>Review</h1>
      {copies.length === 0 ? (
        <div data-testid="no-review">Nothing in review</div>
      ) : (
        <ul data-testid="review-list">
          {copies.map((c) => (
            <li key={c.id} data-testid={`review-item-${c.id}`}>
              <span data-testid={`review-headline-${c.id}`}>{c.headline}</span>
              <span data-testid={`review-rating-${c.id}`}>{c.rating}</span>
              <button data-testid={`approve-btn-${c.id}`} onClick={() => approve(c.id)}>Approve</button>
              <button data-testid={`revision-btn-${c.id}`} onClick={() => requestRevision(c.id)}>Request Revision</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
