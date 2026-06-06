import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && (
        <div data-testid="vault-page">
          <h1>Vault</h1>
          <input data-testid="cred-site-input" placeholder="Site" />
          <input data-testid="cred-username-input" placeholder="Username" />
          <input data-testid="cred-password-input" placeholder="Password" type="password" />
          <input data-testid="cred-url-input" placeholder="URL" />
          <input data-testid="cred-category-input" placeholder="Category" />
          <input data-testid="cred-notes-input" placeholder="Notes" />
          <button data-testid="add-cred-btn">Add Credential</button>
          <ul data-testid="cred-list"></ul>
        </div>
      )}
      {route === "/generate" && (
        <div data-testid="generate-page">
          <h1>Password Generator</h1>
          <input data-testid="gen-length-input" type="number" defaultValue={16} placeholder="Length" />
          <input data-testid="gen-symbols-checkbox" type="checkbox" defaultChecked />
          <button data-testid="gen-btn">Generate</button>
          <div data-testid="gen-result"></div>
        </div>
      )}
      {route === "/audit" && (
        <div data-testid="audit-page">
          <h1>Audit</h1>
          <div data-testid="weak-count">0</div>
          <ul data-testid="weak-list"></ul>
        </div>
      )}
      {route === "/settings" && (
        <div data-testid="settings-page">
          <h1>Settings</h1>
          <input data-testid="settings-autolock-input" type="number" defaultValue={5} placeholder="Auto-lock minutes" />
          <input data-testid="settings-symbols-checkbox" type="checkbox" defaultChecked />
          <button data-testid="save-settings-btn">Save Settings</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
