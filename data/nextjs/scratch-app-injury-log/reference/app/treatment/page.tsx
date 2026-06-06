import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { TreatmentType } from "../../lib/types";

export default function TreatmentPage() {
  const { injuries, activeInjuryId, addTreatment } = useApp();
  const [type, setType] = useState<TreatmentType>("ice");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  const activeInjury = injuries.find((i) => i.id === activeInjuryId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeInjuryId) return;
    addTreatment(activeInjuryId, type, date, Number(duration));
    setDate("");
    setDuration("");
  }

  if (!activeInjury) {
    return (
      <div data-testid="treatment-page">
        <h1>Treatment</h1>
        <p data-testid="no-active-injury">No active injury</p>
      </div>
    );
  }

  return (
    <div data-testid="treatment-page">
      <h1>Treatment — {activeInjury.bodyPart}</h1>
      <form data-testid="add-treatment-form" onSubmit={handleSubmit}>
        <select data-testid="input-treatment-type" value={type} onChange={(e) => setType(e.target.value as TreatmentType)}>
          <option value="ice">Ice</option>
          <option value="physio">Physio</option>
          <option value="rest">Rest</option>
          <option value="medication">Medication</option>
        </select>
        <input data-testid="input-treatment-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (min)" />
        <button type="submit" data-testid="btn-add-treatment">Add</button>
      </form>
      <ul data-testid="treatment-list">
        {activeInjury.treatments.map((t) => (
          <li key={t.id} data-testid={`treatment-item-${t.id}`}>
            <span data-testid={`treatment-type-${t.id}`}>{t.type}</span>
            <span data-testid={`treatment-duration-${t.id}`}>{t.duration} min</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
