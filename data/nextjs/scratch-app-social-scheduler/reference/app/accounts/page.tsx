"use client";
import React, { useEffect, useState } from "react";
import { SocialAccount } from "../../lib/types";

export function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [platform, setPlatform] = useState<string>("twitter");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/accounts").then((r) => r.json()).then((d) => setAccounts(d.accounts ?? []));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    if (!handle.trim()) { setError("Handle required"); return; }
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, handle: handle.trim(), connected: true }),
    });
    setHandle(""); load();
  };

  const remove = async (id: string) => {
    setError("");
    const res = await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    load();
  };

  return (
    <div data-testid="accounts-page">
      <h1>Accounts</h1>
      {error && <div data-testid="accounts-error">{error}</div>}
      <div data-testid="add-account-form">
        <select data-testid="account-platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="twitter">Twitter</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="facebook">Facebook</option>
        </select>
        <input data-testid="account-handle" value={handle} placeholder="@handle" onChange={(e) => setHandle(e.target.value)} />
        <button data-testid="add-account-btn" onClick={add}>Add Account</button>
      </div>
      <ul data-testid="accounts-list">
        {accounts.map((a) => (
          <li key={a.id} data-testid={`account-${a.id}`}>
            <span data-testid={`account-handle-${a.id}`}>{a.handle}</span>
            <span data-testid={`account-platform-${a.id}`}>{a.platform}</span>
            <button data-testid={`remove-account-${a.id}`} onClick={() => remove(a.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
