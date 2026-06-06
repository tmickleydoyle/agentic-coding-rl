import React, { useState } from "react";

interface Command {
  name: string;
  mastery: number;
}

interface Session {
  command: string;
  duration: number;
  notes: string;
}

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  commands: Command[];
  sessions: Session[];
}

const INITIAL_DOGS: Dog[] = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 2,
    commands: [
      { name: "Sit", mastery: 90 },
      { name: "Stay", mastery: 75 },
      { name: "Shake", mastery: 60 },
      { name: "Heel", mastery: 40 },
    ],
    sessions: [],
  },
  {
    id: 2,
    name: "Luna",
    breed: "Border Collie",
    age: 1,
    commands: [
      { name: "Sit", mastery: 85 },
      { name: "Stay", mastery: 50 },
      { name: "Shake", mastery: 30 },
      { name: "Heel", mastery: 20 },
    ],
    sessions: [],
  },
  {
    id: 3,
    name: "Max",
    breed: "German Shepherd",
    age: 3,
    commands: [
      { name: "Sit", mastery: 95 },
      { name: "Stay", mastery: 88 },
      { name: "Shake", mastery: 70 },
      { name: "Heel", mastery: 65 },
    ],
    sessions: [],
  },
];

export default function App() {
  const [dogs, setDogs] = useState<Dog[]>(INITIAL_DOGS);
  const [selectedDogId, setSelectedDogId] = useState<number>(1);
  const [sessionCommand, setSessionCommand] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

  const selectedDog = dogs.find((d) => d.id === selectedDogId)!;

  function selectDog(id: number) {
    setSelectedDogId(id);
    setSessionCommand("");
    setSessionDuration("");
    setSessionNotes("");
  }

  function adjustMastery(dogId: number, commandName: string, delta: number) {
    setDogs((prev) =>
      prev.map((dog) => {
        if (dog.id !== dogId) return dog;
        return {
          ...dog,
          commands: dog.commands.map((cmd) => {
            if (cmd.name !== commandName) return cmd;
            const newVal = Math.min(100, Math.max(0, cmd.mastery + delta));
            return { ...cmd, mastery: newVal };
          }),
        };
      })
    );
  }

  function logSession(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionCommand.trim()) return;
    const entry: Session = {
      command: sessionCommand.trim(),
      duration: Number(sessionDuration) || 0,
      notes: sessionNotes,
    };
    setDogs((prev) =>
      prev.map((dog) => {
        if (dog.id !== selectedDogId) return dog;
        return { ...dog, sessions: [...dog.sessions, entry] };
      })
    );
    setSessionCommand("");
    setSessionDuration("");
    setSessionNotes("");
  }

  return (
    <div>
      <h1>Dog Training Tracker</h1>

      <div data-testid="dog-selector">
        {dogs.map((dog) => (
          <button
            key={dog.id}
            data-testid={`dog-btn-${dog.name.toLowerCase()}`}
            onClick={() => selectDog(dog.id)}
            style={{ fontWeight: selectedDogId === dog.id ? "bold" : "normal" }}
          >
            {dog.name}
          </button>
        ))}
      </div>

      <div data-testid="dog-info">
        <span data-testid="dog-name">{selectedDog.name}</span>
        {" — "}
        <span data-testid="dog-breed">{selectedDog.breed}</span>
        {", "}
        <span data-testid="dog-age">{selectedDog.age} years old</span>
      </div>

      <table data-testid="command-table">
        <thead>
          <tr>
            <th>Command</th>
            <th>Mastery</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedDog.commands.map((cmd) => (
            <tr key={cmd.name} data-testid={`command-row-${cmd.name.toLowerCase()}`}>
              <td>{cmd.name}</td>
              <td data-testid={`mastery-${cmd.name.toLowerCase()}`}>{cmd.mastery}%</td>
              <td>
                <div
                  data-testid={`progress-bar-${cmd.name.toLowerCase()}`}
                  style={{ width: `${cmd.mastery}%`, height: "10px", background: "#4caf50" }}
                />
              </td>
              <td>
                <button
                  data-testid={`increment-${cmd.name.toLowerCase()}`}
                  onClick={() => adjustMastery(selectedDog.id, cmd.name, 5)}
                >
                  +
                </button>
                <button
                  data-testid={`decrement-${cmd.name.toLowerCase()}`}
                  onClick={() => adjustMastery(selectedDog.id, cmd.name, -5)}
                >
                  −
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={logSession} data-testid="session-form">
        <h2>Log Session</h2>
        <label>
          Command
          <input
            data-testid="session-command-input"
            value={sessionCommand}
            onChange={(e) => setSessionCommand(e.target.value)}
          />
        </label>
        <label>
          Duration (min)
          <input
            type="number"
            data-testid="session-duration-input"
            value={sessionDuration}
            onChange={(e) => setSessionDuration(e.target.value)}
          />
        </label>
        <label>
          Notes
          <textarea
            data-testid="session-notes-input"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
          />
        </label>
        <button type="submit">Log Session</button>
      </form>

      <div data-testid="session-log">
        {selectedDog.sessions.length === 0 ? (
          <p data-testid="no-sessions-msg">No sessions logged yet</p>
        ) : (
          selectedDog.sessions.map((s, i) => (
            <div key={i} data-testid={`session-entry-${i}`}>
              <strong>{s.command}</strong> — {s.duration} min — {s.notes}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
