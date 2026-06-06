import React, { useState } from "react";

interface Warranty {
  id: number;
  product: string;
  brand: string;
  purchaseDate: string;
  warrantyYears: number;
  expiryDate: string;
  notes: string;
}

const SEED: Warranty[] = [
  { id: 1, product: "4K TV", brand: "Sony", purchaseDate: "2022-06-01", warrantyYears: 2, expiryDate: "2024-06-01", notes: "Extended plan purchased" },
  { id: 2, product: "Washing Machine", brand: "Bosch", purchaseDate: "2023-01-15", warrantyYears: 3, expiryDate: "2026-01-15", notes: "" },
  { id: 3, product: "Laptop", brand: "Dell", purchaseDate: "2021-09-10", warrantyYears: 1, expiryDate: "2022-09-10", notes: "" },
  { id: 4, product: "Air Conditioner", brand: "Daikin", purchaseDate: "2023-05-20", warrantyYears: 5, expiryDate: "2028-05-20", notes: "Parts only after year 2" },
  { id: 5, product: "Microwave", brand: "Panasonic", purchaseDate: "2020-11-03", warrantyYears: 2, expiryDate: "2022-11-03", notes: "" },
];

function getStatus(expiryDate: string): "Active" | "Expired" {
  if (!expiryDate) return "Active";
  return new Date(expiryDate) < new Date() ? "Expired" : "Active";
}

export default function App() {
  const [warranties, setWarranties] = useState<Warranty[]>(SEED);
  const [nextId, setNextId] = useState(6);
  const [filter, setFilter] = useState("All");

  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyYears, setWarrantyYears] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    if (!product.trim() || !brand.trim()) return;
    const newWarranty: Warranty = {
      id: nextId,
      product: product.trim(),
      brand: brand.trim(),
      purchaseDate,
      warrantyYears,
      expiryDate,
      notes,
    };
    setWarranties([...warranties, newWarranty]);
    setNextId(nextId + 1);
    setProduct("");
    setBrand("");
    setPurchaseDate("");
    setWarrantyYears(1);
    setExpiryDate("");
    setNotes("");
  };

  const handleDelete = (id: number) => {
    setWarranties(warranties.filter((w) => w.id !== id));
  };

  const filtered = filter === "All"
    ? warranties
    : warranties.filter((w) => getStatus(w.expiryDate) === filter);

  const totalCount = warranties.length;
  const expiredCount = warranties.filter((w) => getStatus(w.expiryDate) === "Expired").length;

  return (
    <div>
      <h1>Warranty Tracker</h1>

      <div data-testid="summary">
        <span data-testid="total-count">Total: {totalCount}</span>
        <span data-testid="expired-count">Expired: {expiredCount}</span>
      </div>

      <div>
        <h2>Add Warranty</h2>
        <label htmlFor="w-product">Product</label>
        <input
          id="w-product"
          data-testid="input-product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <label htmlFor="w-brand">Brand</label>
        <input
          id="w-brand"
          data-testid="input-brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <label htmlFor="w-purchase-date">Purchase Date</label>
        <input
          id="w-purchase-date"
          data-testid="input-purchase-date"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />

        <label htmlFor="w-years">Warranty Years</label>
        <input
          id="w-years"
          data-testid="input-warranty-years"
          type="number"
          value={warrantyYears}
          onChange={(e) => setWarrantyYears(Number(e.target.value))}
        />

        <label htmlFor="w-expiry">Expiry Date</label>
        <input
          id="w-expiry"
          data-testid="input-expiry-date"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <label htmlFor="w-notes">Notes</label>
        <input
          id="w-notes"
          data-testid="input-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button data-testid="btn-add" onClick={handleAdd}>Add</button>
      </div>

      <div>
        <label htmlFor="filter-status">Filter</label>
        <select
          id="filter-status"
          data-testid="filter-status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Brand</th>
            <th>Purchase Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="warranty-list">
          {filtered.map((w) => (
            <tr key={w.id} data-testid={`warranty-row-${w.id}`}>
              <td data-testid={`warranty-product-${w.id}`}>{w.product}</td>
              <td data-testid={`warranty-brand-${w.id}`}>{w.brand}</td>
              <td data-testid={`warranty-purchase-${w.id}`}>{w.purchaseDate}</td>
              <td data-testid={`warranty-expiry-${w.id}`}>{w.expiryDate}</td>
              <td data-testid={`warranty-status-${w.id}`}>{getStatus(w.expiryDate)}</td>
              <td data-testid={`warranty-notes-${w.id}`}>{w.notes}</td>
              <td>
                <button
                  data-testid={`btn-delete-${w.id}`}
                  onClick={() => handleDelete(w.id)}
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
