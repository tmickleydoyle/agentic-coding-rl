import React, { useState } from "react";
import { getBeds, getResidents, assignBed } from "../../lib/store";

export function BedsPage() {
  const [, setTick] = useState(0);
  const [assigningBedId, setAssigningBedId] = useState<string | null>(null);
  const [selectedResident, setSelectedResident] = useState("");

  const beds = getBeds();
  const stayingResidents = getResidents().filter((r) => r.status === "Staying");
  const residents = getResidents();

  function getResidentName(id: string | null) {
    if (!id) return "Empty";
    return residents.find((r) => r.id === id)?.name ?? id;
  }

  function handleAssign(bedId: string) {
    if (!selectedResident) return;
    assignBed(bedId, selectedResident);
    setAssigningBedId(null); setSelectedResident("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="beds-page">
      <h2>Beds</h2>
      {beds.map((b) => (
        <div key={b.id} data-testid={`bed-row-${b.id}`}>
          <span data-testid={`bed-number-${b.id}`}>{b.bedNumber}</span>
          <span data-testid={`bed-wing-${b.id}`}>{b.wing}</span>
          <span data-testid={`bed-occupant-${b.id}`}>{getResidentName(b.residentId)}</span>
          {!b.occupied && (
            <>
              <button data-testid={`assign-btn-${b.id}`} onClick={() => setAssigningBedId(b.id)}>Assign</button>
              {assigningBedId === b.id && (
                <div data-testid={`assign-form-${b.id}`}>
                  <select data-testid="assign-resident-select" value={selectedResident} onChange={(e) => setSelectedResident(e.target.value)}>
                    <option value="">Select resident</option>
                    {stayingResidents.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <button data-testid="assign-confirm" onClick={() => handleAssign(b.id)}>Confirm</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
