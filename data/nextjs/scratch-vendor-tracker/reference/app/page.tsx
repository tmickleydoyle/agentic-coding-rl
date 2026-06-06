import React, { useState } from "react";

interface Vendor {
  id: number;
  name: string;
  category: string;
  contact: string;
  phone: string;
  contractSigned: boolean;
  totalCost: number;
  amountPaid: number;
}

const SEED_VENDORS: Vendor[] = [
  { id: 1, name: "Grand Ballroom Venue", category: "Venue", contact: "Jane Doe", phone: "555-1001", contractSigned: true, totalCost: 8000, amountPaid: 4000 },
  { id: 2, name: "Gourmet Catering Co", category: "Catering", contact: "Tom Chef", phone: "555-2002", contractSigned: true, totalCost: 5000, amountPaid: 2500 },
  { id: 3, name: "Clicks Photography", category: "Photography", contact: "Sara Lens", phone: "555-3003", contractSigned: false, totalCost: 3000, amountPaid: 0 },
  { id: 4, name: "Beats DJ Services", category: "Entertainment", contact: "Mike Spin", phone: "555-4004", contractSigned: true, totalCost: 1500, amountPaid: 1500 },
  { id: 5, name: "Bloom Florals", category: "Flowers", contact: "Amy Bloom", phone: "555-5005", contractSigned: false, totalCost: 2000, amountPaid: 500 },
];

type Filter = "All" | "Contract Pending" | "Contract Signed";

interface FormState {
  name: string;
  category: string;
  contact: string;
  phone: string;
  contractSigned: boolean;
  totalCost: number;
  amountPaid: number;
}

const emptyForm = (): FormState => ({
  name: "", category: "", contact: "", phone: "",
  contractSigned: false, totalCost: 0, amountPaid: 0,
});

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>(SEED_VENDORS);
  const [filter, setFilter] = useState<Filter>("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const totalBudget = vendors.reduce((s, v) => s + v.totalCost, 0);
  const totalPaid = vendors.reduce((s, v) => s + v.amountPaid, 0);
  const balance = totalBudget - totalPaid;

  const filtered = vendors.filter((v) => {
    if (filter === "Contract Pending") return !v.contractSigned;
    if (filter === "Contract Signed") return v.contractSigned;
    return true;
  });

  const handleDelete = (id: number) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingId(vendor.id);
    setForm({
      name: vendor.name, category: vendor.category, contact: vendor.contact,
      phone: vendor.phone, contractSigned: vendor.contractSigned,
      totalCost: vendor.totalCost, amountPaid: vendor.amountPaid,
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const paid = Math.min(form.amountPaid, form.totalCost);
    if (editingId !== null) {
      setVendors((prev) =>
        prev.map((v) => v.id === editingId ? { ...v, ...form, name: form.name.trim(), amountPaid: paid } : v)
      );
    } else {
      const maxId = vendors.reduce((m, v) => Math.max(m, v.id), 0);
      setVendors((prev) => [...prev, { id: maxId + 1, ...form, name: form.name.trim(), amountPaid: paid }]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Vendor Tracker</h1>

      <div data-testid="summary" style={{ marginBottom: 16, fontWeight: "bold" }}>
        Total Budget: ${totalBudget} | Total Paid: ${totalPaid} | Balance: ${balance}
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        {(["All", "Contract Pending", "Contract Signed"] as Filter[]).map((f) => (
          <button
            key={f}
            data-testid={`filter-${f.toLowerCase().replace(/ /g, "-")}`}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, marginBottom: 16 }}>
        {filtered.map((vendor) => {
          const vendorBalance = vendor.totalCost - vendor.amountPaid;
          return (
            <div
              key={vendor.id}
              data-testid={`vendor-card-${vendor.id}`}
              style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{vendor.name}</h3>
              <p style={{ margin: "2px 0" }}>Category: {vendor.category}</p>
              <p style={{ margin: "2px 0" }}>Contact: {vendor.contact}</p>
              <p style={{ margin: "2px 0" }}>Phone: {vendor.phone}</p>
              <span
                data-testid={`contract-badge-${vendor.id}`}
                style={{
                  display: "inline-block", marginBottom: 8, padding: "2px 8px", borderRadius: 4,
                  background: vendor.contractSigned ? "#d4edda" : "#fff3cd",
                  color: vendor.contractSigned ? "#155724" : "#856404",
                }}
              >
                {vendor.contractSigned ? "Signed" : "Pending"}
              </span>
              <div data-testid={`vendor-balance-${vendor.id}`} style={{ marginBottom: 8 }}>
                Total: ${vendor.totalCost} | Paid: ${vendor.amountPaid} | Balance: ${vendorBalance}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button data-testid={`edit-btn-${vendor.id}`} onClick={() => handleEdit(vendor)}>Edit</button>
                <button data-testid={`delete-btn-${vendor.id}`} onClick={() => handleDelete(vendor.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {!showForm && (
        <button data-testid="add-vendor-btn" onClick={handleAdd}>Add Vendor</button>
      )}

      {showForm && (
        <div data-testid="vendor-form" style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4 }}>
          <h3>{editingId !== null ? "Edit Vendor" : "Add Vendor"}</h3>
          {[
            ["Name", "name", "text"],
            ["Category", "category", "text"],
            ["Contact", "contact", "text"],
            ["Phone", "phone", "text"],
          ].map(([label, field, type]) => (
            <div key={field} style={{ marginBottom: 8 }}>
              <label>
                {label}:{" "}
                <input
                  type={type}
                  aria-label={label}
                  value={(form as Record<string, unknown>)[field] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                />
              </label>
            </div>
          ))}
          <div style={{ marginBottom: 8 }}>
            <label>
              Total Cost:{" "}
              <input
                type="number"
                aria-label="Total Cost"
                value={form.totalCost}
                onChange={(e) => setForm((f) => ({ ...f, totalCost: Number(e.target.value) }))}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Amount Paid:{" "}
              <input
                type="number"
                aria-label="Amount Paid"
                value={form.amountPaid}
                onChange={(e) => setForm((f) => ({ ...f, amountPaid: Number(e.target.value) }))}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Contract Signed:{" "}
              <input
                type="checkbox"
                aria-label="Contract Signed"
                checked={form.contractSigned}
                onChange={(e) => setForm((f) => ({ ...f, contractSigned: e.target.checked }))}
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
