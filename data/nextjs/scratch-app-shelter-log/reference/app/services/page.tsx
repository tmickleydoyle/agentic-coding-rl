import React, { useState } from "react";
import { getServices, getResidents, addService } from "../../lib/store";
import type { ServiceType } from "../../lib/types";

export function ServicesPage() {
  const [, setTick] = useState(0);
  const [residentId, setResidentId] = useState("");
  const [service, setService] = useState<ServiceType>("Meal");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const services = getServices();
  const stayingResidents = getResidents().filter((r) => r.status === "Staying");
  const allResidents = getResidents();

  function getResidentName(id: string) { return allResidents.find((r) => r.id === id)?.name ?? id; }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!residentId || !date) return;
    addService(residentId, service, date, notes.trim());
    setResidentId(""); setDate(""); setNotes(""); setService("Meal");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="services-page">
      <h2>Services</h2>
      <form data-testid="service-form" onSubmit={handleSubmit}>
        <select data-testid="service-resident" value={residentId} onChange={(e) => setResidentId(e.target.value)}>
          <option value="">Select resident</option>
          {stayingResidents.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select data-testid="service-type" value={service} onChange={(e) => setService(e.target.value as ServiceType)}>
          <option value="Meal">Meal</option>
          <option value="Counseling">Counseling</option>
          <option value="Medical">Medical</option>
          <option value="Job Aid">Job Aid</option>
        </select>
        <input data-testid="service-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="service-notes" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button data-testid="service-submit" type="submit">Log Service</button>
      </form>
      {services.map((s) => (
        <div key={s.id} data-testid={`service-row-${s.id}`}>
          <span data-testid={`service-resident-${s.id}`}>{getResidentName(s.residentId)}</span>
          <span data-testid={`service-type-${s.id}`}>{s.service}</span>
          <span data-testid={`service-notes-${s.id}`}>{s.notes}</span>
        </div>
      ))}
    </div>
  );
}
