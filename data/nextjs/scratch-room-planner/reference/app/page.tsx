import React, { useState } from "react";

type RoomType = "Bedroom" | "Living" | "Kitchen" | "Bathroom" | "Dining" | "Office" | "Storage" | "Other";

interface Room {
  id: number;
  name: string;
  type: RoomType;
  width: number;
  length: number;
  floor: number;
  notes: string;
}

const ROOM_TYPES: RoomType[] = ["Bedroom", "Living", "Kitchen", "Bathroom", "Dining", "Office", "Storage", "Other"];

const SEED: Room[] = [
  { id: 1, name: "Master Bedroom", type: "Bedroom", width: 14, length: 16, floor: 2, notes: "Has walk-in closet" },
  { id: 2, name: "Living Room", type: "Living", width: 18, length: 22, floor: 1, notes: "Open plan with dining" },
  { id: 3, name: "Kitchen", type: "Kitchen", width: 12, length: 14, floor: 1, notes: "Galley style" },
  { id: 4, name: "Home Office", type: "Office", width: 10, length: 12, floor: 2, notes: "North-facing window" },
  { id: 5, name: "Guest Bedroom", type: "Bedroom", width: 11, length: 13, floor: 2, notes: "" },
];

export default function App() {
  const [rooms, setRooms] = useState<Room[]>(SEED);
  const [nextId, setNextId] = useState(6);
  const [filterType, setFilterType] = useState("All Types");
  const [filterFloor, setFilterFloor] = useState("All Floors");

  const [name, setName] = useState("");
  const [type, setType] = useState<RoomType>("Bedroom");
  const [width, setWidth] = useState(10);
  const [length, setLength] = useState(10);
  const [floor, setFloor] = useState(1);
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    const newRoom: Room = {
      id: nextId,
      name: name.trim(),
      type,
      width: width < 1 ? 1 : width,
      length: length < 1 ? 1 : length,
      floor: floor < 1 ? 1 : floor,
      notes,
    };
    setRooms([...rooms, newRoom]);
    setNextId(nextId + 1);
    setName("");
    setType("Bedroom");
    setWidth(10);
    setLength(10);
    setFloor(1);
    setNotes("");
  };

  const handleRemove = (id: number) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);

  let displayed = rooms.filter((r) => {
    const typeMatch = filterType === "All Types" || r.type === filterType;
    const floorMatch = filterFloor === "All Floors" || r.floor === Number(filterFloor);
    return typeMatch && floorMatch;
  });

  const totalCount = rooms.length;
  const totalArea = rooms.reduce((sum, r) => sum + r.width * r.length, 0);

  return (
    <div>
      <h1>Room Planner</h1>

      <div data-testid="summary">
        <span data-testid="total-count">Total Rooms: {totalCount}</span>
        <span data-testid="total-area">Total Area: {totalArea} sq ft</span>
      </div>

      <div>
        <h2>Add Room</h2>
        <label htmlFor="r-name">Name</label>
        <input
          id="r-name"
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="r-type">Type</label>
        <select
          id="r-type"
          data-testid="select-type"
          value={type}
          onChange={(e) => setType(e.target.value as RoomType)}
        >
          {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label htmlFor="r-width">Width (ft)</label>
        <input
          id="r-width"
          data-testid="input-width"
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />

        <label htmlFor="r-length">Length (ft)</label>
        <input
          id="r-length"
          data-testid="input-length"
          type="number"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />

        <label htmlFor="r-floor">Floor</label>
        <input
          id="r-floor"
          data-testid="input-floor"
          type="number"
          value={floor}
          onChange={(e) => setFloor(Number(e.target.value))}
        />

        <label htmlFor="r-notes">Notes</label>
        <input
          id="r-notes"
          data-testid="input-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button data-testid="btn-add" onClick={handleAdd}>Add Room</button>
      </div>

      <div>
        <label htmlFor="filter-type">Filter by Type</label>
        <select
          id="filter-type"
          data-testid="filter-type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All Types">All Types</option>
          {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label htmlFor="filter-floor">Filter by Floor</label>
        <select
          id="filter-floor"
          data-testid="filter-floor"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
        >
          <option value="All Floors">All Floors</option>
          {floors.map((f) => <option key={f} value={String(f)}>Floor {f}</option>)}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Dimensions</th>
            <th>Area</th>
            <th>Floor</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="room-list">
          {displayed.map((r) => (
            <tr key={r.id} data-testid={`room-row-${r.id}`}>
              <td data-testid={`room-name-${r.id}`}>{r.name}</td>
              <td data-testid={`room-type-${r.id}`}>{r.type}</td>
              <td data-testid={`room-dimensions-${r.id}`}>{r.width}x{r.length} ft</td>
              <td data-testid={`room-area-${r.id}`}>{r.width * r.length} sq ft</td>
              <td data-testid={`room-floor-${r.id}`}>{r.floor}</td>
              <td data-testid={`room-notes-${r.id}`}>{r.notes}</td>
              <td>
                <button
                  data-testid={`btn-remove-${r.id}`}
                  onClick={() => handleRemove(r.id)}
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
