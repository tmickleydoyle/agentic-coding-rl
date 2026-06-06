import React, { useState } from "react";

type OfferStatus = "Pending" | "Accepted" | "Rejected" | "Countered";

interface Offer {
  id: number;
  address: string;
  offerPrice: number;
  listPrice: number;
  date: string;
  status: OfferStatus;
  contingencies: string;
}

const SEED_OFFERS: Offer[] = [
  { id: 1, address: "123 Maple St", offerPrice: 460000, listPrice: 450000, date: "2024-03-05", status: "Pending", contingencies: "Inspection, Financing" },
  { id: 2, address: "456 Oak Ave", offerPrice: 315000, listPrice: 320000, date: "2024-03-08", status: "Rejected", contingencies: "None" },
  { id: 3, address: "789 Pine Rd", offerPrice: 680000, listPrice: 675000, date: "2024-03-12", status: "Accepted", contingencies: "Inspection" },
];

function formatPrice(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

let nextId = 4;

export default function App() {
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [address, setAddress] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<OfferStatus>("Pending");
  const [contingencies, setContingencies] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  function handleAdd() {
    if (!address || !offerPrice || !listPrice || !date) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");
    const offer: Offer = {
      id: nextId++,
      address,
      offerPrice: parseFloat(offerPrice),
      listPrice: parseFloat(listPrice),
      date,
      status,
      contingencies: contingencies || "None",
    };
    setOffers([...offers, offer]);
    setAddress("");
    setOfferPrice("");
    setListPrice("");
    setDate("");
    setStatus("Pending");
    setContingencies("");
  }

  function handleDelete(id: number) {
    setOffers(offers.filter((o) => o.id !== id));
  }

  const filtered = filter === "All" ? offers : offers.filter((o) => o.status === filter);

  const totalOffers = offers.length;
  const acceptedCount = offers.filter((o) => o.status === "Accepted").length;
  const avgOffer = totalOffers === 0 ? 0 : Math.round(offers.reduce((s, o) => s + o.offerPrice, 0) / totalOffers);

  function priceDiff(offer: Offer): string {
    const diff = offer.offerPrice - offer.listPrice;
    if (diff === 0) return "$0 at ask";
    if (diff > 0) return `+${formatPrice(diff)} over ask`;
    return `-${formatPrice(Math.abs(diff))} under ask`;
  }

  const statuses: OfferStatus[] = ["Pending", "Accepted", "Rejected", "Countered"];

  return (
    <div>
      <h1>Offer Tracker</h1>

      <div>
        <span data-testid="total-offers">Total: {totalOffers}</span>
        <span data-testid="accepted-count">Accepted: {acceptedCount}</span>
        <span data-testid="avg-offer">Avg Offer: {formatPrice(avgOffer)}</span>
      </div>

      <div>
        <button data-testid="filter-All" onClick={() => setFilter("All")}>All</button>
        {statuses.map((s) => (
          <button key={s} data-testid={`filter-${s}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
        <span data-testid="active-filter">{filter}</span>
      </div>

      <div>
        <h2>Add Offer</h2>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label htmlFor="offer-price">Offer Price</label>
          <input id="offer-price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
        </div>
        <div>
          <label htmlFor="list-price">List Price</label>
          <input id="list-price" type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)} />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as OfferStatus)}>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Countered">Countered</option>
          </select>
        </div>
        <div>
          <label htmlFor="contingencies">Contingencies</label>
          <input id="contingencies" type="text" value={contingencies} onChange={(e) => setContingencies(e.target.value)} />
        </div>
        {error && <div data-testid="form-error">{error}</div>}
        <button onClick={handleAdd}>Add Offer</button>
      </div>

      <div>
        {filtered.map((o) => (
          <div key={o.id} data-testid={`offer-card-${o.id}`}>
            <h3>{o.address}</h3>
            <p>Offer: {formatPrice(o.offerPrice)}</p>
            <p>List: {formatPrice(o.listPrice)}</p>
            <p data-testid={`price-diff-${o.id}`}>{priceDiff(o)}</p>
            <p>{o.date}</p>
            <span data-testid={`status-badge-${o.id}`}>{o.status}</span>
            <p>{o.contingencies}</p>
            <button data-testid={`delete-offer-${o.id}`} onClick={() => handleDelete(o.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
