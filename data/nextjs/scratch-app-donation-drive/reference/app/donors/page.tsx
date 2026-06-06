import React, { useState } from "react";
import { getDonors, addDonor } from "../../lib/store";

export function DonorsPage() {
  const [, setTick] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const donors = getDonors();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addDonor(name.trim(), email.trim());
    setName(""); setEmail("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="donors-page">
      <h2>Donors</h2>
      <form data-testid="donor-form" onSubmit={handleSubmit}>
        <input data-testid="donor-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="donor-email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button data-testid="donor-submit" type="submit">Add Donor</button>
      </form>
      {donors.length === 0 ? (
        <p data-testid="empty-donors">No donors yet</p>
      ) : (
        donors.map((d) => (
          <div key={d.id} data-testid={`donor-row-${d.id}`}>
            <span data-testid={`donor-name-${d.id}`}>{d.name}</span>
            <span data-testid={`donor-total-${d.id}`}>{d.totalDonated}</span>
            <span data-testid={`donor-email-${d.id}`}>{d.email}</span>
          </div>
        ))
      )}
    </div>
  );
}
