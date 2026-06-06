import React, { useState } from "react";

interface QueueItem {
  id: number;
  filename: string;
  editor: string;
  status: string;
  notes: string;
}

const SEED_ITEMS: QueueItem[] = [
  { id: 1, filename: "DSC_0421.jpg", editor: "Alice", status: "Pending", notes: "Needs color grade" },
  { id: 2, filename: "DSC_0587.jpg", editor: "Bob", status: "In Progress", notes: "Retouching face" },
  { id: 3, filename: "DSC_0612.jpg", editor: "Alice", status: "Done", notes: "Approved" },
  { id: 4, filename: "DSC_0789.jpg", editor: "Carol", status: "Pending", notes: "Crop and straighten" },
];

const STATUSES = ["Pending", "In Progress", "Done"];

export default function App() {
  const [items, setItems] = useState<QueueItem[]>(SEED_ITEMS);
  const [filename, setFilename] = useState("");
  const [editor, setEditor] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [nextId, setNextId] = useState(5);

  const pendingCount = items.filter((i) => i.status === "Pending").length;
  const inProgressCount = items.filter((i) => i.status === "In Progress").length;
  const doneCount = items.filter((i) => i.status === "Done").length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!filename.trim() || !editor.trim()) return;
    const item: QueueItem = { id: nextId, filename: filename.trim(), editor: editor.trim(), status, notes: notes.trim() };
    setItems((prev) => [...prev, item]);
    setNextId((n) => n + 1);
    setFilename("");
    setEditor("");
    setNotes("");
    setStatus("Pending");
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateStatus(id: number, newStatus: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
  }

  return (
    <div>
      <h1>Edit Queue</h1>
      <p data-testid="item-count">{items.length} items</p>
      <p data-testid="status-counts">Pending: {pendingCount} | In Progress: {inProgressCount} | Done: {doneCount}</p>

      <form onSubmit={handleSubmit} data-testid="add-form">
        <div>
          <label htmlFor="filename">Filename</label>
          <input
            id="filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            data-testid="input-filename"
          />
        </div>
        <div>
          <label htmlFor="editor">Editor</label>
          <input
            id="editor"
            type="text"
            value={editor}
            onChange={(e) => setEditor(e.target.value)}
            data-testid="input-editor"
          />
        </div>
        <div>
          <label htmlFor="form-status">Status</label>
          <select id="form-status" value={status} onChange={(e) => setStatus(e.target.value)} data-testid="input-status">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            data-testid="input-notes"
          />
        </div>
        <button type="submit" data-testid="submit-btn">Add Item</button>
      </form>

      <ul data-testid="queue-list">
        {items.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            <span data-testid={`item-filename-${item.id}`}>{item.filename}</span>
            <span data-testid={`item-editor-${item.id}`}>{item.editor}</span>
            <select
              value={item.status}
              onChange={(e) => updateStatus(item.id, e.target.value)}
              data-testid={`item-status-${item.id}`}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {item.notes && <span data-testid={`item-notes-${item.id}`}>{item.notes}</span>}
            <button onClick={() => deleteItem(item.id)} data-testid={`delete-${item.id}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
