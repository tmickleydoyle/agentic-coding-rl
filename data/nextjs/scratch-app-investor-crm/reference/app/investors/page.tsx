import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Investor, InvestorStage } from "../../lib/types";

const STAGES: InvestorStage[] = ["Lead", "Contacted", "Meeting", "Term Sheet", "Closed", "Pass"];

export default function InvestorsPage() {
  const { investors, setInvestors } = useApp();
  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<InvestorStage>("Lead");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Name required"); return; }
    if (!firm.trim()) { setError("Firm required"); return; }
    if (!email.includes("@")) { setError("Invalid email"); return; }
    setError("");
    const inv: Investor = { id: String(Date.now()), name: name.trim(), firm: firm.trim(), email, stage };
    setInvestors([...investors, inv]);
    setName(""); setFirm(""); setEmail(""); setStage("Lead");
  }

  function handleDelete(id: string) {
    setInvestors(investors.filter((i) => i.id !== id));
  }

  return (
    <div data-testid="investors-page">
      <h1>Investors</h1>
      {error && <div data-testid="investor-error">{error}</div>}
      <div data-testid="add-investor-form">
        <input data-testid="investor-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="investor-firm-input" value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="Firm" />
        <input data-testid="investor-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <select data-testid="investor-stage-select" value={stage} onChange={(e) => setStage(e.target.value as InvestorStage)}>
          {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button data-testid="add-investor-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="investor-list">
        {investors.map((inv) => (
          <li key={inv.id} data-testid={`investor-item-${inv.id}`}>
            <span data-testid={`investor-name-${inv.id}`}>{inv.name}</span>
            <span data-testid={`investor-firm-${inv.id}`}>{inv.firm}</span>
            <span data-testid={`investor-stage-${inv.id}`}>{inv.stage}</span>
            <button data-testid={`delete-investor-${inv.id}`} onClick={() => handleDelete(inv.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
