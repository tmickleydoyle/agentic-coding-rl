import React, { useState } from "react";
import { getResidents, addResident } from "../../lib/store";

export function DirectoryPage() {
  const [, setTick] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState("");

  const residents = getResidents();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addResident(name.trim(), address.trim(), phone.trim(), parseInt(moveIn, 10) || 2024);
    setName(""); setAddress(""); setPhone(""); setMoveIn("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="directory-page">
      <h2>Resident Directory</h2>
      <form data-testid="resident-form" onSubmit={handleSubmit}>
        <input data-testid="resident-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="resident-address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input data-testid="resident-phone" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input data-testid="resident-movein" type="number" placeholder="Move-in year" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} />
        <button data-testid="resident-submit" type="submit">Add Resident</button>
      </form>
      {residents.map((r) => (
        <div key={r.id} data-testid={`resident-row-${r.id}`}>
          <span data-testid={`resident-name-${r.id}`}>{r.name}</span>
          <span data-testid={`resident-address-${r.id}`}>{r.address}</span>
          <span data-testid={`resident-phone-${r.id}`}>{r.phone}</span>
        </div>
      ))}
    </div>
  );
}
