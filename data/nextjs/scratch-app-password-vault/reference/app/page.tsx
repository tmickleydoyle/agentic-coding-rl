import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Credential, VaultSettings } from "../lib/types";

function VaultPage() {
  const [creds, setCreds] = useState<Credential[]>([]);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const load = () => fetch("/api/vault?resource=credentials").then((r) => r.json()).then(setCreds);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!site || !username || !password) return;
    await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "credentials", site, username, password, url, category, notes, createdAt: new Date().toISOString().slice(0, 10) }),
    });
    setSite(""); setUsername(""); setPassword(""); setUrl(""); setCategory(""); setNotes("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/vault?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="vault-page">
      <h1>Vault</h1>
      <input data-testid="cred-site-input" value={site} onChange={(e) => setSite(e.target.value)} placeholder="Site" />
      <input data-testid="cred-username-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input data-testid="cred-password-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <input data-testid="cred-url-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      <input data-testid="cred-category-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <input data-testid="cred-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
      <button data-testid="add-cred-btn" onClick={handleAdd}>Add Credential</button>
      <ul data-testid="cred-list">
        {creds.map((c) => (
          <li key={c.id} data-testid={`cred-item-${c.id}`}>
            <span data-testid={`cred-site-${c.id}`}>{c.site}</span>
            <span data-testid={`cred-username-${c.id}`}>{c.username}</span>
            <button data-testid={`remove-cred-${c.id}`} onClick={() => handleRemove(c.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GeneratePage() {
  const [length, setLength] = useState(16);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generated, setGenerated] = useState("");

  const handleGenerate = async () => {
    const res = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "generate", length, useSymbols }),
    });
    const data = await res.json();
    setGenerated(data.password ?? "");
  };

  return (
    <div data-testid="generate-page">
      <h1>Password Generator</h1>
      <input data-testid="gen-length-input" type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} placeholder="Length" />
      <input data-testid="gen-symbols-checkbox" type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
      <button data-testid="gen-btn" onClick={handleGenerate}>Generate</button>
      <div data-testid="gen-result">{generated}</div>
    </div>
  );
}

function AuditPage() {
  const [weak, setWeak] = useState<Credential[]>([]);
  useEffect(() => {
    fetch("/api/vault?resource=weak").then((r) => r.json()).then(setWeak);
  }, []);
  return (
    <div data-testid="audit-page">
      <h1>Audit</h1>
      <div data-testid="weak-count">{weak.length}</div>
      <ul data-testid="weak-list">
        {weak.map((c) => (
          <li key={c.id} data-testid={`weak-item-${c.id}`}>
            <span data-testid={`weak-site-${c.id}`}>{c.site}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState<VaultSettings>({ autoLockMinutes: 5, requireSymbols: true });
  useEffect(() => {
    fetch("/api/vault?resource=settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "settings", ...settings }),
    });
    const data = await res.json();
    setSettings(data);
  };

  return (
    <div data-testid="settings-page">
      <h1>Settings</h1>
      <input
        data-testid="settings-autolock-input"
        type="number"
        value={settings.autoLockMinutes}
        onChange={(e) => setSettings({ ...settings, autoLockMinutes: Number(e.target.value) })}
        placeholder="Auto-lock minutes"
      />
      <input
        data-testid="settings-symbols-checkbox"
        type="checkbox"
        checked={settings.requireSymbols}
        onChange={(e) => setSettings({ ...settings, requireSymbols: e.target.checked })}
      />
      <button data-testid="save-settings-btn" onClick={handleSave}>Save Settings</button>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <VaultPage />}
      {route === "/generate" && <GeneratePage />}
      {route === "/audit" && <AuditPage />}
      {route === "/settings" && <SettingsPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
