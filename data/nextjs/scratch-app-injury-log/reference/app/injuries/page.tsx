import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { InjuryType, Severity } from "../../lib/types";

export default function InjuriesPage() {
  const { injuries, addInjury, deleteInjury, activeInjuryId, setActiveInjuryId } = useApp();
  const [bodyPart, setBodyPart] = useState("");
  const [type, setType] = useState<InjuryType>("strain");
  const [severity, setSeverity] = useState<Severity>("mild");
  const [date, setDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addInjury(bodyPart, type, severity, date);
    setBodyPart("");
    setDate("");
  }

  return (
    <div data-testid="injuries-page">
      <h1>Injuries</h1>
      <form data-testid="add-injury-form" onSubmit={handleSubmit}>
        <input data-testid="input-body-part" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)} placeholder="Body part" />
        <select data-testid="input-injury-type" value={type} onChange={(e) => setType(e.target.value as InjuryType)}>
          <option value="strain">Strain</option>
          <option value="sprain">Sprain</option>
          <option value="fracture">Fracture</option>
          <option value="bruise">Bruise</option>
        </select>
        <select data-testid="input-severity" value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        <input data-testid="input-injury-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" data-testid="btn-add-injury">Add</button>
      </form>
      <ul data-testid="injury-list">
        {injuries.map((i) => (
          <li key={i.id} data-testid={`injury-item-${i.id}`}>
            <button data-testid={`btn-select-injury-${i.id}`} onClick={() => setActiveInjuryId(i.id)}>
              <span data-testid={`injury-body-part-${i.id}`}>{i.bodyPart}</span>
            </button>
            {activeInjuryId === i.id && <span data-testid="active-injury-indicator"> (active)</span>}
            <span data-testid={`injury-type-${i.id}`}>{i.type}</span>
            <span data-testid={`injury-severity-${i.id}`}>{i.severity}</span>
            <button data-testid={`btn-delete-injury-${i.id}`} onClick={() => deleteInjury(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
