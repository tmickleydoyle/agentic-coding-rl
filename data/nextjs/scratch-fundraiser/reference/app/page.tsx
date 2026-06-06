import React, { useState } from "react";

interface Campaign {
  id: number;
  name: string;
  goal: number;
}

interface Donation {
  id: number;
  campaignId: number;
  donorName: string;
  amount: number;
  date: string;
}

const SEED_CAMPAIGNS: Campaign[] = [
  { id: 1, name: "School Supplies Drive", goal: 1000.0 },
  { id: 2, name: "Community Garden", goal: 500.0 },
];

const SEED_DONATIONS: Donation[] = [
  { id: 1, campaignId: 1, donorName: "Alice Martin", amount: 150.0, date: "2024-03-01" },
  { id: 2, campaignId: 1, donorName: "Bob Lee", amount: 200.0, date: "2024-03-05" },
  { id: 3, campaignId: 2, donorName: "Carol White", amount: 100.0, date: "2024-03-08" },
  { id: 4, campaignId: 2, donorName: "Dave Kim", amount: 75.0, date: "2024-03-10" },
];

let nextCampaignId = 3;
let nextDonationId = 5;

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [donations, setDonations] = useState<Donation[]>(SEED_DONATIONS);

  const [campNameInput, setCampNameInput] = useState("");
  const [campGoalInput, setCampGoalInput] = useState("");

  const [donorCampaignId, setDonorCampaignId] = useState("");
  const [donorNameInput, setDonorNameInput] = useState("");
  const [donorAmountInput, setDonorAmountInput] = useState("");
  const [donorDateInput, setDonorDateInput] = useState("");

  const handleAddCampaign = () => {
    const goal = parseFloat(campGoalInput);
    if (!campNameInput.trim() || !campGoalInput || goal <= 0) return;
    const newCampaign: Campaign = {
      id: nextCampaignId++,
      name: campNameInput.trim(),
      goal,
    };
    setCampaigns([newCampaign, ...campaigns]);
    setCampNameInput("");
    setCampGoalInput("");
  };

  const handleAddDonation = () => {
    const amount = parseFloat(donorAmountInput);
    if (!donorCampaignId || !donorNameInput.trim() || !donorAmountInput || !donorDateInput || amount <= 0) return;
    const newDonation: Donation = {
      id: nextDonationId++,
      campaignId: parseInt(donorCampaignId),
      donorName: donorNameInput.trim(),
      amount,
      date: donorDateInput,
    };
    setDonations([...donations, newDonation]);
    setDonorCampaignId("");
    setDonorNameInput("");
    setDonorAmountInput("");
    setDonorDateInput("");
  };

  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    setDonations(donations.filter((d) => d.campaignId !== id));
  };

  const getRaised = (campaignId: number) =>
    donations.filter((d) => d.campaignId === campaignId).reduce((sum, d) => sum + d.amount, 0);

  const grandTotal = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonors = donations.length;

  return (
    <div>
      <h1>Fundraiser</h1>

      <section>
        <h2>Add Campaign</h2>
        <label htmlFor="camp-name">Campaign Name</label>
        <input
          id="camp-name"
          type="text"
          value={campNameInput}
          onChange={(e) => setCampNameInput(e.target.value)}
          data-testid="input-campaign-name"
        />
        <label htmlFor="camp-goal">Goal Amount</label>
        <input
          id="camp-goal"
          type="number"
          min="1"
          step="1"
          value={campGoalInput}
          onChange={(e) => setCampGoalInput(e.target.value)}
          data-testid="input-campaign-goal"
        />
        <button onClick={handleAddCampaign} data-testid="btn-add-campaign">
          Add Campaign
        </button>
      </section>

      <section>
        <h2>Add Donation</h2>
        <label htmlFor="donor-campaign">Select Campaign</label>
        <select
          id="donor-campaign"
          value={donorCampaignId}
          onChange={(e) => setDonorCampaignId(e.target.value)}
          data-testid="select-campaign"
        >
          <option value="">-- Select a campaign --</option>
          {campaigns.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <label htmlFor="donor-name">Donor Name</label>
        <input
          id="donor-name"
          type="text"
          value={donorNameInput}
          onChange={(e) => setDonorNameInput(e.target.value)}
          data-testid="input-donor-name"
        />
        <label htmlFor="donor-amount">Amount</label>
        <input
          id="donor-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={donorAmountInput}
          onChange={(e) => setDonorAmountInput(e.target.value)}
          data-testid="input-donor-amount"
        />
        <label htmlFor="donor-date">Date</label>
        <input
          id="donor-date"
          type="date"
          value={donorDateInput}
          onChange={(e) => setDonorDateInput(e.target.value)}
          data-testid="input-donor-date"
        />
        <button onClick={handleAddDonation} data-testid="btn-add-donation">
          Add Donation
        </button>
      </section>

      <section>
        <h2>Campaigns</h2>
        {campaigns.length === 0 ? (
          <p data-testid="no-campaigns">No campaigns yet.</p>
        ) : (
          <ul data-testid="campaigns-list">
            {campaigns.map((campaign) => {
              const raised = getRaised(campaign.id);
              const progress = Math.min((raised / campaign.goal) * 100, 100);
              const campDonations = donations.filter((d) => d.campaignId === campaign.id);
              return (
                <li key={campaign.id} data-testid={`campaign-${campaign.id}`}>
                  <span data-testid={`campaign-name-${campaign.id}`}>{campaign.name}</span>
                  {" — Goal: "}
                  <span data-testid={`campaign-goal-${campaign.id}`}>${campaign.goal.toFixed(2)}</span>
                  {" — Raised: "}
                  <span data-testid={`campaign-raised-${campaign.id}`}>${raised.toFixed(2)}</span>
                  {" — Progress: "}
                  <span data-testid={`campaign-progress-${campaign.id}`}>{progress.toFixed(1)}%</span>
                  <div
                    data-testid={`progress-bar-${campaign.id}`}
                    style={{ width: `${progress}%`, height: "10px", background: "green" }}
                  />
                  {campDonations.length > 0 && (
                    <ul data-testid={`donors-list-${campaign.id}`}>
                      {campDonations.map((d) => (
                        <li key={d.id} data-testid={`donor-${d.id}`}>
                          {d.donorName} — ${d.amount.toFixed(2)} — {d.date}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    data-testid={`btn-delete-campaign-${campaign.id}`}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2>Summary</h2>
        <p data-testid="grand-total">Grand Total Raised: ${grandTotal.toFixed(2)}</p>
        <p data-testid="total-donors">Total Donors: {totalDonors}</p>
      </section>
    </div>
  );
}
