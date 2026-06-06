import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function VisasPage() {
  const { visas } = useApp();
  return (
    <div data-testid="visas-page">
      <h2>All Visas</h2>
      {visas.map((v) => (
        <div key={v.id} data-testid="visa-card">
          <span data-testid="visa-country">{v.country}</span>
          <span data-testid="visa-type">{v.visaType}</span>
          <span data-testid="visa-status">{v.status}</span>
          <span data-testid="visa-expiry">{v.expiryDate}</span>
        </div>
      ))}
    </div>
  );
}
