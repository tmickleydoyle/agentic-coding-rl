import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { InvestorStage } from "../../lib/types";

const STAGES: InvestorStage[] = ["Lead", "Contacted", "Meeting", "Term Sheet", "Closed", "Pass"];

export default function PipelinePage() {
  const { investors, interactions } = useApp();

  return (
    <div data-testid="pipeline-page">
      <h1>Pipeline</h1>
      <div data-testid="pipeline-board" style={{ display: "flex", gap: "1rem" }}>
        {STAGES.map((s) => {
          const stageInvestors = investors.filter((i) => i.stage === s);
          return (
            <div key={s} data-testid={`pipeline-column-${s.replace(/\s/g, "-")}`}>
              <h3>{s} ({stageInvestors.length})</h3>
              {stageInvestors.map((inv) => {
                const invInteractions = interactions.filter((i) => i.investorId === inv.id);
                return (
                  <div
                    key={inv.id}
                    data-testid={`pipeline-card-${inv.id}`}
                    style={{ opacity: s === "Pass" ? 0.5 : 1 }}
                  >
                    <div data-testid={`pipeline-card-name-${inv.id}`}>{inv.name}</div>
                    <div data-testid={`pipeline-card-firm-${inv.id}`}>{inv.firm}</div>
                    <div data-testid={`pipeline-card-interactions-${inv.id}`}>
                      {invInteractions.length === 0 ? "No interactions" : `${invInteractions.length} interaction(s)`}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
