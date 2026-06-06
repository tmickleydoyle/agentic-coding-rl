import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function ReportPage() {
  const { profiles, allocations } = useApp();

  return (
    <div data-testid="report-page">
      <h1>Beneficiary Report</h1>
      <ul data-testid="report-list">
        {profiles.map((p) => {
          const myAllocs = allocations.filter((a) => a.beneficiary === p.name);
          const total = myAllocs.reduce((s, a) => s + a.percentage, 0);
          return (
            <li key={p.id} data-testid={`report-item-${p.id}`}>
              <span data-testid={`report-name-${p.id}`}>{p.name}</span>
              <span data-testid={`report-total-${p.id}`}>{total}%</span>
              <ul data-testid={`report-assets-${p.id}`}>
                {myAllocs.map((a) => (
                  <li key={a.id} data-testid={`report-asset-${a.id}`}>{a.asset}: {a.percentage}%</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
