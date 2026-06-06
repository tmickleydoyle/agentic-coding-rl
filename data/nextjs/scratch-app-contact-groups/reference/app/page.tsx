import React, { useEffect, useState } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { Contact, Group } from "../lib/types";

function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [groupId, setGroupId] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const load = () => {
    fetch("/api/contacts?resource=contacts").then((r) => r.json()).then(setContacts);
    fetch("/api/contacts?resource=groups").then((r) => r.json()).then(setGroups);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name) return;
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "contacts", name, email, phone, address, groupId, favorite: false }),
    });
    setName(""); setEmail(""); setPhone(""); setAddress(""); setGroupId("");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
    load();
  };

  const handleToggleFav = async (id: string) => {
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "toggleFavorite", id }),
    });
    load();
  };

  const displayed = filterGroup ? contacts.filter((c) => c.groupId === filterGroup) : contacts;

  return (
    <div data-testid="contacts-page">
      <h1>Contacts</h1>
      <input data-testid="contact-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="contact-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input data-testid="contact-phone-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
      <input data-testid="contact-address-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
      <select data-testid="contact-group-select" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
        <option value="">No Group</option>
        {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <button data-testid="add-contact-btn" onClick={handleAdd}>Add Contact</button>
      <select data-testid="filter-group-select" value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
        <option value="">All Groups</option>
        {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <ul data-testid="contact-list">
        {displayed.map((c) => (
          <li key={c.id} data-testid={`contact-item-${c.id}`}>
            <span data-testid={`contact-name-${c.id}`}>{c.name}</span>
            <span data-testid={`contact-fav-${c.id}`}>{c.favorite ? "★" : "☆"}</span>
            <button data-testid={`toggle-fav-${c.id}`} onClick={() => handleToggleFav(c.id)}>Favorite</button>
            <button data-testid={`remove-contact-${c.id}`} onClick={() => handleRemove(c.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");

  const load = () => fetch("/api/contacts?resource=groups").then((r) => r.json()).then(setGroups);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name) return;
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "groups", name, color }),
    });
    setName(""); setColor("blue");
    load();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/contacts?id=${id}&resource=groups`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="groups-page">
      <h1>Groups</h1>
      <input data-testid="group-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group Name" />
      <input data-testid="group-color-input" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" />
      <button data-testid="add-group-btn" onClick={handleAdd}>Add Group</button>
      <ul data-testid="group-list">
        {groups.map((g) => (
          <li key={g.id} data-testid={`group-item-${g.id}`}>
            <span data-testid={`group-name-${g.id}`}>{g.name}</span>
            <button data-testid={`remove-group-${g.id}`} onClick={() => handleRemove(g.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState<Contact[]>([]);
  useEffect(() => {
    fetch("/api/contacts?resource=favorites").then((r) => r.json()).then(setFavorites);
  }, []);
  return (
    <div data-testid="favorites-page">
      <h1>Favorites</h1>
      <div data-testid="favorites-count">{favorites.length}</div>
      <ul data-testid="favorites-list">
        {favorites.map((c) => (
          <li key={c.id} data-testid={`fav-item-${c.id}`}>
            <span data-testid={`fav-name-${c.id}`}>{c.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImportPage() {
  const [csv, setCsv] = useState("");
  const [imported, setImported] = useState(0);

  const handleImport = async () => {
    if (!csv) return;
    const lines = csv.split("\n").filter((l) => l.trim());
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(",");
      const [name, email, phone] = parts;
      if (name) {
        await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resource: "contacts", name: name.trim(), email: (email || "").trim(), phone: (phone || "").trim(), address: "", groupId: "", favorite: false }),
        });
        count++;
      }
    }
    setImported(count);
    setCsv("");
  };

  return (
    <div data-testid="import-page">
      <h1>Import Contacts</h1>
      <textarea data-testid="import-csv-input" value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="name,email,phone (one per line)" />
      <button data-testid="import-btn" onClick={handleImport}>Import</button>
      <div data-testid="import-count">{imported}</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <ContactsPage />}
      {route === "/groups" && <GroupsPage />}
      {route === "/favorites" && <FavoritesPage />}
      {route === "/import" && <ImportPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
