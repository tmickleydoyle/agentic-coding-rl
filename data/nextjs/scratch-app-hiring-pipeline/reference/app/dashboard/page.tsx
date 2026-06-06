import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { CandidateStage } from "../../lib/types";

const STAGES: CandidateStage[] = ["Applied", "Phone Screen", "Technical", "Onsite", "Offer", "Hired", "Rejected"];

export default function DashboardPage() {
  const { jobs, candidates } = useApp();
  const openRoles = jobs.filter((j) => j.status === "Open").length;

  return (
    <div data-testid="dashboard-page">
      <h1>Hiring Pipeline</h1>
      <div data-testid="open-roles">Open Roles: {openRoles}</div>
      <div data-testid="total-candidates">Total Candidates: {candidates.length}</div>
      <div data-testid="stage-breakdown">
        {STAGES.map((s) => (
          <div key={s} data-testid={`stage-count-${s.replace(/\s/g, "-")}`}>
            {s}: {candidates.filter((c) => c.stage === s).length}
          </div>
        ))}
      </div>
    </div>
  );
}
