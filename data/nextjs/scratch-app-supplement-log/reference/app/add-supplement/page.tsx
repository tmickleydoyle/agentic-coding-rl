import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Frequency } from "../../lib/types";

export function AddSupplementPage() {
  const { handleAddSupplement } = useApp();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    setError("");
    handleAddSupplement({ name: name.trim(), dosage, frequency, notes });
  };

  return (
    <div>
      <h1>Add Supplement</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="add-supplement-form" onSubmit={handleSubmit}>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Supplement name" />
        <input data-testid="input-dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage (e.g. 500mg)" />
        <select data-testid="select-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
          <option value="daily">daily</option>
          <option value="twice-daily">twice-daily</option>
          <option value="weekly">weekly</option>
          <option value="as-needed">as-needed</option>
        </select>
        <input data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button type="submit" data-testid="submit-btn">Add Supplement</button>
      </form>
    </div>
  );
}
