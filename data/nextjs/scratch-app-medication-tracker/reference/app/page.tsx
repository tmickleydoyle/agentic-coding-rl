import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { Medication, DoseLog } from "../lib/types";

function HomePage() {
  const { medications, doseLogs, navigate } = useApp();
  const active = medications.filter((m) => m.active);

  return (
    <div data-testid="home-page">
      <h1>Medication Tracker</h1>
      <p data-testid="med-count">Active medications: {active.length}</p>
      <p data-testid="dose-count">Doses logged: {doseLogs.length}</p>
      <div data-testid="active-meds">
        {active.map((m) => (
          <div key={m.id} data-testid={`active-med-${m.id}`}>
            <span data-testid="med-name">{m.name}</span>
            <span data-testid="med-dosage">{m.dosage}</span>
          </div>
        ))}
      </div>
      <button data-testid="go-add" onClick={() => navigate("add")}>Add Medication</button>
    </div>
  );
}

function AddPage() {
  const { setMedications, navigate } = useApp();
  const [name, setName] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const [frequency, setFrequency] = React.useState("daily");
  const [instructions, setInstructions] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) { setError("Name and dosage are required."); return; }
    const res = await fetch("/api/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, dosage, frequency, instructions }),
    });
    if (res.ok) {
      const all = await fetch("/api/medications");
      const data = await all.json() as { medications: Medication[] };
      setMedications(data.medications);
      navigate("schedule");
    }
  }

  return (
    <div data-testid="add-page">
      <h2>Add Medication</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="add-form">
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Medication name" />
        <input data-testid="input-dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage (e.g. 10mg)" />
        <select data-testid="input-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="twice-daily">Twice Daily</option>
          <option value="weekly">Weekly</option>
          <option value="as-needed">As Needed</option>
        </select>
        <input data-testid="input-instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions" />
        <button type="submit" data-testid="submit-med">Add</button>
      </form>
    </div>
  );
}

function SchedulePage() {
  const { medications, setMedications } = useApp();

  async function handleLog(medId: string) {
    await fetch("/api/medications/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicationId: medId, note: "" }),
    });
  }

  async function handleToggle(id: string) {
    await fetch(`/api/medications?id=${id}`, { method: "PATCH" });
    const all = await fetch("/api/medications");
    const data = await all.json() as { medications: Medication[] };
    setMedications(data.medications);
  }

  return (
    <div data-testid="schedule-page">
      <h2>Medication Schedule</h2>
      {medications.length === 0 && <p data-testid="no-meds">No medications added.</p>}
      <ul data-testid="meds-list">
        {medications.map((m) => (
          <li key={m.id} data-testid={`med-item-${m.id}`}>
            <span data-testid="med-name">{m.name}</span>
            <span data-testid="med-frequency">{m.frequency}</span>
            <span data-testid="med-active">{m.active ? "Active" : "Inactive"}</span>
            <button data-testid={`log-dose-${m.id}`} onClick={() => handleLog(m.id)}>Log Dose</button>
            <button data-testid={`toggle-med-${m.id}`} onClick={() => handleToggle(m.id)}>
              {m.active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LogPage() {
  const { doseLogs } = useApp();
  const sorted = [...doseLogs].sort((a, b) => b.takenAt - a.takenAt);
  return (
    <div data-testid="log-page">
      <h2>Dose Log</h2>
      {sorted.length === 0 && <p data-testid="no-logs">No doses logged.</p>}
      <ul data-testid="dose-logs-list">
        {sorted.map((l) => (
          <li key={l.id} data-testid={`dose-log-${l.id}`}>
            <span data-testid="log-med-name">{l.medicationName}</span>
            <span data-testid="log-taken-at">{new Date(l.takenAt).toLocaleString()}</span>
            <span data-testid="log-note">{l.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shell() {
  const { route, setMedications, setDoseLogs } = useApp();

  useEffect(() => {
    fetch("/api/medications")
      .then((r) => r.json())
      .then((data: { medications: Medication[]; logs: DoseLog[] }) => {
        setMedications(data.medications);
        setDoseLogs(data.logs);
      })
      .catch(() => {});
  }, []);

  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && <HomePage />}
      {route === "add" && <AddPage />}
      {route === "schedule" && <SchedulePage />}
      {route === "log" && <LogPage />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
