import React, { useState } from "react";
import { getClients, addClient, logVisit } from "../../lib/store";

export function ClientsPage() {
  const [, setTick] = useState(0);
  const [name, setName] = useState("");
  const [householdSize, setHouseholdSize] = useState("");

  const clients = getClients();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addClient(name.trim(), parseInt(householdSize, 10) || 1);
    setName(""); setHouseholdSize("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="clients-page">
      <h2>Clients</h2>
      <form data-testid="client-form" onSubmit={handleSubmit}>
        <input data-testid="client-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="client-household" type="number" placeholder="Household size" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} />
        <button data-testid="client-submit" type="submit">Add Client</button>
      </form>
      {clients.length === 0 ? (
        <p data-testid="empty-clients">No clients yet</p>
      ) : (
        clients.map((c) => (
          <div key={c.id} data-testid={`client-row-${c.id}`}>
            <span data-testid={`client-name-${c.id}`}>{c.name}</span>
            <span data-testid={`client-household-${c.id}`}>{c.householdSize}</span>
            <span data-testid={`client-visit-${c.id}`}>{c.lastVisit}</span>
            <button data-testid={`log-visit-${c.id}`} onClick={() => { logVisit(c.id); setTick((t) => t + 1); }}>
              Log Visit
            </button>
          </div>
        ))
      )}
    </div>
  );
}
