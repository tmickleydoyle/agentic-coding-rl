import React, { useState } from "react";

type ApplianceType = "Refrigerator" | "Washer" | "Dryer" | "Oven" | "Dishwasher" | "Freezer" | "Microwave" | "Other";
type Status = "Active" | "Needs Repair" | "Retired";

interface Appliance {
  id: number;
  name: string;
  brand: string;
  type: ApplianceType;
  purchaseDate: string;
  price: number;
  status: Status;
}

const TYPES: ApplianceType[] = ["Refrigerator", "Washer", "Dryer", "Oven", "Dishwasher", "Freezer", "Microwave", "Other"];
const STATUSES: Status[] = ["Active", "Needs Repair", "Retired"];

const SEED: Appliance[] = [
  { id: 1, name: "French Door Fridge", brand: "Samsung", type: "Refrigerator", purchaseDate: "2021-03-15", price: 1400, status: "Active" },
  { id: 2, name: "Front Load Washer", brand: "LG", type: "Washer", purchaseDate: "2020-07-22", price: 900, status: "Active" },
  { id: 3, name: "Gas Range", brand: "GE", type: "Oven", purchaseDate: "2019-11-10", price: 750, status: "Active" },
  { id: 4, name: "Dishwasher", brand: "Bosch", type: "Dishwasher", purchaseDate: "2022-01-05", price: 650, status: "Active" },
  { id: 5, name: "Chest Freezer", brand: "Frigidaire", type: "Freezer", purchaseDate: "2018-06-30", price: 400, status: "Retired" },
];

export default function App() {
  const [appliances, setAppliances] = useState<Appliance[]>(SEED);
  const [nextId, setNextId] = useState(6);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState<ApplianceType>("Refrigerator");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<Status>("Active");

  const handleAdd = () => {
    if (!name.trim() || !brand.trim()) return;
    const newAppliance: Appliance = {
      id: nextId,
      name: name.trim(),
      brand: brand.trim(),
      type,
      purchaseDate,
      price: price < 0 ? 0 : price,
      status,
    };
    setAppliances([...appliances, newAppliance]);
    setNextId(nextId + 1);
    setName("");
    setBrand("");
    setType("Refrigerator");
    setPurchaseDate("");
    setPrice(0);
    setStatus("Active");
  };

  const handleRemove = (id: number) => {
    setAppliances(appliances.filter((a) => a.id !== id));
  };

  const handleStatusChange = (id: number, newStatus: Status) => {
    setAppliances(appliances.map((a) => a.id === id ? { ...a, status: newStatus } : a));
  };

  const filtered = filterStatus === "All"
    ? appliances
    : appliances.filter((a) => a.status === filterStatus);

  const totalCount = appliances.length;
  const activeCount = appliances.filter((a) => a.status === "Active").length;

  return (
    <div>
      <h1>Appliance Log</h1>

      <div data-testid="summary">
        <span data-testid="total-count">Total: {totalCount}</span>
        <span data-testid="active-count">Active: {activeCount}</span>
      </div>

      <div>
        <h2>Add Appliance</h2>
        <label htmlFor="app-name">Name</label>
        <input
          id="app-name"
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="app-brand">Brand</label>
        <input
          id="app-brand"
          data-testid="input-brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <label htmlFor="app-type">Type</label>
        <select
          id="app-type"
          data-testid="select-type"
          value={type}
          onChange={(e) => setType(e.target.value as ApplianceType)}
        >
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label htmlFor="app-date">Purchase Date</label>
        <input
          id="app-date"
          data-testid="input-date"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />

        <label htmlFor="app-price">Purchase Price ($)</label>
        <input
          id="app-price"
          data-testid="input-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <label htmlFor="app-status">Status</label>
        <select
          id="app-status"
          data-testid="select-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button data-testid="btn-add" onClick={handleAdd}>Add Appliance</button>
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
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Purchase Date</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="appliance-list">
          {filtered.map((a) => (
            <tr key={a.id} data-testid={`appliance-row-${a.id}`}>
              <td data-testid={`appliance-name-${a.id}`}>{a.name}</td>
              <td data-testid={`appliance-brand-${a.id}`}>{a.brand}</td>
              <td data-testid={`appliance-type-${a.id}`}>{a.type}</td>
              <td data-testid={`appliance-date-${a.id}`}>{a.purchaseDate}</td>
              <td data-testid={`appliance-price-${a.id}`}>${a.price}</td>
              <td>
                <select
                  data-testid={`appliance-status-${a.id}`}
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value as Status)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>
                <button
                  data-testid={`btn-remove-${a.id}`}
                  onClick={() => handleRemove(a.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
