import React, { useState } from "react";

interface Profile {
  id: number;
  name: string;
  layer_height_mm: number;
  infill_pct: number;
  supports: boolean;
  material: string;
  nozzle_temp_c: number;
  bed_temp_c: number;
}

interface EditState {
  name: string;
  layer_height_mm: string;
  infill_pct: string;
  supports: boolean;
  material: string;
  nozzle_temp_c: string;
  bed_temp_c: string;
}

const SEED_PROFILES: Profile[] = [
  { id: 1, name: "Draft Quality", layer_height_mm: 0.3, infill_pct: 15, supports: false, material: "PLA", nozzle_temp_c: 200, bed_temp_c: 60 },
  { id: 2, name: "Standard", layer_height_mm: 0.2, infill_pct: 20, supports: false, material: "PLA", nozzle_temp_c: 205, bed_temp_c: 60 },
  { id: 3, name: "Fine Detail", layer_height_mm: 0.1, infill_pct: 25, supports: true, material: "PETG", nozzle_temp_c: 230, bed_temp_c: 75 },
];

let nextId = 4;

function profileToEditState(p: Profile): EditState {
  return {
    name: p.name,
    layer_height_mm: String(p.layer_height_mm),
    infill_pct: String(p.infill_pct),
    supports: p.supports,
    material: p.material,
    nozzle_temp_c: String(p.nozzle_temp_c),
    bed_temp_c: String(p.bed_temp_c),
  };
}

