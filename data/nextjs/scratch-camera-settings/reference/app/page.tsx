import React, { useState } from "react";

interface Preset {
  id: number;
  name: string;
  aperture: string;
  shutter: string;
  iso: number;
  mode: string;
}

const SEED_PRESETS: Preset[] = [
  { id: 1, name: "Portrait Sunny", aperture: "f/1.8", shutter: "1/500s", iso: 100, mode: "Aperture Priority" },
  { id: 2, name: "Night Street", aperture: "f/2.8", shutter: "1/60s", iso: 3200, mode: "Manual" },
  { id: 3, name: "Landscape Golden", aperture: "f/11", shutter: "1/125s", iso: 200, mode: "Program" },
];

const MODES = ["Manual", "Aperture Priority", "Shutter Priority", "Program"];

export default function App() {
  const [presets, setPresets] = useState<Preset[]>(SEED_PRESETS);
  const [name, setName] = useState("");
  const [aperture, setAperture] = useState("");
  const [shutter, setShutter] = useState("");
  const [iso, setIso] = useState("");
  const [mode, setMode] = useState("Manual");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(4);

  const selected = presets.find((p) => p.id === selectedId) ?? null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !aperture.trim() || !shutter.trim()) return;
    const isoNum = parseInt(iso, 10);
    if (isNaN(isoNum) || isoNum <= 0) return;
    const preset: Preset = { id: nextId, name: name.trim(), aperture: aperture.trim(), shutter: shutter.trim(), iso: isoNum, mode };
    setPresets((prev) => [...prev, preset]);
    setNextId((n) => n + 1);
    setName("");
    setAperture("");
    setShutter("");
    setIso("");
    setMode("Manual");
  }

  function deletePreset(id: number) {
    setPresets((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function toggleSelect(id: number) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      <h1>Camera Settings</h1>
      <p data-testid="preset-count">{presets.length} presets</p>

      <form onSubmit={handleSubmit} data-testid="add-form">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-name" />
        </div>
        <div>
          <label htmlFor="aperture">Aperture</label>
          <input id="aperture" type="text" value={aperture} onChange={(e) => setAperture(e.target.value)} data-testid="input-aperture" />
        </div>
        <div>
          <label htmlFor="shutter">Shutter Speed</label>
          <input id="shutter" type="text" value={shutter} onChange={(e) => setShutter(e.target.value)} data-testid="input-shutter" />
        </div>
        <div>
          <label htmlFor="iso">ISO</label>
          <input id="iso" type="number" value={iso} onChange={(e) => setIso(e.target.value)} data-testid="input-iso" />
        </div>
        <div>
          <label htmlFor="mode">Mode</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)} data-testid="input-mode">
            {MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <button type="submit" data-testid="submit-btn">Add Preset</button>
      </form>

      <ul data-testid="preset-list">
        {presets.map((p) => (
          <li
            key={p.id}
            data-testid={`preset-${p.id}`}
            aria-selected={selectedId === p.id}
            onClick={() => toggleSelect(p.id)}
          >
            <span data-testid={`preset-name-${p.id}`}>{p.name}</span>
            <span data-testid={`preset-aperture-${p.id}`}>{p.aperture}</span>
            <span data-testid={`preset-shutter-${p.id}`}>{p.shutter}</span>
            <span data-testid={`preset-iso-${p.id}`}>{p.iso}</span>
            <span data-testid={`preset-mode-${p.id}`}>{p.mode}</span>
            <button
              onClick={(e) => { e.stopPropagation(); deletePreset(p.id); }}
              data-testid={`delete-${p.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div data-testid="detail-panel">
          <h2 data-testid="detail-name">{selected.name}</h2>
          <p data-testid="detail-aperture">{selected.aperture}</p>
          <p data-testid="detail-shutter">{selected.shutter}</p>
          <p data-testid="detail-iso">{selected.iso}</p>
          <p data-testid="detail-mode">{selected.mode}</p>
        </div>
      )}
    </div>
  );
}
