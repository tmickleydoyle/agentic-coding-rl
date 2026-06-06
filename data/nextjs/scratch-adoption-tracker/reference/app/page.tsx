import React, { useState } from "react";

type Status = "Available" | "Pending" | "Adopted";
type FilterType = "All" | Status;

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  status: Status;
  applicant: string;
  notes: string;
}

const INITIAL_PETS: Pet[] = [
  { id: 1, name: "Daisy", species: "Dog", breed: "Beagle", age: 2, status: "Available", applicant: "", notes: "Friendly and energetic" },
  { id: 2, name: "Oliver", species: "Cat", breed: "Tabby", age: 4, status: "Pending", applicant: "Jane Doe", notes: "Calm indoor cat" },
  { id: 3, name: "Nibbles", species: "Rabbit", breed: "Lop", age: 1, status: "Adopted", applicant: "Bob Smith", notes: "Loves veggies" },
  { id: 4, name: "Spike", species: "Dog", breed: "Bulldog", age: 3, status: "Available", applicant: "", notes: "" },
];

export default function App() {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [filter, setFilter] = useState<FilterType>("All");
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<Status>("Available");
  const [editApplicant, setEditApplicant] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const [addName, setAddName] = useState("");
  const [addSpecies, setAddSpecies] = useState("");
  const [addBreed, setAddBreed] = useState("");
  const [addAge, setAddAge] = useState("");

  const filteredPets = filter === "All" ? pets : pets.filter((p) => p.status === filter);

  function selectPet(pet: Pet) {
    setSelectedPetId(pet.id);
    setEditStatus(pet.status);
    setEditApplicant(pet.applicant);
    setEditNotes(pet.notes);
  }

  function saveChanges() {
    setPets((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPetId) return p;
        return {
          ...p,
          status: editStatus,
          applicant: editStatus === "Available" ? "" : editApplicant,
          notes: editNotes,
        };
      })
    );
    setSelectedPetId(null);
  }

  function cancelEdit() {
    setSelectedPetId(null);
  }

  function addPet(e: React.FormEvent) {
    e.preventDefault();
    if (!addName.trim() || !addSpecies.trim()) return;
    const newId = pets.length > 0 ? Math.max(...pets.map((p) => p.id)) + 1 : 1;
    const pet: Pet = {
      id: newId,
      name: addName.trim(),
      species: addSpecies.trim(),
      breed: addBreed.trim(),
      age: Number(addAge) || 0,
      status: "Available",
      applicant: "",
      notes: "",
    };
    setPets((prev) => [...prev, pet]);
    setAddName("");
    setAddSpecies("");
    setAddBreed("");
    setAddAge("");
  }

  const countAvailable = pets.filter((p) => p.status === "Available").length;
  const countPending = pets.filter((p) => p.status === "Pending").length;
  const countAdopted = pets.filter((p) => p.status === "Adopted").length;

  return (
    <div>
      <h1>Pet Adoption Tracker</h1>

      <div data-testid="summary-counts">
        <span data-testid="count-available">Available: {countAvailable}</span>
        {" | "}
        <span data-testid="count-pending">Pending: {countPending}</span>
        {" | "}
        <span data-testid="count-adopted">Adopted: {countAdopted}</span>
      </div>

      <div data-testid="filter-bar">
        {(["All", "Available", "Pending", "Adopted"] as FilterType[]).map((f) => (
          <button
            key={f}
            data-testid={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div data-testid="pets-list">
        {filteredPets.length === 0 ? (
          <p data-testid="no-pets-msg">No pets found</p>
        ) : (
          filteredPets.map((pet) => (
            <div
              key={pet.id}
              data-testid={`pet-card-${pet.id}`}
              onClick={() => selectPet(pet)}
              style={{ cursor: "pointer", border: "1px solid #ccc", margin: "4px", padding: "8px" }}
            >
              <strong data-testid={`pet-card-name-${pet.id}`}>{pet.name}</strong>
              {" — "}{pet.species} | {pet.breed} | {pet.age} yrs
              <div data-testid={`pet-status-${pet.id}`}>{pet.status}</div>
              <div data-testid={`pet-applicant-${pet.id}`}>{pet.applicant}</div>
              <div data-testid={`pet-notes-${pet.id}`}>{pet.notes}</div>
            </div>
          ))
        )}
      </div>

      {selectedPetId !== null && (
        <div data-testid="edit-panel">
          <h2>Edit Pet</h2>
          <label>
            Status
            <select
              data-testid="edit-status-select"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as Status)}
            >
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </label>
          <label>
            Applicant
            <input
              data-testid="edit-applicant-input"
              value={editApplicant}
              onChange={(e) => setEditApplicant(e.target.value)}
            />
          </label>
          <label>
            Notes
            <textarea
              data-testid="edit-notes-textarea"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />
          </label>
          <button data-testid="save-changes-btn" onClick={saveChanges}>Save Changes</button>
          <button data-testid="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
        </div>
      )}

      <form onSubmit={addPet} data-testid="add-pet-form">
        <h2>Add Pet</h2>
        <label>
          Name
          <input
            data-testid="add-name-input"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
          />
        </label>
        <label>
          Species
          <input
            data-testid="add-species-input"
            value={addSpecies}
            onChange={(e) => setAddSpecies(e.target.value)}
          />
        </label>
        <label>
          Breed
          <input
            data-testid="add-breed-input"
            value={addBreed}
            onChange={(e) => setAddBreed(e.target.value)}
          />
        </label>
        <label>
          Age
          <input
            type="number"
            data-testid="add-age-input"
            value={addAge}
            onChange={(e) => setAddAge(e.target.value)}
          />
        </label>
        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
}
