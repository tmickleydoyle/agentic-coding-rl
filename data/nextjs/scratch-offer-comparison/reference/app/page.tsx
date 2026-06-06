"use client";
import React, { useState } from "react";

interface Offer {
  id: number;
  company: string;
  role: string;
  baseSalary: number;
  bonus: number;
  equity: number;
  benefits: number;
  location: string;
  remote: boolean;
}

const SEED_OFFERS: Offer[] = [
  { id: 1, company: "Acme Corp", role: "Senior Engineer", baseSalary: 150000, bonus: 15000, equity: 50000, benefits: 12000, location: "New York, NY", remote: false },
  { id: 2, company: "Beta Inc", role: "Staff Engineer", baseSalary: 170000, bonus: 20000, equity: 80000, benefits: 10000, location: "Remote", remote: true },
  { id: 3, company: "Gamma LLC", role: "Principal Engineer", baseSalary: 160000, bonus: 25000, equity: 100000, benefits: 15000, location: "San Francisco, CA", remote: false },
];

function totalComp(o: Offer): number {
  return o.baseSalary + o.bonus + Math.floor(o.equity / 4) + o.benefits;
}

function getRanks(offers: Offer[]): Record<number, number> {
  const sorted = [...offers].sort((a, b) => totalComp(b) - totalComp(a));
  const ranks: Record<number, number> = {};
  sorted.forEach((o, idx) => {
    ranks[o.id] = idx + 1;
  });
  return ranks;
}

export default function App() {
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [nextId, setNextId] = useState(4);

  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formBase, setFormBase] = useState("");
  const [formBonus, setFormBonus] = useState("");
  const [formEquity, setFormEquity] = useState("");
  const [formBenefits, setFormBenefits] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formRemote, setFormRemote] = useState(false);

  const ranks = getRanks(offers);
  const sortedOffers = [...offers].sort((a, b) => totalComp(b) - totalComp(a));
  const bestOffer = sortedOffers.length > 0 ? sortedOffers[0].company : "None";

  function handleAdd() {
    if (!formCompany.trim() || !formRole.trim()) return;
    const newOffer: Offer = {
      id: nextId,
      company: formCompany.trim(),
      role: formRole.trim(),
      baseSalary: parseInt(formBase) || 0,
      bonus: parseInt(formBonus) || 0,
      equity: parseInt(formEquity) || 0,
      benefits: parseInt(formBenefits) || 0,
      location: formLocation.trim(),
      remote: formRemote,
    };
    setOffers([...offers, newOffer]);
    setNextId(nextId + 1);
    setFormCompany(""); setFormRole(""); setFormBase(""); setFormBonus(""); setFormEquity(""); setFormBenefits(""); setFormLocation(""); setFormRemote(false);
  }

  function handleDelete(id: number) {
    setOffers(offers.filter((o) => o.id !== id));
  }

  return (
    <div>
      <h1>Offer Comparison</h1>
      <p data-testid="best-offer">{bestOffer}</p>

      {offers.map((offer) => (
        <div key={offer.id} data-testid={`offer-card-${offer.id}`}>
          <p>{offer.company}</p>
          <p>{offer.role}</p>
          <p>{offer.location}</p>
          <p>{offer.remote ? "Remote" : "On-site"}</p>
          <p>Base: ${offer.baseSalary.toLocaleString()}</p>
          <p>Bonus: ${offer.bonus.toLocaleString()}</p>
          <p>Equity: ${offer.equity.toLocaleString()}</p>
          <p>Benefits: ${offer.benefits.toLocaleString()}</p>
          <p data-testid={`total-comp-${offer.id}`}>{totalComp(offer)}</p>
          <p data-testid={`rank-${offer.id}`}>{ranks[offer.id]}</p>
          <button data-testid={`delete-offer-${offer.id}`} onClick={() => handleDelete(offer.id)}>Delete</button>
        </div>
      ))}

      <div>
        <input data-testid="input-offer-company" type="text" placeholder="Company" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
        <input data-testid="input-offer-role" type="text" placeholder="Role" value={formRole} onChange={(e) => setFormRole(e.target.value)} />
        <input data-testid="input-offer-base" type="number" placeholder="Base Salary" value={formBase} onChange={(e) => setFormBase(e.target.value)} />
        <input data-testid="input-offer-bonus" type="number" placeholder="Bonus" value={formBonus} onChange={(e) => setFormBonus(e.target.value)} />
        <input data-testid="input-offer-equity" type="number" placeholder="Equity" value={formEquity} onChange={(e) => setFormEquity(e.target.value)} />
        <input data-testid="input-offer-benefits" type="number" placeholder="Benefits" value={formBenefits} onChange={(e) => setFormBenefits(e.target.value)} />
        <input data-testid="input-offer-location" type="text" placeholder="Location" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
        <input data-testid="input-offer-remote" type="checkbox" checked={formRemote} onChange={(e) => setFormRemote(e.target.checked)} />
        <button data-testid="add-offer-btn" onClick={handleAdd}>Add Offer</button>
      </div>

      <table data-testid="comparison-table">
        <thead>
          <tr><th>Company</th><th>Total Comp</th></tr>
        </thead>
        <tbody>
          {sortedOffers.map((o) => (
            <tr key={o.id}>
              <td>{o.company}</td>
              <td>{totalComp(o)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
