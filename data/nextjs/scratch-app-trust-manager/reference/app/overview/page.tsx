import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function OverviewPage() {
  const { trusts, distributions } = useApp();
  const totalPrincipal = trusts.reduce((s, t) => s + t.principal, 0);
  const totalDistributed = distributions.reduce((s, d) => s + d.amount, 0);
  const remaining = totalPrincipal - totalDistributed;

  return (
    <div data-testid="overview-page">
      <h1>Trust Overview</h1>
      <div data-testid="total-principal">${totalPrincipal.toLocaleString()}</div>
      <div data-testid="total-distributed">${totalDistributed.toLocaleString()}</div>
      <div data-testid="total-remaining">${remaining.toLocaleString()}</div>
      <ul data-testid="trust-breakdown">
        {trusts.map((t) => {
          const dist = distributions.filter((d) => d.trustName === t.name).reduce((s, d) => s + d.amount, 0);
          const rem = t.principal - dist;
          return (
            <li key={t.id} data-testid={`breakdown-item-${t.id}`}>
              <span data-testid={`breakdown-name-${t.id}`}>{t.name}</span>
              <span data-testid={`breakdown-principal-${t.id}`}>${t.principal.toLocaleString()}</span>
              <span data-testid={`breakdown-distributed-${t.id}`}>${dist.toLocaleString()}</span>
              <span data-testid={`breakdown-remaining-${t.id}`}>${rem.toLocaleString()}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
