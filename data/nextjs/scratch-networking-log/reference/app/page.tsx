import { useState } from "react";

type FollowUp = "pending" | "done" | "skipped";

interface Contact {
  id: number;
  name: string;
  company: string;
  role: string;
  email: string;
  metAt: string;
  followUp: FollowUp;
  notes: string;
}

const SEED_CONTACTS: Contact[] = [
  { id: 1, name: "Alice Tran", company: "TechCorp", role: "Engineer", email: "alice@techcorp.com", metAt: "Day 1 - Keynote", followUp: "pending", notes: "Interested in OSS collaboration" },
  { id: 2, name: "Ben Okafor", company: "StartupX", role: "Founder", email: "ben@startupx.io", metAt: "Day 1 - Lunch", followUp: "done", notes: "Sent follow-up email already" },
  { id: 3, name: "Cara White", company: "DesignLab", role: "Designer", email: "cara@designlab.co", metAt: "Day 1 - Workshop", followUp: "pending", notes: "Shared Figma tips" },
  { id: 4, name: "David Kim", company: "CloudBase", role: "DevOps", email: "david@cloudbase.dev", metAt: "Day 2 - Networking", followUp: "skipped", notes: "Will connect on LinkedIn" },
  { id: 5, name: "Eva Russo", company: "DataFlow", role: "Data Scientist", email: "eva@dataflow.ai", metAt: "Day 2 - Panel", followUp: "pending", notes: "Interested in dataset sharing" },
];

type StatusFilter = "All" | "Pending" | "Done";

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(SEED_CONTACTS);
  const [nextId, setNextId] = useState<number>(6);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState<string>("");

  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMetAt, setNewMetAt] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newCompany.trim() || !newRole.trim() || !newEmail.trim() || !newMetAt.trim()) return;
    const c: Contact = {
      id: nextId,
      name: newName.trim(),
      company: newCompany.trim(),
      role: newRole.trim(),
      email: newEmail.trim(),
      metAt: newMetAt.trim(),
      followUp: "pending",
      notes: newNotes.trim(),
    };
    setContacts([c, ...contacts]);
    setNextId(nextId + 1);
    setNewName(""); setNewCompany(""); setNewRole(""); setNewEmail(""); setNewMetAt(""); setNewNotes("");
  };

  const updateFollowUp = (id: number, status: FollowUp) => {
    setContacts(contacts.map((c) => c.id === id ? { ...c, followUp: status } : c));
  };

  const filtered = contacts.filter((c) => {
    const matchSearch = search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && (c.followUp === "pending" || c.followUp === "skipped")) ||
      (statusFilter === "Done" && c.followUp === "done");
    return matchSearch && matchStatus;
  });

  return (
    <main>
      <h1>Networking Log</h1>

      <section data-testid="add-form">
        <input data-testid="input-name" aria-label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" />
        <input data-testid="input-company" aria-label="Company" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Company" />
        <input data-testid="input-role" aria-label="Role" value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Role" />
        <input data-testid="input-email" aria-label="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" />
        <input data-testid="input-metat" aria-label="Met At" value={newMetAt} onChange={(e) => setNewMetAt(e.target.value)} placeholder="Met At" />
        <textarea data-testid="input-notes" aria-label="Notes" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="add-btn" onClick={handleAdd}>Add Contact</button>
      </section>

      <input
        data-testid="search-input"
        aria-label="Search contacts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search contacts"
      />

      <div data-testid="status-filters">
        {(["All", "Pending", "Done"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            data-testid={`status-filter-${f.toLowerCase()}`}
            aria-pressed={statusFilter === f}
            onClick={() => setStatusFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <p data-testid="contact-count">{filtered.length} contacts</p>

      {filtered.length === 0 ? (
        <p data-testid="no-contacts">No contacts found</p>
      ) : (
        <ul data-testid="contact-list">
          {filtered.map((c) => (
            <li key={c.id} data-testid={`contact-${c.id}`}>
              <span data-testid={`contact-name-${c.id}`}>{c.name}</span>
              <span data-testid={`contact-company-${c.id}`}>{c.company}</span>
              <span data-testid={`contact-role-${c.id}`}>{c.role}</span>
              <a href={`mailto:${c.email}`} data-testid={`contact-email-${c.id}`}>{c.email}</a>
              <span data-testid={`contact-metat-${c.id}`}>{c.metAt}</span>
              <span data-testid={`contact-followup-${c.id}`}>{c.followUp}</span>
              <span data-testid={`contact-notes-${c.id}`}>{c.notes}</span>
              {(c.followUp === "pending" || c.followUp === "skipped") && (
                <button data-testid={`mark-done-btn-${c.id}`} onClick={() => updateFollowUp(c.id, "done")}>Mark Done</button>
              )}
              {c.followUp === "pending" && (
                <button data-testid={`skip-btn-${c.id}`} onClick={() => updateFollowUp(c.id, "skipped")}>Skip</button>
              )}
              {c.followUp === "done" && (
                <button data-testid={`reset-btn-${c.id}`} onClick={() => updateFollowUp(c.id, "pending")}>Reset</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
