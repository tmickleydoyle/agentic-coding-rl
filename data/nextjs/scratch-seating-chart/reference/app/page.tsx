import React, { useState } from "react";

interface Table {
  id: number;
  name: string;
  capacity: number;
}

interface Guest {
  id: number;
  name: string;
  tableId: number | null;
}

const SEED_TABLES: Table[] = [
  { id: 1, name: "Head Table", capacity: 6 },
  { id: 2, name: "Family Table", capacity: 8 },
  { id: 3, name: "Friends Table", capacity: 8 },
  { id: 4, name: "Coworkers", capacity: 6 },
];

const SEED_GUESTS: Guest[] = [
  { id: 1, name: "Alice Johnson", tableId: 1 },
  { id: 2, name: "Bob Smith", tableId: null },
  { id: 3, name: "Carol White", tableId: 1 },
  { id: 4, name: "David Brown", tableId: 2 },
  { id: 5, name: "Emma Davis", tableId: null },
  { id: 6, name: "Frank Miller", tableId: 2 },
  { id: 7, name: "Grace Lee", tableId: 3 },
  { id: 8, name: "Henry Wilson", tableId: null },
];

export default function App() {
  const [tables, setTables] = useState<Table[]>(SEED_TABLES);
  const [guests, setGuests] = useState<Guest[]>(SEED_GUESTS);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [assignSelections, setAssignSelections] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    SEED_GUESTS.forEach((g) => { if (g.tableId === null) init[g.id] = SEED_TABLES[0].id; });
    return init;
  });

  const unassigned = guests.filter((g) => g.tableId === null);
  const assigned = guests.filter((g) => g.tableId !== null);
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);

  const handleAssign = (guestId: number) => {
    const tableId = assignSelections[guestId] ?? tables[0]?.id;
    if (tableId === undefined) return;
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    const currentCount = guests.filter((g) => g.tableId === tableId).length;
    if (currentCount >= table.capacity) return;
    setGuests((prev) => prev.map((g) => g.id === guestId ? { ...g, tableId } : g));
  };

  const handleRemove = (guestId: number) => {
    setGuests((prev) => prev.map((g) => g.id === guestId ? { ...g, tableId: null } : g));
    // add to assign selections if not already there
    setAssignSelections((prev) => ({ ...prev, [guestId]: tables[0]?.id ?? 1 }));
  };

  const handleSaveTable = () => {
    if (!formName.trim()) return;
    const cap = parseInt(formCapacity, 10);
    if (isNaN(cap) || cap <= 0) return;
    const maxId = tables.reduce((m, t) => Math.max(m, t.id), 0);
    setTables((prev) => [...prev, { id: maxId + 1, name: formName.trim(), capacity: cap }]);
    setFormName("");
    setFormCapacity("");
    setShowForm(false);
  };

  const handleCancelTable = () => {
    setShowForm(false);
    setFormName("");
    setFormCapacity("");
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Seating Chart</h1>

      <div data-testid="seating-summary" style={{ marginBottom: 16, fontWeight: "bold" }}>
        Total Seats: {totalSeats} | Assigned: {assigned.length} | Unassigned: {unassigned.length}
      </div>

      <div data-testid="unassigned-section" style={{ marginBottom: 24, border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <h2>Unassigned Guests</h2>
        {unassigned.length === 0 && <p>All guests are seated.</p>}
        {unassigned.map((guest) => (
          <div
            key={guest.id}
            data-testid={`unassigned-guest-${guest.id}`}
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
          >
            <span style={{ flex: 1 }}>{guest.name}</span>
            <select
              data-testid={`assign-select-${guest.id}`}
              value={assignSelections[guest.id] ?? tables[0]?.id}
              onChange={(e) =>
                setAssignSelections((prev) => ({ ...prev, [guest.id]: Number(e.target.value) }))
              }
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button data-testid={`assign-btn-${guest.id}`} onClick={() => handleAssign(guest.id)}>
              Assign
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
        {tables.map((table) => {
          const tableGuests = guests.filter((g) => g.tableId === table.id);
          return (
            <div
              key={table.id}
              data-testid={`table-card-${table.id}`}
              style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12 }}
            >
              <h3 data-testid={`table-heading-${table.id}`} style={{ margin: "0 0 8px 0" }}>
                {table.name} ({tableGuests.length}/{table.capacity})
              </h3>
              {tableGuests.map((g) => (
                <div
                  key={g.id}
                  data-testid={`table-guest-${table.id}-${g.id}`}
                  style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}
                >
                  <span style={{ flex: 1 }}>{g.name}</span>
                  <button data-testid={`remove-btn-${g.id}`} onClick={() => handleRemove(g.id)}>
                    Remove
                  </button>
                </div>
              ))}
              {tableGuests.length === 0 && (
                <p style={{ color: "#888", fontSize: 13 }}>No guests assigned.</p>
              )}
            </div>
          );
        })}
      </div>

      {!showForm && (
        <button data-testid="add-table-btn" onClick={() => setShowForm(true)}>Add Table</button>
      )}

      {showForm && (
        <div data-testid="table-form" style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4 }}>
          <h3>Add Table</h3>
          <div style={{ marginBottom: 8 }}>
            <label>
              Table Name:{" "}
              <input
                type="text"
                aria-label="Table Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Capacity:{" "}
              <input
                type="number"
                aria-label="Capacity"
                value={formCapacity}
                onChange={(e) => setFormCapacity(e.target.value)}
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSaveTable}>Save</button>
            <button onClick={handleCancelTable}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
