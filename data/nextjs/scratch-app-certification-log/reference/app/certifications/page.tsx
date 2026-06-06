import React, { useState } from "react";
import { getCertifications, addCertification, deleteCertification } from "../../lib/store";
import { Certification } from "../../lib/types";

export function CertificationsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState<Certification["status"]>("planned");
  const [, forceUpdate] = useState(0);

  const certs = getCertifications();
  const filtered = statusFilter === "all" ? certs : certs.filter((c) => c.status === statusFilter);

  const handleAdd = () => {
    if (!name.trim() || !provider.trim()) return;
    addCertification({ name: name.trim(), provider: provider.trim(), status });
    setName(""); setProvider("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="certifications-page">
      <h2>Certifications</h2>
      <select data-testid="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="planned">Planned</option>
        <option value="studying">Studying</option>
        <option value="earned">Earned</option>
        <option value="expired">Expired</option>
      </select>
      {filtered.map((c) => (
        <div key={c.id} data-testid="cert-item">
          <span data-testid="cert-name">{c.name}</span>
          <span data-testid="cert-provider">{c.provider}</span>
          <span data-testid="status-badge">{c.status}</span>
          <button data-testid="delete-cert" onClick={() => { deleteCertification(c.id); forceUpdate((n) => n + 1); }}>Delete</button>
        </div>
      ))}
      <div data-testid="add-cert-form">
        <input data-testid="cert-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="cert-provider-input" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <select data-testid="cert-status-select" value={status} onChange={(e) => setStatus(e.target.value as Certification["status"])}>
          <option value="planned">Planned</option>
          <option value="studying">Studying</option>
          <option value="earned">Earned</option>
          <option value="expired">Expired</option>
        </select>
        <button data-testid="add-cert-btn" onClick={handleAdd}>Add Certification</button>
      </div>
    </div>
  );
}
