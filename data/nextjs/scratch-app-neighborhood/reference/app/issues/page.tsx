import React, { useState } from "react";
import { getIssues, updateIssueStatus } from "../../lib/store";
import type { IssueStatus } from "../../lib/types";

export function IssuesPage() {
  const [, setTick] = useState(0);
  const issues = getIssues();

  function handleStatus(id: string, status: IssueStatus) {
    updateIssueStatus(id, status);
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="issues-page">
      <h2>Neighborhood Issues</h2>
      {issues.map((i) => (
        <div key={i.id} data-testid={`issue-row-${i.id}`}>
          <span data-testid={`issue-title-${i.id}`}>{i.title}</span>
          <span data-testid={`issue-category-${i.id}`}>{i.category}</span>
          <span data-testid={`issue-status-${i.id}`}>{i.status}</span>
          <select data-testid={`issue-status-select-${i.id}`} value={i.status}
            onChange={(e) => handleStatus(i.id, e.target.value as IssueStatus)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      ))}
    </div>
  );
}
