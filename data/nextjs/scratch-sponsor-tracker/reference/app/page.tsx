import { useState } from "react";

type Tier = "platinum" | "gold" | "silver" | "bronze";

interface Benefits {
  "logo on website": boolean;
  "speaking slot": boolean;
  "banner": boolean;
  "swag table": boolean;
}

interface Sponsor {
  id: number;
  name: string;
  tier: Tier;
  booth: string;
  contactName: string;
  contactEmail: string;
  benefits: Benefits;
}

const DEFAULT_BENEFITS: Benefits = {
  "logo on website": false,
  "speaking slot": false,
  "banner": false,
  "swag table": false,
};

const SEED_SPONSORS: Sponsor[] = [
  { id: 1, name: "TechCorp", tier: "platinum", booth: "B1", contactName: "Sarah Lee", contactEmail: "sarah@techcorp.com", benefits: { "logo on website": true, "speaking slot": true, "banner": true, "swag table": false } },
  { id: 2, name: "StartupX", tier: "gold", booth: "B4", contactName: "Ben Okafor", contactEmail: "ben@startupx.io", benefits: { "logo on website": true, "speaking slot": false, "banner": true, "swag table": false } },
  { id: 3, name: "DesignLab", tier: "silver", booth: "B7", contactName: "Cara White", contactEmail: "cara@designlab.co", benefits: { "logo on website": true, "speaking slot": false, "banner": false, "swag table": false } },
  { id: 4, name: "CloudBase", tier: "gold", booth: "B5", contactName: "David Kim", contactEmail: "david@cloudbase.dev", benefits: { "logo on website": true, "speaking slot": false, "banner": true, "swag table": true } },
  { id: 5, name: "DataFlow", tier: "bronze", booth: "B12", contactName: "Eva Russo", contactEmail: "eva@dataflow.ai", benefits: { "logo on website": false, "speaking slot": false, "banner": false, "swag table": false } },
];

const BENEFIT_KEYS = ["logo on website", "speaking slot", "banner", "swag table"] as const;
type BenefitKey = typeof BENEFIT_KEYS[number];

const TIERS: Array<Tier | "All"> = ["All", "platinum", "gold", "silver", "bronze"];

