import React, { useState } from "react";

type StationStatus = "Open" | "Closed" | "Issue";

interface Station {
  id: number;
  name: string;
  district: string;
  status: StationStatus;
  issue: string;
}

const SEED: Station[] = [
  { id: 1, name: "Lincoln Elementary", district: "North", status: "Open", issue: "" },
  { id: 2, name: "City Hall Annex", district: "Central", status: "Issue", issue: "Long lines" },
  { id: 3, name: "Riverside Community", district: "South", status: "Open", issue: "" },
  { id: 4, name: "Westpark Rec Center", district: "West", status: "Closed", issue: "" },
];

interface StationDraft {
  status: StationStatus;
  issue: string;
}

export default function App() {
  const [stations, setStations] = useState<Station[]>(SEED.map((s) => ({ ...s })));
  const [drafts, setDrafts] = useState<Record<number, StationDraft>>(() => {
    const init: Record<number, StationDraft> = {};
    SEED.forEach((s) => {
      init[s.id] = { status: s.status, issue: s.issue };
    });
    return init;
  });
  const [nameInput, setNameInput] = useState("");
  const [districtInput, setDistrictInput] = useState("");
  const [nextId, setNextId] = useState(5);

  const openCount = stations.filter((s) => s.status === "Open").length;
  const closedCount = stations.filter((s) => s.status === "Closed").length;
  const issueCount = stations.filter((s) => s.status === "Issue").length;

  function handleDraftStatus(id: number, status: StationStatus) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], status } }));
  }

  function handleDraftIssue(id: number, issue: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], issue } }));
  }

  function handleUpdate(id: number) {
    const draft = drafts[id];
    if (!draft) return;
    if (draft.status === "Issue" && !draft.issue.trim()) return;
    const newIssue = draft.status === "Issue" ? draft.issue : "";
    setStations((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: draft.status, issue: newIssue } : s
      )
    );
    setDrafts((prev) => ({ ...prev, [id]: { status: draft.status, issue: newIssue } }));
  }

  function handleAddStation() {
    if (!nameInput.trim() || !districtInput.trim()) return;
    const id = nextId;
    const newStation: Station = {
      id,
      name: nameInput.trim(),
      district: districtInput.trim(),
      status: "Open",
      issue: "",
    };
    setStations((prev) => [...prev, newStation]);
    setDrafts((prev) => ({ ...prev, [id]: { status: "Open", issue: "" } }));
    setNextId((n) => n + 1);
    setNameInput("");
    setDistrictInput("");
  }

  return (
    <div>
      <h1>Poll Watcher Dashboard</h1>
      <div>
        <span>Open: <span data-testid="open-count">{openCount}</span></span>
        <span>Closed: <span data-testid="closed-count">{closedCount}</span></span>
        <span>Issues: <span data-testid="issue-count">{issueCount}</span></span>
      </div>

      <div>
        {stations.map((s) => {
          const draft = drafts[s.id] || { status: s.status, issue: s.issue };
          return (
            <div key={s.id} data-testid="station-card">
              <span data-testid="station-name">{s.name}</span>
              <span data-testid="station-district">{s.district}</span>
              <span data-testid="station-status">{s.status}</span>
              {s.status === "Issue" && s.issue && <span>{s.issue}</span>}
              <select
                data-testid="status-select"
                value={draft.status}
                onChange={(e) => handleDraftStatus(s.id, e.target.value as StationStatus)}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Issue">Issue</option>
              </select>
              {draft.status === "Issue" && (
                <input
                  type="text"
                  data-testid="issue-input"
                  value={draft.issue}
                  onChange={(e) => handleDraftIssue(s.id, e.target.value)}
                  placeholder="Describe the issue"
                />
              )}
              <button data-testid="update-btn" onClick={() => handleUpdate(s.id)}>
                Update
              </button>
            </div>
          );
        })}
      </div>

      <div>
        <input
          type="text"
          data-testid="station-name-input"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Station name"
        />
        <input
          type="text"
          data-testid="station-district-input"
          value={districtInput}
          onChange={(e) => setDistrictInput(e.target.value)}
          placeholder="District"
        />
        <button data-testid="add-station-btn" onClick={handleAddStation}>
          Add Station
        </button>
      </div>
    </div>
  );
}
