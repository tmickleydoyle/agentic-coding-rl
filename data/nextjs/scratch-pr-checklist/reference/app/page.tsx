import React, { useState } from "react";

type PRStatus = "open" | "merged";

interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
}

interface PR {
  id: number;
  prNumber: number;
  title: string;
  author: string;
  status: PRStatus;
  items: ChecklistItem[];
}

const SEED_PRS: PR[] = [
  {
    id: 1,
    prNumber: 101,
    title: "Add user authentication",
    author: "alice",
    status: "open",
    items: [
      { id: 1, label: "Tests written and passing", checked: false },
      { id: 2, label: "Security review completed", checked: false },
      { id: 3, label: "Documentation updated", checked: false },
      { id: 4, label: "Code reviewed by peer", checked: true },
    ],
  },
  {
    id: 2,
    prNumber: 102,
    title: "Refactor database layer",
    author: "bob",
    status: "open",
    items: [
      { id: 5, label: "Tests written and passing", checked: false },
      { id: 6, label: "Migration scripts verified", checked: false },
      { id: 7, label: "Performance benchmarks run", checked: false },
      { id: 8, label: "Code reviewed by peer", checked: false },
    ],
  },
  {
    id: 3,
    prNumber: 103,
    title: "Fix login redirect bug",
    author: "carol",
    status: "merged",
    items: [
      { id: 9, label: "Tests written and passing", checked: true },
      { id: 10, label: "Security review completed", checked: true },
      { id: 11, label: "Code reviewed by peer", checked: true },
    ],
  },
];

export default function App() {
  const [prs, setPrs] = useState<PR[]>(SEED_PRS);
  const [prNumber, setPrNumber] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<PRStatus | "">("");
  const [formError, setFormError] = useState("");
  const [filter, setFilter] = useState<"all" | PRStatus>("all");
  const [nextPrId, setNextPrId] = useState(4);
  const [nextItemId, setNextItemId] = useState(12);
  const [itemInputs, setItemInputs] = useState<Record<number, string>>({});

  function handleAddPR() {
    const num = parseInt(prNumber, 10);
    if (!prNumber.trim() || !title.trim() || !author.trim() || !status) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(num) || num <= 0) {
      setFormError("PR number must be a positive integer.");
      return;
    }
    const newPR: PR = {
      id: nextPrId,
      prNumber: num,
      title: title.trim(),
      author: author.trim(),
      status: status as PRStatus,
      items: [],
    };
    setPrs([newPR, ...prs]);
    setNextPrId(nextPrId + 1);
    setPrNumber("");
    setTitle("");
    setAuthor("");
    setStatus("");
    setFormError("");
  }

  function handleToggleItem(prId: number, itemId: number) {
    setPrs(
      prs.map((pr) => {
        if (pr.id !== prId) return pr;
        return {
          ...pr,
          items: pr.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  }

  function handleAddItem(prId: number) {
    const text = (itemInputs[prId] || "").trim();
    if (!text) return;
    setPrs(
      prs.map((pr) => {
        if (pr.id !== prId) return pr;
        return {
          ...pr,
          items: [
            ...pr.items,
            { id: nextItemId, label: text, checked: false },
          ],
        };
      })
    );
    setNextItemId(nextItemId + 1);
    setItemInputs({ ...itemInputs, [prId]: "" });
  }

  const filtered = prs.filter(
    (pr) => filter === "all" || pr.status === filter
  );

  function completionText(pr: PR) {
    if (pr.items.length === 0) return "No items";
    const done = pr.items.filter((i) => i.checked).length;
    if (done === pr.items.length) return "Ready to merge!";
    return `${done}/${pr.items.length} items`;
  }

  return (
    <main>
      <h1>PR Checklist</h1>

      <section aria-label="Add PR form">
        <div>
          <label htmlFor="input-pr-number">PR Number</label>
          <input
            id="input-pr-number"
            data-testid="input-pr-number"
            type="number"
            value={prNumber}
            onChange={(e) => setPrNumber(e.target.value)}
            placeholder="e.g. 104"
          />
        </div>
        <div>
          <label htmlFor="input-title">Title</label>
          <input
            id="input-title"
            data-testid="input-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="PR title"
          />
        </div>
        <div>
          <label htmlFor="input-author">Author</label>
          <input
            id="input-author"
            data-testid="input-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="username"
          />
        </div>
        <div>
          <label htmlFor="input-status">Status</label>
          <select
            id="input-status"
            data-testid="input-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PRStatus | "")}
          >
            <option value="">-- select --</option>
            <option value="open">open</option>
            <option value="merged">merged</option>
          </select>
        </div>
        {formError && <p data-testid="form-error">{formError}</p>}
        <button data-testid="btn-add-pr" onClick={handleAddPR}>
          Add PR
        </button>
      </section>

      <section aria-label="Filter PRs">
        <button
          data-testid="filter-all"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          data-testid="filter-open"
          aria-pressed={filter === "open"}
          onClick={() => setFilter("open")}
        >
          Open
        </button>
        <button
          data-testid="filter-merged"
          aria-pressed={filter === "merged"}
          onClick={() => setFilter("merged")}
        >
          Merged
        </button>
      </section>

      <section aria-label="PR list">
        {filtered.map((pr) => (
          <div key={pr.id} data-testid={`pr-card-${pr.id}`}>
            <h2 data-testid={`pr-title-${pr.id}`}>
              #{pr.prNumber} {pr.title}
            </h2>
            <span data-testid={`pr-author-${pr.id}`}>{pr.author}</span>
            <span data-testid={`pr-status-${pr.id}`}>{pr.status}</span>
            <span data-testid={`pr-completion-${pr.id}`}>
              {completionText(pr)}
            </span>

            <ul>
              {pr.items.map((item) => (
                <li key={item.id} data-testid={`item-${pr.id}-${item.id}`}>
                  <input
                    type="checkbox"
                    data-testid={`checkbox-${pr.id}-${item.id}`}
                    checked={item.checked}
                    onChange={() => handleToggleItem(pr.id, item.id)}
                  />
                  <span data-testid={`item-label-${pr.id}-${item.id}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            <div>
              <input
                data-testid={`item-input-${pr.id}`}
                value={itemInputs[pr.id] || ""}
                onChange={(e) =>
                  setItemInputs({ ...itemInputs, [pr.id]: e.target.value })
                }
                placeholder="New checklist item"
              />
              <button
                data-testid={`btn-add-item-${pr.id}`}
                onClick={() => handleAddItem(pr.id)}
              >
                Add Item
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
