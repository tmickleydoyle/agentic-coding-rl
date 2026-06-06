import React, { useState } from "react";
import { getDonations, markReceived } from "../../lib/store";

export function DonationsPage() {
  const [, setTick] = useState(0);
  const donations = getDonations();

  return (
    <div data-testid="donations-page">
      <h2>Donations</h2>
      {donations.map((d) => (
        <div key={d.id} data-testid={`donation-row-${d.id}`}>
          <span data-testid={`donation-donor-${d.id}`}>{d.donor}</span>
          <span data-testid={`donation-status-${d.id}`}>{d.status}</span>
          <span data-testid={`donation-items-${d.id}`}>{d.items}</span>
          {d.status === "Pending" && (
            <button data-testid={`mark-received-${d.id}`} onClick={() => { markReceived(d.id); setTick((t) => t + 1); }}>
              Mark Received
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
