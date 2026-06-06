import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function RunwayPage() {
  const { expenses, settings } = useApp();
  const monthlyBurn = expenses.reduce((s, e) => s + e.amount, 0);
  const runwayMonths = monthlyBurn === 0 ? Infinity : Math.floor(settings.cashBalance / monthlyBurn);

  return (
    <div data-testid="runway-page">
      <h1>Runway Calculator</h1>
      <div data-testid="runway-cash">Current Cash: ${settings.cashBalance.toLocaleString()}</div>
      <div data-testid="runway-burn">Monthly Burn: ${monthlyBurn.toLocaleString()}</div>
      <div data-testid="runway-result">
        Months of Runway: {runwayMonths === Infinity ? "∞" : runwayMonths}
      </div>
      <div data-testid="runway-target">Target Runway: {settings.targetRunway} months</div>
      <div data-testid="runway-gap">
        {runwayMonths === Infinity
          ? "Infinite runway"
          : runwayMonths >= settings.targetRunway
          ? `${runwayMonths - settings.targetRunway} months above target`
          : `${settings.targetRunway - runwayMonths} months below target`}
      </div>
    </div>
  );
}
