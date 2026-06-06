import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { Supplement, DoseLog } from "../../lib/types";

export function SchedulePage() {
  const { supplements, todayLogs, handleDeleteSupplement } = useApp();
  const takenIds = new Set(todayLogs.filter((l: DoseLog) => l.taken).map((l: DoseLog) => l.supplementId));
  const takenCount = supplements.filter((s: Supplement) => takenIds.has(s.id)).length;
  return (
    <div>
      <h1>Supplement Schedule</h1>
      <p data-testid="total-supplements">{supplements.length} supplements</p>
      <p data-testid="taken-count">{takenCount} taken today</p>
      {supplements.map((s: Supplement) => (
        <div key={s.id} data-testid="supplement-item">
          <span>{s.name} — {s.dosage} ({s.frequency}) {takenIds.has(s.id) ? "✓" : ""}</span>
          <button data-testid={`delete-supplement-${s.id}`} onClick={() => handleDeleteSupplement(s.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