function isValidEdit(e: EditState): boolean {
  const layer = parseFloat(e.layer_height_mm);
  const infill = parseInt(e.infill_pct, 10);
  const nozzle = parseInt(e.nozzle_temp_c, 10);
  const bed = parseInt(e.bed_temp_c, 10);
  if (!e.name.trim() || !e.material.trim()) return false;
  if (isNaN(layer) || layer <= 0) return false;
  if (isNaN(infill) || infill < 0 || infill > 100) return false;
  if (isNaN(nozzle) || nozzle <= 0) return false;
  if (isNaN(bed) || bed < 0) return false;
  return true;
}

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);

  const [newName, setNewName] = useState("");
  const [newLayer, setNewLayer] = useState("");
  const [newInfill, setNewInfill] = useState("");
  const [newSupports, setNewSupports] = useState(false);
  const [newMaterial, setNewMaterial] = useState("");
  const [newNozzle, setNewNozzle] = useState("");
  const [newBed, setNewBed] = useState("");

  function saveProfile() {
    const e: EditState = {
      name: newName, layer_height_mm: newLayer, infill_pct: newInfill,
      supports: newSupports, material: newMaterial, nozzle_temp_c: newNozzle, bed_temp_c: newBed,
    };
    if (!isValidEdit(e)) return;
    const p: Profile = {
      id: nextId++,
      name: newName.trim(),
      layer_height_mm: parseFloat(newLayer),
      infill_pct: parseInt(newInfill, 10),
      supports: newSupports,
      material: newMaterial.trim(),
      nozzle_temp_c: parseInt(newNozzle, 10),
      bed_temp_c: parseInt(newBed, 10),
    };
    setProfiles((prev) => [...prev, p]);
    setNewName(""); setNewLayer(""); setNewInfill(""); setNewSupports(false);
    setNewMaterial(""); setNewNozzle(""); setNewBed("");
  }

  function startEdit(profile: Profile) {
    setEditingId(profile.id);
    setEditState(profileToEditState(profile));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState(null);
  }

  function saveEdit(id: number) {
    if (!editState || !isValidEdit(editState)) return;
    setProfiles((prev) => prev.map((p) =>
      p.id === id ? {
        ...p,
        name: editState.name.trim(),
        layer_height_mm: parseFloat(editState.layer_height_mm),
        infill_pct: parseInt(editState.infill_pct, 10),
        supports: editState.supports,
        material: editState.material.trim(),
        nozzle_temp_c: parseInt(editState.nozzle_temp_c, 10),
        bed_temp_c: parseInt(editState.bed_temp_c, 10),
      } : p
    ));
    setEditingId(null);
    setEditState(null);
  }

  function duplicateProfile(profile: Profile) {
    const copy: Profile = { ...profile, id: nextId++, name: `Copy of ${profile.name}` };
    setProfiles((prev) => [...prev, copy]);
  }

  function deleteProfile(id: number) {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) { setEditingId(null); setEditState(null); }
  }

  return (
    <div>
      <h1>Print Settings</h1>

      <div>
        <input aria-label="Profile name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Profile name" />
        <input aria-label="Layer height (mm)" type="number" value={newLayer} onChange={(e) => setNewLayer(e.target.value)} placeholder="Layer height (mm)" />
        <input aria-label="Infill %" type="number" value={newInfill} onChange={(e) => setNewInfill(e.target.value)} placeholder="Infill %" />
        <label>
          <input type="checkbox" aria-label="Supports" checked={newSupports} onChange={(e) => setNewSupports(e.target.checked)} />
          Supports
        </label>
        <input aria-label="Material" value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} placeholder="Material" />
        <input aria-label="Nozzle temp (C)" type="number" value={newNozzle} onChange={(e) => setNewNozzle(e.target.value)} placeholder="Nozzle temp (C)" />
        <input aria-label="Bed temp (C)" type="number" value={newBed} onChange={(e) => setNewBed(e.target.value)} placeholder="Bed temp (C)" />
        <button onClick={saveProfile}>Save Profile</button>
      </div>

      <ul>
        {profiles.map((profile) => {
          const isEditing = editingId === profile.id;
          return (
            <li key={profile.id}>
              {isEditing && editState ? (
                <span>
                  <input aria-label="Edit name" value={editState.name} onChange={(e) => setEditState({ ...editState, name: e.target.value })} />
                  <input aria-label="Edit layer height" type="number" value={editState.layer_height_mm} onChange={(e) => setEditState({ ...editState, layer_height_mm: e.target.value })} />
                  <input aria-label="Edit infill" type="number" value={editState.infill_pct} onChange={(e) => setEditState({ ...editState, infill_pct: e.target.value })} />
                  <input aria-label="Edit supports" type="checkbox" checked={editState.supports} onChange={(e) => setEditState({ ...editState, supports: e.target.checked })} />
                  <input aria-label="Edit material" value={editState.material} onChange={(e) => setEditState({ ...editState, material: e.target.value })} />
                  <input aria-label="Edit nozzle temp" type="number" value={editState.nozzle_temp_c} onChange={(e) => setEditState({ ...editState, nozzle_temp_c: e.target.value })} />
                  <input aria-label="Edit bed temp" type="number" value={editState.bed_temp_c} onChange={(e) => setEditState({ ...editState, bed_temp_c: e.target.value })} />
                  <button data-testid={`profile-save-${profile.id}`} onClick={() => saveEdit(profile.id)}>Save</button>
                  <button data-testid={`profile-cancel-${profile.id}`} onClick={cancelEdit}>Cancel</button>
                </span>
              ) : (
                <span>
                  <span data-testid={`profile-name-${profile.id}`}>{profile.name}</span>
                  <span data-testid={`profile-layer-${profile.id}`}>{profile.layer_height_mm}</span>
                  <span data-testid={`profile-infill-${profile.id}`}>{profile.infill_pct}</span>
                  <span data-testid={`profile-supports-${profile.id}`}>{String(profile.supports)}</span>
                  <span data-testid={`profile-material-${profile.id}`}>{profile.material}</span>
                  <span data-testid={`profile-nozzle-${profile.id}`}>{profile.nozzle_temp_c}</span>
                  <span data-testid={`profile-bed-${profile.id}`}>{profile.bed_temp_c}</span>
                  <button data-testid={`profile-edit-${profile.id}`} onClick={() => startEdit(profile)}>Edit</button>
                </span>
              )}
              <button data-testid={`profile-duplicate-${profile.id}`} onClick={() => duplicateProfile(profile)}>Duplicate</button>
              <button data-testid={`profile-delete-${profile.id}`} onClick={() => deleteProfile(profile.id)}>Delete</button>
            </li>
          );
        })}
      </ul>

      <div data-testid="profile-count">{profiles.length} profiles</div>
    </div>
  );
}
