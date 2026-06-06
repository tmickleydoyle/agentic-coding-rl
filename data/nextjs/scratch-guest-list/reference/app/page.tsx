import React, { useState } from "react";

type RSVP = "confirmed" | "pending" | "declined";
type Meal = "chicken" | "fish" | "vegetarian";

interface Guest {
  id: number;
  name: string;
  email: string;
  rsvp: RSVP;
  meal: Meal;
  plusOne: boolean;
}

const SEED_GUESTS: Guest[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", rsvp: "confirmed", meal: "chicken", plusOne: true },
  { id: 2, name: "Bob Smith", email: "bob@example.com", rsvp: "pending", meal: "vegetarian", plusOne: false },
  { id: 3, name: "Carol White", email: "carol@example.com", rsvp: "confirmed", meal: "fish", plusOne: true },
  { id: 4, name: "David Brown", email: "david@example.com", rsvp: "declined", meal: "chicken", plusOne: false },
  { id: 5, name: "Emma Davis", email: "emma@example.com", rsvp: "pending", meal: "vegetarian", plusOne: false },
  { id: 6, name: "Frank Miller", email: "frank@example.com", rsvp: "confirmed", meal: "chicken", plusOne: true },
];

type Filter = "All" | "Confirmed" | "Pending" | "Declined";

interface FormState {
  name: string;
  email: string;
  rsvp: RSVP;
  meal: Meal;
  plusOne: boolean;
}

const emptyForm = (): FormState => ({ name: "", email: "", rsvp: "pending", meal: "chicken", plusOne: false });

export default function App() {
  const [guests, setGuests] = useState<Guest[]>(SEED_GUESTS);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const confirmed = guests.filter((g) => g.rsvp === "confirmed").length;
  const pending = guests.filter((g) => g.rsvp === "pending").length;
  const declined = guests.filter((g) => g.rsvp === "declined").length;

  const filtered = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Confirmed" && g.rsvp === "confirmed") ||
      (filter === "Pending" && g.rsvp === "pending") ||
      (filter === "Declined" && g.rsvp === "declined");
    return matchesSearch && matchesFilter;
  });

  const handleRemove = (id: number) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setForm({ name: guest.name, email: guest.email, rsvp: guest.rsvp, meal: guest.meal, plusOne: guest.plusOne });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId !== null) {
      setGuests((prev) =>
        prev.map((g) => (g.id === editingId ? { ...g, ...form, name: form.name.trim() } : g))
      );
    } else {
      const maxId = guests.reduce((m, g) => Math.max(m, g.id), 0);
      setGuests((prev) => [...prev, { id: maxId + 1, ...form, name: form.name.trim() }]);
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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Guest List</h1>

      <div data-testid="stats" style={{ marginBottom: 16 }}>
        Total: {guests.length} | Confirmed: {confirmed} | Pending: {pending} | Declined: {declined}
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <input
          type="text"
          aria-label="Search guests"
          placeholder="Search guests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "4px 8px" }}
        />
        {(["All", "Confirmed", "Pending", "Declined"] as Filter[]).map((f) => (
          <button
            key={f}
            data-testid={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}
          >
            {f}
          </button>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr>
            {["Name", "Email", "RSVP", "Meal", "Plus One", "Actions"].map((h) => (
              <th key={h} style={{ textAlign: "left", borderBottom: "2px solid #ccc", padding: "4px 8px" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((guest) => (
            <tr key={guest.id} data-testid={`guest-row-${guest.id}`}>
              <td style={{ padding: "4px 8px" }}>{guest.name}</td>
              <td style={{ padding: "4px 8px" }}>{guest.email}</td>
              <td data-testid={`rsvp-${guest.id}`} style={{ padding: "4px 8px" }}>{guest.rsvp}</td>
              <td data-testid={`meal-${guest.id}`} style={{ padding: "4px 8px" }}>{guest.meal}</td>
              <td data-testid={`plusone-${guest.id}`} style={{ padding: "4px 8px" }}>{guest.plusOne ? "Yes" : "No"}</td>
              <td style={{ padding: "4px 8px", display: "flex", gap: 4 }}>
                <button data-testid={`edit-btn-${guest.id}`} onClick={() => handleEdit(guest)}>Edit</button>
                <button data-testid={`remove-btn-${guest.id}`} onClick={() => handleRemove(guest.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!showForm && (
        <button data-testid="add-guest-btn" onClick={handleAdd}>Add Guest</button>
      )}

      {showForm && (
        <div data-testid="guest-form" style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4 }}>
          <h3>{editingId !== null ? "Edit Guest" : "Add Guest"}</h3>
          <div style={{ marginBottom: 8 }}>
            <label>
              Name:{" "}
              <input
                type="text"
                aria-label="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Email:{" "}
              <input
                type="text"
                aria-label="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              RSVP:{" "}
              <select
                aria-label="RSVP"
                value={form.rsvp}
                onChange={(e) => setForm((f) => ({ ...f, rsvp: e.target.value as RSVP }))}
              >
                <option value="confirmed">confirmed</option>
                <option value="pending">pending</option>
                <option value="declined">declined</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Meal:{" "}
              <select
                aria-label="Meal"
                value={form.meal}
                onChange={(e) => setForm((f) => ({ ...f, meal: e.target.value as Meal }))}
              >
                <option value="chicken">chicken</option>
                <option value="fish">fish</option>
                <option value="vegetarian">vegetarian</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Plus One:{" "}
              <input
                type="checkbox"
                aria-label="Plus One"
                checked={form.plusOne}
                onChange={(e) => setForm((f) => ({ ...f, plusOne: e.target.checked }))}
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
