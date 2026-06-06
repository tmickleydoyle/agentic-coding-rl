import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { Allergy, ReactionLog } from "../lib/types";

function HomePage() {
  const { allergies, reactions, navigate } = useApp();
  const severe = allergies.filter((a) => a.severity === "severe");
  return (
    <div data-testid="home-page">
      <h1>Allergy Log</h1>
      <p data-testid="allergy-count">Total allergies: {allergies.length}</p>
      <p data-testid="reaction-count">Total reactions: {reactions.length}</p>
      <p data-testid="severe-count">Severe allergies: {severe.length}</p>
      <div data-testid="allergy-list">
        {allergies.map((a) => (
          <div key={a.id} data-testid={`allergy-summary-${a.id}`}>
            <span data-testid="allergy-name">{a.name}</span>
            <span data-testid="allergy-severity">{a.severity}</span>
          </div>
        ))}
      </div>
      <button data-testid="go-add" onClick={() => navigate("add")}>Add Allergy</button>
    </div>
  );
}

function AddPage() {
  const { setAllergies, navigate } = useApp();
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("food");
  const [severity, setSeverity] = React.useState("mild");
  const [symptoms, setSymptoms] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    const res = await fetch("/api/allergies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, type, severity,
        symptoms: symptoms.split(",").map((s) => s.trim()).filter(Boolean),
        notes,
      }),
    });
    if (res.ok) {
      const all = await fetch("/api/allergies");
      const data = await all.json() as { allergies: Allergy[] };
      setAllergies(data.allergies);
      navigate("home");
    }
  }

  return (
    <div data-testid="add-page">
      <h2>Add Allergy</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="add-form">
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Allergen name" />
        <select data-testid="input-type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="food">Food</option>
          <option value="medication">Medication</option>
          <option value="environmental">Environmental</option>
          <option value="insect">Insect</option>
          <option value="other">Other</option>
        </select>
        <select data-testid="input-severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        <input data-testid="input-symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Symptoms (comma separated)" />
        <textarea data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button type="submit" data-testid="submit-allergy">Add</button>
      </form>
    </div>
  );
}

function ReactionsPage() {
  const { reactions, allergies, setReactions } = useApp();
  const sorted = [...reactions].sort((a, b) => b.createdAt - a.createdAt);
  const [allergyId, setAllergyId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [symptoms, setSymptoms] = React.useState("");
  const [severity, setSeverity] = React.useState("mild");
  const [treatment, setTreatment] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!allergyId || !date) { setError("Allergy and date required."); return; }
    const res = await fetch("/api/allergies/reaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allergyId, date, symptoms: symptoms.split(",").map((s) => s.trim()).filter(Boolean), severity, treatment }),
    });
    if (res.ok) {
      const all = await fetch("/api/allergies");
      const data = await all.json() as { reactions: ReactionLog[] };
      setReactions(data.reactions);
    }
  }

  return (
    <div data-testid="reactions-page">
      <h2>Reactions</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleLog} data-testid="reaction-form">
        <select data-testid="input-allergy-id" value={allergyId} onChange={(e) => setAllergyId(e.target.value)}>
          <option value="">Select allergy...</option>
          {allergies.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <input type="date" data-testid="input-reaction-date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-reaction-symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Symptoms" />
        <select data-testid="input-reaction-severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        <input data-testid="input-treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="Treatment" />
        <button type="submit" data-testid="submit-reaction">Log Reaction</button>
      </form>
      {sorted.length === 0 && <p data-testid="no-reactions">No reactions logged.</p>}
      <ul data-testid="reactions-list">
        {sorted.map((r) => (
          <li key={r.id} data-testid={`reaction-item-${r.id}`}>
            <span data-testid="reaction-allergy">{r.allergyName}</span>
            <span data-testid="reaction-date">{r.date}</span>
            <span data-testid="reaction-severity">{r.severity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TriggersPage() {
  const { reactions } = useApp();
  const counts: Record<string, number> = {};
  reactions.forEach((r) => { counts[r.allergyName] = (counts[r.allergyName] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div data-testid="triggers-page">
      <h2>Top Triggers</h2>
      {sorted.length === 0 && <p data-testid="no-triggers">No data yet.</p>}
      <ul data-testid="triggers-list">
        {sorted.map(([name, count]) => (
          <li key={name} data-testid={`trigger-${name.replace(/\s+/g, "-").toLowerCase()}`}>
            <span data-testid="trigger-name">{name}</span>
            <span data-testid="trigger-count">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shell() {
  const { route, setAllergies, setReactions } = useApp();

  useEffect(() => {
    fetch("/api/allergies")
      .then((r) => r.json())
      .then((data: { allergies: Allergy[]; reactions: ReactionLog[] }) => {
        setAllergies(data.allergies);
        setReactions(data.reactions);
      })
      .catch(() => {});
  }, []);

  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && <HomePage />}
      {route === "add" && <AddPage />}
      {route === "reactions" && <ReactionsPage />}
      {route === "triggers" && <TriggersPage />}
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
