import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Recipient, Occasion, Gift } from "../lib/types";

function DashboardPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  useEffect(() => {
    fetch("/api/gifts?resource=occasions").then((r) => r.json()).then(setOccasions);
    fetch("/api/gifts?resource=gifts").then((r) => r.json()).then(setGifts);
  }, []);
  const totalSpent = gifts.filter((g) => g.status === "purchased" || g.status === "given").reduce((s, g) => s + g.price, 0);
  return (
    <div data-testid="dashboard-page">
      <h1>Gift Planner</h1>
      <div data-testid="occasion-count">{occasions.length}</div>
      <div data-testid="total-spent">{totalSpent}</div>
    </div>
  );
}

function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [occasionId, setOccasionId] = useState("");
  const [recipientId, setRecipientId] = useState("");

  const load = () => {
    fetch("/api/gifts?resource=gifts").then((r) => r.json()).then(setGifts);
    fetch("/api/gifts?resource=occasions").then((r) => r.json()).then(setOccasions);
    fetch("/api/gifts?resource=recipients").then((r) => r.json()).then(setRecipients);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!title) return;
    await fetch("/api/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "gifts", title, description, price: Number(price), occasionId, recipientId, status: "idea" }),
    });
    setTitle(""); setDescription(""); setPrice(""); setOccasionId(""); setRecipientId("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/gifts?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="gifts-page">
      <h1>Gifts</h1>
      <input data-testid="gift-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input data-testid="gift-description-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input data-testid="gift-price-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" />
      <select data-testid="gift-occasion-select" value={occasionId} onChange={(e) => setOccasionId(e.target.value)}>
        <option value="">Select Occasion</option>
        {occasions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
      <select data-testid="gift-recipient-select" value={recipientId} onChange={(e) => setRecipientId(e.target.value)}>
        <option value="">Select Recipient</option>
        {recipients.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
      <button data-testid="add-gift-btn" onClick={handleAdd}>Add Gift</button>
      <ul data-testid="gift-list">
        {gifts.map((g) => (
          <li key={g.id} data-testid={`gift-item-${g.id}`}>
            <span data-testid={`gift-title-${g.id}`}>{g.title}</span>
            <span data-testid={`gift-status-${g.id}`}>{g.status}</span>
            <span data-testid={`gift-price-${g.id}`}>{g.price}</span>
            <button data-testid={`remove-gift-${g.id}`} onClick={() => handleRemove(g.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OccasionsPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("birthday");
  const [recipientId, setRecipientId] = useState("");
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientRelation, setNewRecipientRelation] = useState("");

  const load = () => {
    fetch("/api/gifts?resource=occasions").then((r) => r.json()).then(setOccasions);
    fetch("/api/gifts?resource=recipients").then((r) => r.json()).then(setRecipients);
  };
  useEffect(() => { load(); }, []);

  const handleAddOccasion = async () => {
    if (!name) return;
    await fetch("/api/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "occasions", name, date, type, recipientId }),
    });
    setName(""); setDate(""); setRecipientId("");
    load();
  };

  const handleAddRecipient = async () => {
    if (!newRecipientName) return;
    await fetch("/api/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "recipients", name: newRecipientName, relation: newRecipientRelation }),
    });
    setNewRecipientName(""); setNewRecipientRelation("");
    load();
  };

  const handleRemoveOccasion = async (id: string) => {
    await fetch(`/api/gifts?id=${id}&resource=occasions`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="occasions-page">
      <h1>Occasions</h1>
      <input data-testid="occasion-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Occasion Name" />
      <input data-testid="occasion-date-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
      <select data-testid="occasion-type-select" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="birthday">Birthday</option>
        <option value="holiday">Holiday</option>
        <option value="anniversary">Anniversary</option>
        <option value="other">Other</option>
      </select>
      <select data-testid="occasion-recipient-select" value={recipientId} onChange={(e) => setRecipientId(e.target.value)}>
        <option value="">No Recipient</option>
        {recipients.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
      <button data-testid="add-occasion-btn" onClick={handleAddOccasion}>Add Occasion</button>
      <ul data-testid="occasion-list">
        {occasions.map((o) => (
          <li key={o.id} data-testid={`occasion-item-${o.id}`}>
            <span data-testid={`occasion-name-${o.id}`}>{o.name}</span>
            <button data-testid={`remove-occasion-${o.id}`} onClick={() => handleRemoveOccasion(o.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h2>Recipients</h2>
      <input data-testid="recipient-name-input" value={newRecipientName} onChange={(e) => setNewRecipientName(e.target.value)} placeholder="Recipient Name" />
      <input data-testid="recipient-relation-input" value={newRecipientRelation} onChange={(e) => setNewRecipientRelation(e.target.value)} placeholder="Relation" />
      <button data-testid="add-recipient-btn" onClick={handleAddRecipient}>Add Recipient</button>
      <ul data-testid="recipient-list">
        {recipients.map((r) => (
          <li key={r.id} data-testid={`recipient-item-${r.id}`}>
            <span data-testid={`recipient-name-${r.id}`}>{r.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BudgetPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  useEffect(() => {
    fetch("/api/gifts?resource=occasions").then((r) => r.json()).then(setOccasions);
    fetch("/api/gifts?resource=gifts").then((r) => r.json()).then(setGifts);
  }, []);

  return (
    <div data-testid="budget-page">
      <h1>Budget</h1>
      <ul data-testid="budget-list">
        {occasions.map((o) => {
          const spent = gifts.filter((g) => g.occasionId === o.id && (g.status === "purchased" || g.status === "given")).reduce((s, g) => s + g.price, 0);
          return (
            <li key={o.id} data-testid={`budget-item-${o.id}`}>
              <span data-testid={`budget-occasion-${o.id}`}>{o.name}</span>
              <span data-testid={`budget-spent-${o.id}`}>{spent}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function IdeasPage() {
  const [ideas, setIdeas] = useState<Gift[]>([]);
  useEffect(() => {
    fetch("/api/gifts?resource=gifts").then((r) => r.json()).then((all: Gift[]) => setIdeas(all.filter((g) => g.status === "idea")));
  }, []);
  return (
    <div data-testid="ideas-page">
      <h1>Ideas</h1>
      <div data-testid="ideas-count">{ideas.length}</div>
      <ul data-testid="ideas-list">
        {ideas.map((g) => (
          <li key={g.id} data-testid={`idea-item-${g.id}`}>
            <span data-testid={`idea-title-${g.id}`}>{g.title}</span>
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
      {route === "/gifts" && <GiftsPage />}
      {route === "/occasions" && <OccasionsPage />}
      {route === "/budget" && <BudgetPage />}
      {route === "/ideas" && <IdeasPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
