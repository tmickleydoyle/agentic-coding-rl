import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function TrustsPage() {
  const { trusts, addTrust, deleteTrust } = useApp();
  const [name, setName] = useState("");
  const [trustee, setTrustee] = useState("");
  const [principal, setPrincipal] = useState("");

  const handleAdd = () => {
    const num = parseFloat(principal);
    if (!name || !trustee || isNaN(num) || num <= 0) return;
    addTrust({ name, trustee, principal: num });
    setName(""); setTrustee(""); setPrincipal("");
  };

  return (
    <div data-testid="trusts-page">
      <h1>Trusts</h1>
      {trusts.length === 0 ? (
        <p data-testid="no-trusts">No trusts found.</p>
      ) : (
        <ul data-testid="trust-list">
          {trusts.map((t) => (
            <li key={t.id} data-testid={`trust-item-${t.id}`}>
              <span data-testid={`trust-name-${t.id}`}>{t.name}</span>
              <span data-testid={`trust-trustee-${t.id}`}>{t.trustee}</span>
              <span data-testid={`trust-principal-${t.id}`}>${t.principal.toLocaleString()}</span>
              <button data-testid={`delete-trust-${t.id}`} onClick={() => deleteTrust(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-trust-form">
        <input data-testid="trust-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="trust-trustee-input" value={trustee} onChange={(e) => setTrustee(e.target.value)} placeholder="Trustee" />
        <input data-testid="trust-principal-input" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Principal" />
        <button data-testid="add-trust-btn" onClick={handleAdd}>Add Trust</button>
      </div>
    </div>
  );
}
