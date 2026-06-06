import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { InvestorStage } from "../../lib/types";

const STAGES: InvestorStage[] = ["Lead", "Contacted", "Meeting", "Term Sheet", "Closed", "Pass"];

export default function DashboardPage() {
  const { investors, interactions } = useApp();

  return (
    <div data-testid="dashboard-page">
      <h1>Investor CRM Dashboard</h1>
      <div data-testid="total-investors">Total Investors: {investors.length}</div>
      <div data-testid="stage-breakdown">
        {STAGES.map((s) => (
          <div key={s} data-testid={`stage-count-${s.replace(/\s/g, "-")}`}>
            {s}: {investors.filter((i) => i.stage === s).length}
          </div>
        ))}
      </div>
      <div data-testid="recent-interactions">
        <h2>Recent Interactions</h2>
        {interactions.slice(-5).reverse().map((i) => (
          <div key={i.id} data-testid={`recent-interaction-${i.id}`}>
            {i.date} — {i.type} — {i.notes}
          </div>
        ))}
      </div>
    </div>
  );
}
