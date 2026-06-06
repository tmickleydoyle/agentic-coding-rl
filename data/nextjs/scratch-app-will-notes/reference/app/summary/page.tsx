import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function SummaryPage() {
  const { clauses, witnesses } = useApp();
  const signed = witnesses.filter((w) => w.status === "Signed").length;
  const pending = witnesses.filter((w) => w.status === "Pending").length;
  const complete = clauses.length >= 2 && signed >= 2;

  return (
    <div data-testid="summary-page">
      <h1>Will Summary</h1>
      <div data-testid="clause-count">{clauses.length} clauses</div>
      <div data-testid="signed-count">{signed} signed</div>
      <div data-testid="pending-count">{pending} pending</div>
      {complete && <div data-testid="will-complete-badge">Will Complete</div>}
    </div>
  );
}