export default function App() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(SEED_SPONSORS);
  const [nextId, setNextId] = useState<number>(6);
  const [tierFilter, setTierFilter] = useState<Tier | "All">("All");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState<Tier>("gold");
  const [newBooth, setNewBooth] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");

  const [editName, setEditName] = useState("");
  const [editTier, setEditTier] = useState<Tier>("gold");
  const [editBooth, setEditBooth] = useState("");
  const [editContactName, setEditContactName] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newBooth.trim() || !newContactName.trim() || !newContactEmail.trim()) return;
    const s: Sponsor = {
      id: nextId,
      name: newName.trim(),
      tier: newTier,
      booth: newBooth.trim(),
      contactName: newContactName.trim(),
      contactEmail: newContactEmail.trim(),
      benefits: { ...DEFAULT_BENEFITS },
    };
    setSponsors([...sponsors, s]);
    setNextId(nextId + 1);
    setNewName(""); setNewBooth(""); setNewContactName(""); setNewContactEmail(""); setNewTier("gold");
  };

  const handleDelete = (id: number) => {
    if (editingId === id) setEditingId(null);
    setSponsors(sponsors.filter((s) => s.id !== id));
  };

  const startEdit = (s: Sponsor) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditTier(s.tier);
    setEditBooth(s.booth);
    setEditContactName(s.contactName);
    setEditContactEmail(s.contactEmail);
  };

  const handleSave = (id: number) => {
    setSponsors(sponsors.map((s) =>
      s.id === id
        ? { ...s, name: editName.trim(), tier: editTier, booth: editBooth.trim(), contactName: editContactName.trim(), contactEmail: editContactEmail.trim() }
        : s
    ));
    setEditingId(null);
  };

  const toggleBenefit = (id: number, key: BenefitKey) => {
    setSponsors(sponsors.map((s) =>
      s.id === id ? { ...s, benefits: { ...s.benefits, [key]: !s.benefits[key] } } : s
    ));
  };

  const filtered = sponsors.filter((s) =>
    tierFilter === "All" || s.tier === tierFilter
  );

  return (
    <main>
      <h1>Sponsor Tracker</h1>

      <section data-testid="add-form">
        <input data-testid="input-name" aria-label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" />
        <select data-testid="input-tier" aria-label="Tier" value={newTier} onChange={(e) => setNewTier(e.target.value as Tier)}>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
        <input data-testid="input-booth" aria-label="Booth" value={newBooth} onChange={(e) => setNewBooth(e.target.value)} placeholder="Booth" />
        <input data-testid="input-contact-name" aria-label="Contact Name" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder="Contact Name" />
        <input data-testid="input-contact-email" aria-label="Contact Email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} placeholder="Contact Email" />
        <button data-testid="add-btn" onClick={handleAdd}>Add Sponsor</button>
      </section>

      <div data-testid="tier-filters">
        {TIERS.map((t) => (
          <button
            key={t}
            data-testid={`tier-filter-${t.toLowerCase()}`}
            aria-pressed={tierFilter === t}
            onClick={() => setTierFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <p data-testid="sponsor-count">{filtered.length} sponsors</p>

      {filtered.length === 0 ? (
        <p data-testid="no-sponsors">No sponsors found</p>
      ) : (
        <ul data-testid="sponsor-list">
          {filtered.map((s) => (
            <li key={s.id} data-testid={`sponsor-${s.id}`}>
              {editingId === s.id ? (
                <div data-testid={`edit-form-${s.id}`}>
                  <input data-testid={`edit-name-${s.id}`} aria-label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <select data-testid={`edit-tier-${s.id}`} aria-label="Tier" value={editTier} onChange={(e) => setEditTier(e.target.value as Tier)}>
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                  <input data-testid={`edit-booth-${s.id}`} aria-label="Booth" value={editBooth} onChange={(e) => setEditBooth(e.target.value)} />
                  <input data-testid={`edit-contact-name-${s.id}`} aria-label="Contact Name" value={editContactName} onChange={(e) => setEditContactName(e.target.value)} />
                  <input data-testid={`edit-contact-email-${s.id}`} aria-label="Contact Email" value={editContactEmail} onChange={(e) => setEditContactEmail(e.target.value)} />
                  <button data-testid={`save-btn-${s.id}`} onClick={() => handleSave(s.id)}>Save</button>
                  <button data-testid={`cancel-btn-${s.id}`} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div data-testid={`sponsor-view-${s.id}`}>
                  <span data-testid={`sponsor-name-${s.id}`}>{s.name}</span>
                  <span data-testid={`sponsor-tier-${s.id}`}>{s.tier}</span>
                  <span data-testid={`sponsor-booth-${s.id}`}>{s.booth}</span>
                  <span data-testid={`sponsor-contact-name-${s.id}`}>{s.contactName}</span>
                  <a href={`mailto:${s.contactEmail}`} data-testid={`sponsor-contact-email-${s.id}`}>{s.contactEmail}</a>
                  <button data-testid={`edit-btn-${s.id}`} onClick={() => startEdit(s)}>Edit</button>
                  <button data-testid={`delete-btn-${s.id}`} onClick={() => handleDelete(s.id)}>Delete</button>
                </div>
              )}
              <div data-testid={`benefits-${s.id}`}>
                {BENEFIT_KEYS.map((key) => (
                  <label key={key} data-testid={`benefit-label-${s.id}-${key.replace(/ /g, "-")}`}>
                    <input
                      type="checkbox"
                      data-testid={`benefit-${s.id}-${key.replace(/ /g, "-")}`}
                      checked={s.benefits[key]}
                      onChange={() => toggleBenefit(s.id, key)}
                    />
                    {key}
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
