import React, { useState } from "react";

type RepairStatus = "Pending" | "In Progress" | "Completed";
type SortOption = "date-desc" | "cost-desc";

interface Repair {
  id: number;
  item: string;
  location: string;
  description: string;
  date: string;
  cost: number;
  contractor: string;
  status: RepairStatus;
}

const STATUSES: RepairStatus[] = ["Pending", "In Progress", "Completed"];

const SEED: Repair[] = [
  { id: 1, item: "Roof Leak", location: "Attic", description: "Replaced 3 shingles", date: "2023-04-12", cost: 450, contractor: "Bob's Roofing", status: "Completed" },
  { id: 2, item: "Water Heater", location: "Basement", description: "Replaced thermocouple", date: "2023-07-08", cost: 180, contractor: "DIY", status: "Completed" },
  { id: 3, item: "HVAC Filter", location: "Living Room", description: "Replaced air filter", date: "2024-01-20", cost: 35, contractor: "DIY", status: "Completed" },
  { id: 4, item: "Kitchen Sink", location: "Kitchen", description: "Fixed dripping faucet", date: "2024-03-05", cost: 120, contractor: "Plumb Right", status: "Completed" },
  { id: 5, item: "Garage Door", location: "Garage", description: "Spring replacement needed", date: "2024-05-10", cost: 0, contractor: "TBD", status: "Pending" },
];

export default function App() {
  const [repairs, setRepairs] = useState<Repair[]>(SEED);
  const [nextId, setNextId] = useState(6);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const [item, setItem] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState(0);
  const [contractor, setContractor] = useState("");
  const [status, setStatus] = useState<RepairStatus>("Pending");

  const handleAdd = () => {
    if (!item.trim() || !location.trim()) return;
    const newRepair: Repair = {
      id: nextId,
      item: item.trim(),
      location: location.trim(),
      description,
      date,
      cost: cost < 0 ? 0 : cost,
      contractor,
      status,
    };
    setRepairs([...repairs, newRepair]);
    setNextId(nextId + 1);
    setItem("");
    setLocation("");
    setDescription("");
    setDate("");
    setCost(0);
    setContractor("");
    setStatus("Pending");
  };

  const handleDelete = (id: number) => {
    setRepairs(repairs.filter((r) => r.id !== id));
  };

  let displayed = filterStatus === "All"
    ? [...repairs]
    : repairs.filter((r) => r.status === filterStatus);

  if (sortBy === "date-desc") {
    displayed.sort((a, b) => b.date.localeCompare(a.date));
  } else {
    displayed.sort((a, b) => b.cost - a.cost);
  }

  const totalCount = repairs.length;
  const totalCost = repairs.reduce((sum, r) => sum + r.cost, 0);

  return (
    <div>
      <h1>Repair History</h1>

      <div data-testid="summary">
        <span data-testid="total-count">Total Repairs: {totalCount}</span>
        <span data-testid="total-cost">Total Cost: ${totalCost}</span>
      </div>

      <div>
        <h2>Add Repair</h2>
        <label htmlFor="r-item">Item</label>
        <input
          id="r-item"
          data-testid="input-item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />

        <label htmlFor="r-location">Location</label>
        <input
          id="r-location"
          data-testid="input-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor="r-description">Description</label>
        <input
          id="r-description"
          data-testid="input-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="r-date">Date</label>
        <input
          id="r-date"
          data-testid="input-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="r-cost">Cost ($)</label>
        <input
          id="r-cost"
          data-testid="input-cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
        />

        <label htmlFor="r-contractor">Contractor</label>
        <input
          id="r-contractor"
          data-testid="input-contractor"
          value={contractor}
          onChange={(e) => setContractor(e.target.value)}
        />

        <label htmlFor="r-status">Status</label>
        <select
          id="r-status"
          data-testid="select-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as RepairStatus)}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button data-testid="btn-add" onClick={handleAdd}>Add Repair</button>
      </div>

      <div>
        <label htmlFor="filter-status">Filter by Status</label>
        <select
          id="filter-status"
          data-testid="filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          data-testid="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="date-desc">Date (newest first)</option>
          <option value="cost-desc">Cost (highest first)</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Location</th>
            <th>Description</th>
            <th>Date</th>
            <th>Cost</th>
            <th>Contractor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="repair-list">
          {displayed.map((r) => (
            <tr key={r.id} data-testid={`repair-row-${r.id}`}>
              <td data-testid={`repair-item-${r.id}`}>{r.item}</td>
              <td data-testid={`repair-location-${r.id}`}>{r.location}</td>
              <td data-testid={`repair-description-${r.id}`}>{r.description}</td>
              <td data-testid={`repair-date-${r.id}`}>{r.date}</td>
              <td data-testid={`repair-cost-${r.id}`}>${r.cost}</td>
              <td data-testid={`repair-contractor-${r.id}`}>{r.contractor}</td>
              <td data-testid={`repair-status-${r.id}`}>{r.status}</td>
              <td>
                <button
                  data-testid={`btn-delete-${r.id}`}
                  onClick={() => handleDelete(r.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
