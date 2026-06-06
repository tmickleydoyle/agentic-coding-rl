import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Policy, Claim, Document, Contact } from "../lib/types";

function DashboardPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  useEffect(() => {
    fetch("/api/policies?resource=policies").then((r) => r.json()).then(setPolicies);
    fetch("/api/policies?resource=claims").then((r) => r.json()).then(setClaims);
  }, []);
  const activeCount = policies.filter((p) => p.active).length;
  const openClaims = claims.filter((c) => c.status === "open").length;
  return (
    <div data-testid="dashboard-page">
      <h1>Insurance Vault</h1>
      <div data-testid="active-policy-count">{activeCount}</div>
      <div data-testid="open-claims-count">{openClaims}</div>
    </div>
  );
}

function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("home");
  const [provider, setProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [premium, setPremium] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = () => fetch("/api/policies?resource=policies").then((r) => r.json()).then(setPolicies);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name || !provider) return;
    await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "policies", name, type, provider, policyNumber, premium: Number(premium), startDate, endDate, active: true }),
    });
    setName(""); setProvider(""); setPolicyNumber(""); setPremium(""); setStartDate(""); setEndDate("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/policies?id=${id}&resource=policies`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="policies-page">
      <h1>Policies</h1>
      <input data-testid="policy-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Policy Name" />
      <select data-testid="policy-type-select" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="home">Home</option>
        <option value="auto">Auto</option>
        <option value="life">Life</option>
        <option value="health">Health</option>
        <option value="other">Other</option>
      </select>
      <input data-testid="policy-provider-input" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
      <input data-testid="policy-number-input" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} placeholder="Policy Number" />
      <input data-testid="policy-premium-input" value={premium} onChange={(e) => setPremium(e.target.value)} placeholder="Premium" type="number" />
      <input data-testid="policy-start-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
      <input data-testid="policy-end-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
      <button data-testid="add-policy-btn" onClick={handleAdd}>Add Policy</button>
      <ul data-testid="policy-list">
        {policies.map((p) => (
          <li key={p.id} data-testid={`policy-item-${p.id}`}>
            <span data-testid={`policy-name-${p.id}`}>{p.name}</span>
            <span data-testid={`policy-provider-${p.id}`}>{p.provider}</span>
            <button data-testid={`remove-policy-${p.id}`} onClick={() => handleRemove(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policyId, setPolicyId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const load = () => {
    fetch("/api/policies?resource=claims").then((r) => r.json()).then(setClaims);
    fetch("/api/policies?resource=policies").then((r) => r.json()).then(setPolicies);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!policyId || !description) return;
    await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "claims", policyId, description, amount: Number(amount), date, status: "open" }),
    });
    setPolicyId(""); setDescription(""); setAmount(""); setDate("");
    load();
  };

  return (
    <div data-testid="claims-page">
      <h1>Claims</h1>
      <select data-testid="claim-policy-select" value={policyId} onChange={(e) => setPolicyId(e.target.value)}>
        <option value="">Select Policy</option>
        {policies.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input data-testid="claim-description-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input data-testid="claim-amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
      <input data-testid="claim-date-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
      <button data-testid="add-claim-btn" onClick={handleAdd}>File Claim</button>
      <ul data-testid="claim-list">
        {claims.map((c) => (
          <li key={c.id} data-testid={`claim-item-${c.id}`}>
            <span data-testid={`claim-desc-${c.id}`}>{c.description}</span>
            <span data-testid={`claim-status-${c.id}`}>{c.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policyId, setPolicyId] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");

  const load = () => {
    fetch("/api/policies?resource=documents").then((r) => r.json()).then(setDocs);
    fetch("/api/policies?resource=policies").then((r) => r.json()).then(setPolicies);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!policyId || !name || !url) return;
    await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "documents", policyId, name, url, type }),
    });
    setPolicyId(""); setName(""); setUrl(""); setType("");
    load();
  };

  return (
    <div data-testid="documents-page">
      <h1>Documents</h1>
      <select data-testid="doc-policy-select" value={policyId} onChange={(e) => setPolicyId(e.target.value)}>
        <option value="">Select Policy</option>
        {policies.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input data-testid="doc-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Document Name" />
      <input data-testid="doc-url-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      <input data-testid="doc-type-input" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
      <button data-testid="add-doc-btn" onClick={handleAdd}>Add Document</button>
      <ul data-testid="doc-list">
        {docs.map((d) => (
          <li key={d.id} data-testid={`doc-item-${d.id}`}>
            <span data-testid={`doc-name-${d.id}`}>{d.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const load = () => fetch("/api/policies?resource=contacts").then((r) => r.json()).then(setContacts);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name) return;
    await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "contacts", name, company, phone, email, role }),
    });
    setName(""); setCompany(""); setPhone(""); setEmail(""); setRole("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/policies?id=${id}&resource=contacts`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="contacts-page">
      <h1>Contacts</h1>
      <input data-testid="contact-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="contact-company-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
      <input data-testid="contact-phone-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
      <input data-testid="contact-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input data-testid="contact-role-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
      <button data-testid="add-contact-btn" onClick={handleAdd}>Add Contact</button>
      <ul data-testid="contact-list">
        {contacts.map((c) => (
          <li key={c.id} data-testid={`contact-item-${c.id}`}>
            <span data-testid={`contact-name-${c.id}`}>{c.name}</span>
            <button data-testid={`remove-contact-${c.id}`} onClick={() => handleRemove(c.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <DashboardPage />}
      {route === "/policies" && <PoliciesPage />}
      {route === "/claims" && <ClaimsPage />}
      {route === "/documents" && <DocumentsPage />}
      {route === "/contacts" && <ContactsPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
