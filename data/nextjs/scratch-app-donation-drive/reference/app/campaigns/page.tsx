import React, { useState } from "react";
import { getCampaigns, getDonors, donate } from "../../lib/store";

export function CampaignsPage() {
  const [, setTick] = useState(0);
  const [donatingId, setDonatingId] = useState<string | null>(null);
  const [donorId, setDonorId] = useState("");
  const [amount, setAmount] = useState("");

  const campaigns = getCampaigns();
  const donors = getDonors();

  function handleDonate(campaignId: string) {
    const amt = parseFloat(amount);
    if (!donorId || isNaN(amt) || amt <= 0) return;
    donate(campaignId, donorId, amt);
    setDonatingId(null); setDonorId(""); setAmount("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="campaigns-page">
      <h2>Campaigns</h2>
      {campaigns.map((c) => {
        const pct = Math.floor((c.raised / c.goal) * 100);
        return (
          <div key={c.id} data-testid={`campaign-row-${c.id}`}>
            <span data-testid={`campaign-name-${c.id}`}>{c.name}</span>
            <span data-testid={`campaign-raised-${c.id}`}>{c.raised}</span>
            <span data-testid={`campaign-goal-${c.id}`}>{c.goal}</span>
            <span data-testid={`campaign-pct-${c.id}`}>{pct}</span>
            <span data-testid={`campaign-status-${c.id}`}>{c.status}</span>
            {c.status === "Active" && (
              <>
                <button data-testid={`donate-btn-${c.id}`} onClick={() => setDonatingId(c.id)}>Donate</button>
                {donatingId === c.id && (
                  <div data-testid={`donate-form-${c.id}`}>
                    <select data-testid="donate-donor" value={donorId} onChange={(e) => setDonorId(e.target.value)}>
                      <option value="">Select donor</option>
                      {donors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input data-testid="donate-amount" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <button data-testid="donate-submit" onClick={() => handleDonate(c.id)}>Confirm</button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
