import React, { useState } from "react";

const TODAY = "2024-07-01";

interface Visit {
  date: string;
  vet: string;
  diagnosis: string;
  treatment: string;
  nextAppt: string;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  visits: Visit[];
}

const INITIAL_PETS: Pet[] = [
  {
    id: 1,
    name: "Bella",
    species: "Dog",
    visits: [
      {
        date: "2024-01-15",
        vet: "Dr. Smith",
        diagnosis: "Annual checkup",
        treatment: "Vaccines",
        nextAppt: "2025-01-15",
      },
      {
        date: "2024-06-10",
        vet: "Dr. Smith",
        diagnosis: "Ear infection",
        treatment: "Antibiotics",
        nextAppt: "2024-06-24",
      },
    ],
  },
  {
    id: 2,
    name: "Mittens",
    species: "Cat",
    visits: [
      {
        date: "2024-02-20",
        vet: "Dr. Jones",
        diagnosis: "Dental cleaning",
        treatment: "Cleaning + polish",
        nextAppt: "2025-02-20",
      },
    ],
  },
];

export default function App() {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [selectedPetId, setSelectedPetId] = useState<number>(1);
  const [dateInput, setDateInput] = useState("");
  const [vetInput, setVetInput] = useState("");
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [treatmentInput, setTreatmentInput] = useState("");
  const [nextInput, setNextInput] = useState("");

  const selectedPet = pets.find((p) => p.id === selectedPetId)!;
  const sortedVisits = [...selectedPet.visits].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  function selectPet(id: number) {
    setSelectedPetId(id);
    clearForm();
  }

  function clearForm() {
    setDateInput("");
    setVetInput("");
    setDiagnosisInput("");
    setTreatmentInput("");
    setNextInput("");
  }

  function addVisit(e: React.FormEvent) {
    e.preventDefault();
    if (!dateInput.trim() || !vetInput.trim()) return;
    const visit: Visit = {
      date: dateInput,
      vet: vetInput,
      diagnosis: diagnosisInput,
      treatment: treatmentInput,
      nextAppt: nextInput,
    };
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== selectedPetId) return pet;
        return { ...pet, visits: [...pet.visits, visit] };
      })
    );
    clearForm();
  }

  function deleteVisit(index: number) {
    const target = sortedVisits[index];
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== selectedPetId) return pet;
        let removed = false;
        const newVisits = pet.visits.filter((v) => {
          if (!removed && v.date === target.date && v.vet === target.vet && v.diagnosis === target.diagnosis) {
            removed = true;
            return false;
          }
          return true;
        });
        return { ...pet, visits: newVisits };
      })
    );
  }

  function getNextAppt(): string {
    const future = sortedVisits
      .filter((v) => v.nextAppt && v.nextAppt > TODAY)
      .map((v) => v.nextAppt)
      .sort();
    if (future.length === 0) return "No upcoming appointments";
    return `Next appointment: ${future[0]}`;
  }

  return (
    <div>
      <h1>Vet Visit Log</h1>

      <div data-testid="pet-selector">
        {pets.map((pet) => (
          <button
            key={pet.id}
            data-testid={`pet-btn-${pet.name.toLowerCase()}`}
            onClick={() => selectPet(pet.id)}
            style={{ fontWeight: selectedPetId === pet.id ? "bold" : "normal" }}
          >
            {pet.name}
          </button>
        ))}
      </div>

      <div data-testid="pet-info">
        <span data-testid="pet-name">{selectedPet.name}</span>
        {" — "}
        <span data-testid="pet-species">{selectedPet.species}</span>
      </div>

      <div data-testid="next-appt-banner">{getNextAppt()}</div>

      {sortedVisits.length === 0 ? (
        <p data-testid="no-visits-msg">No visits recorded</p>
      ) : (
        <table data-testid="visit-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vet</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Next Appt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedVisits.map((visit, i) => (
              <tr key={i} data-testid={`visit-row-${i}`}>
                <td>{visit.date}</td>
                <td>{visit.vet}</td>
                <td>{visit.diagnosis}</td>
                <td>{visit.treatment}</td>
                <td>{visit.nextAppt}</td>
                <td>
                  <button
                    data-testid={`delete-visit-${i}`}
                    onClick={() => deleteVisit(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={addVisit} data-testid="add-visit-form">
        <h2>Add Visit</h2>
        <label>
          Visit Date
          <input
            type="date"
            data-testid="visit-date-input"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </label>
        <label>
          Vet Name
          <input
            data-testid="visit-vet-input"
            value={vetInput}
            onChange={(e) => setVetInput(e.target.value)}
          />
        </label>
        <label>
          Diagnosis
          <input
            data-testid="visit-diagnosis-input"
            value={diagnosisInput}
            onChange={(e) => setDiagnosisInput(e.target.value)}
          />
        </label>
        <label>
          Treatment
          <input
            data-testid="visit-treatment-input"
            value={treatmentInput}
            onChange={(e) => setTreatmentInput(e.target.value)}
          />
        </label>
        <label>
          Next Appointment
          <input
            type="date"
            data-testid="visit-next-input"
            value={nextInput}
            onChange={(e) => setNextInput(e.target.value)}
          />
        </label>
        <button type="submit">Add Visit</button>
      </form>
    </div>
  );
}
