import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addGroup, deleteGroup } from "../../lib/store";
import type { Subject, MeetingFormat } from "../../lib/types";

const SUBJECTS: Subject[] = ["Math", "Science", "History", "English", "Computer Science", "Art"];
const FORMATS: MeetingFormat[] = ["in-person", "online", "hybrid"];

export default function GroupsPage() {
  const { groups, setGroups } = useApp();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState<Subject>("Math");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("6");
  const [format, setFormat] = useState<MeetingFormat>("online");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Name required"); return; }
    const max = parseInt(maxMembers, 10);
    if (isNaN(max) || max < 2) { setError("Max members must be at least 2"); return; }
    const g = addGroup({ name: name.trim(), subject, description, maxMembers: max, memberIds: [], meetingFormat: format });
    setGroups([...groups, g]);
    setName(""); setDescription(""); setError("");
  }

  function handleDelete(id: string) {
    deleteGroup(id);
    setGroups(groups.filter(g => g.id !== id));
  }

  return (
    <div data-testid="groups-page">
      <h2>Study Groups</h2>
      {error && <div data-testid="group-error">{error}</div>}
      <ul data-testid="group-list">
        {groups.map(g => (
          <li key={g.id} data-testid={`group-item-${g.id}`}>
            <span data-testid={`group-name-${g.id}`}>{g.name}</span>
            <span data-testid={`group-subject-${g.id}`}>{g.subject}</span>
            <span data-testid={`group-format-${g.id}`}>{g.meetingFormat}</span>
            <span data-testid={`group-count-${g.id}`}>{g.memberIds.length}/{g.maxMembers}</span>
            <button data-testid={`btn-delete-group-${g.id}`} onClick={() => handleDelete(g.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-group-form">
        <input data-testid="input-group-name" value={name} onChange={e => setName(e.target.value)} placeholder="Group name" />
        <select data-testid="select-subject" value={subject} onChange={e => setSubject(e.target.value as Subject)}>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input data-testid="input-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="input-max-members" value={maxMembers} onChange={e => setMaxMembers(e.target.value)} placeholder="Max members" />
        <select data-testid="select-format" value={format} onChange={e => setFormat(e.target.value as MeetingFormat)}>
          {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <button data-testid="btn-add-group" onClick={handleAdd}>Add Group</button>
      </div>
    </div>
  );
}
