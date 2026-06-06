"use client";
import React, { useEffect, useState } from "react";
import { SocialAccount } from "../../lib/types";

export function ComposePage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [body, setBody] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/accounts").then((r) => r.json()).then((d) => setAccounts(d.accounts ?? []));
  }, []);

  const toggleAccount = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    setError(""); setSuccess(false);
    if (!body.trim()) { setError("Body required"); return; }
    if (selectedIds.length === 0) { setError("Select at least one account"); return; }
    if (!scheduledAt) { setError("Schedule date required"); return; }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, accountIds: selectedIds, status: "scheduled", scheduledAt }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setBody(""); setSelectedIds([]); setScheduledAt(""); setSuccess(true);
  };

  return (
    <div data-testid="compose-page">
      <h1>Compose</h1>
      {error && <div data-testid="compose-error">{error}</div>}
      {success && <div data-testid="compose-success">Post scheduled!</div>}
      <textarea
        data-testid="compose-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={280}
        placeholder="What's on your mind?"
      />
      <div data-testid="char-count">{body.length}/280</div>
      <div data-testid="account-selector">
        {accounts.map((a) => (
          <label key={a.id} data-testid={`account-option-${a.id}`}>
            <input
              type="checkbox"
              data-testid={`account-check-${a.id}`}
              checked={selectedIds.includes(a.id)}
              onChange={() => toggleAccount(a.id)}
            />
            {a.handle} ({a.platform})
          </label>
        ))}
      </div>
      <input data-testid="compose-schedule" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
      <button data-testid="compose-submit" onClick={submit}>Schedule Post</button>
    </div>
  );
}
