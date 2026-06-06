import { useState } from "react";

interface TastingNote {
  id: number;
  beverage: string;
  producer: string;
  vintage: string;
  score: number;
  notes: string;
}

const SEED_NOTES: TastingNote[] = [
  {
    id: 1,
    beverage: "Barolo",
    producer: "Giacomo Conterno",
    vintage: "2016",
    score: 96,
    notes: "Tar and roses, iron minerality, incredible length on the finish",
  },
  {
    id: 2,
    beverage: "Burgundy Pinot Noir",
    producer: "Domaine Leroy",
    vintage: "2017",
    score: 98,
    notes: "Ethereal, pure red fruit, silky tannins, haunting finish",
  },
  {
    id: 3,
    beverage: "Islay Scotch",
    producer: "Ardbeg Uigeadail",
    vintage: "N/A",
    score: 90,
    notes: "Peat smoke, dark chocolate, espresso, dried fruit",
  },
];

export default function App() {
  const [notes, setNotes] = useState<TastingNote[]>(SEED_NOTES);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Partial<TastingNote>>({});

  const [beverage, setBeverage] = useState("");
  const [producer, setProducer] = useState("");
  const [vintage, setVintage] = useState("");
  const [score, setScore] = useState("");
  const [noteText, setNoteText] = useState("");

  const handleAdd = () => {
    if (!beverage.trim() || !noteText.trim()) return;
    const newNote: TastingNote = {
      id: Date.now(),
      beverage: beverage.trim(),
      producer: producer.trim(),
      vintage: vintage.trim() || "N/A",
      score: parseInt(score) || 0,
      notes: noteText.trim(),
    };
    setNotes((prev) => [...prev, newNote]);
    setBeverage("");
    setProducer("");
    setVintage("");
    setScore("");
    setNoteText("");
  };

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleEdit = (note: TastingNote) => {
    setEditingId(note.id);
    setEditFields({ ...note });
  };

  const handleSaveEdit = () => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingId ? { ...n, ...editFields } as TastingNote : n
      )
    );
    setEditingId(null);
    setEditFields({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFields({});
  };

  const query = search.toLowerCase();
  const visible = notes.filter((n) => {
    if (!query) return true;
    return (
      n.beverage.toLowerCase().includes(query) ||
      n.producer.toLowerCase().includes(query) ||
      n.notes.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <h1>Tasting Notes</h1>

      <input
        data-testid="search-input"
        placeholder="Search notes"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div data-testid="notes-list">
        {visible.map((note) =>
          editingId === note.id ? (
            <div key={note.id} data-testid="note-card">
              <input
                value={editFields.beverage ?? ""}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, beverage: e.target.value }))
                }
              />
              <input
                value={editFields.producer ?? ""}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, producer: e.target.value }))
                }
              />
              <input
                value={editFields.vintage ?? ""}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, vintage: e.target.value }))
                }
              />
              <input
                type="number"
                value={editFields.score ?? 0}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, score: parseInt(e.target.value) || 0 }))
                }
              />
              <textarea
                value={editFields.notes ?? ""}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, notes: e.target.value }))
                }
              />
              <button data-testid="save-edit" onClick={handleSaveEdit}>
                Save
              </button>
              <button data-testid="cancel-edit" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          ) : (
            <div key={note.id} data-testid="note-card">
              <span data-testid="note-beverage">{note.beverage}</span>
              <span data-testid="note-producer">{note.producer}</span>
              <span data-testid="note-vintage">{note.vintage}</span>
              <span data-testid="note-score">{note.score}/100</span>
              <span data-testid="note-notes">{note.notes}</span>
              <button data-testid="edit-note" onClick={() => handleEdit(note)}>
                Edit
              </button>
              <button data-testid="delete-note" onClick={() => handleDelete(note.id)}>
                Delete
              </button>
            </div>
          )
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <label>
          Beverage
          <input
            data-testid="input-beverage"
            value={beverage}
            onChange={(e) => setBeverage(e.target.value)}
          />
        </label>
        <label>
          Producer
          <input
            data-testid="input-producer"
            value={producer}
            onChange={(e) => setProducer(e.target.value)}
          />
        </label>
        <label>
          Vintage
          <input
            data-testid="input-vintage"
            value={vintage}
            onChange={(e) => setVintage(e.target.value)}
          />
        </label>
        <label>
          Score
          <input
            data-testid="input-score"
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </label>
        <label>
          Notes
          <textarea
            data-testid="input-notes"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </label>
        <button type="submit" data-testid="submit-note">
          Add Note
        </button>
      </form>
    </div>
  );
}
