import React, { useState } from "react";

interface Attempt {
  id: number;
  roomName: string;
  date: string;
  duration: number;
  clues: string[];
  completed: boolean;
}

const SEED_ATTEMPTS: Attempt[] = [
  {
    id: 1,
    roomName: "The Haunted Mansion",
    date: "2024-01-15",
    duration: 58,
    clues: ["Hidden key behind mirror", "Code is 4829"],
    completed: true,
  },
  {
    id: 2,
    roomName: "Nuclear Bunker",
    date: "2024-02-20",
    duration: 60,
    clues: ["Red wire first"],
    completed: false,
  },
  {
    id: 3,
    roomName: "Pirate's Cove",
    date: "2024-03-10",
    duration: 45,
    clues: ["Map under the chest", "Compass points north", "Pearl necklace unlocks door"],
    completed: true,
  },
];

let nextId = 4;

export default function App() {
  const [attempts, setAttempts] = useState<Attempt[]>(SEED_ATTEMPTS);
  const [roomName, setRoomName] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [clueInputs, setClueInputs] = useState<Record<number, string>>({});

  const totalAttempts = attempts.length;
  const completedCount = attempts.filter((a) => a.completed).length;
  const successRate =
    totalAttempts === 0
      ? "0%"
      : `${Math.round((completedCount / totalAttempts) * 100)}%`;

  function handleAddAttempt() {
    const trimmedRoom = roomName.trim();
    const parsedDuration = parseInt(duration, 10);
    if (!trimmedRoom || !date || isNaN(parsedDuration) || parsedDuration < 1 || parsedDuration > 60) {
      return;
    }
    const newAttempt: Attempt = {
      id: nextId++,
      roomName: trimmedRoom,
      date,
      duration: parsedDuration,
      clues: [],
      completed: false,
    };
    setAttempts((prev) => [...prev, newAttempt]);
    setRoomName("");
    setDate("");
    setDuration("");
  }

  function handleDelete(id: number) {
    setAttempts((prev) => prev.filter((a) => a.id !== id));
  }

  function handleToggleStatus(id: number) {
    setAttempts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  }

  function handleAddClue(id: number) {
    const text = (clueInputs[id] || "").trim();
    if (!text) return;
    setAttempts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, clues: [...a.clues, text] } : a
      )
    );
    setClueInputs((prev) => ({ ...prev, [id]: "" }));
  }

  return (
    <div>
      <h1>Escape Room Log</h1>

      <div>
        <span data-testid="total-attempts">{totalAttempts}</span>
        <span data-testid="completed-count">{completedCount}</span>
        <span data-testid="success-rate">{successRate}</span>
      </div>

      <div>
        <input
          data-testid="room-name-input"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room name"
        />
        <input
          data-testid="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          data-testid="duration-input"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min={1}
          max={60}
          placeholder="Duration (min)"
        />
        <button data-testid="add-attempt-btn" onClick={handleAddAttempt}>
          Add Attempt
        </button>
      </div>

      <div>
        {attempts.map((attempt) => (
          <div key={attempt.id} data-testid={`attempt-card-${attempt.id}`}>
            <span data-testid={`room-name-${attempt.id}`}>{attempt.roomName}</span>
            <span data-testid={`attempt-date-${attempt.id}`}>{attempt.date}</span>
            <span data-testid={`attempt-duration-${attempt.id}`}>{attempt.duration} min</span>
            <span data-testid={`attempt-status-${attempt.id}`}>
              {attempt.completed ? "Completed" : "Failed"}
            </span>
            <button
              data-testid={`toggle-status-${attempt.id}`}
              onClick={() => handleToggleStatus(attempt.id)}
            >
              {attempt.completed ? "Mark Failed" : "Mark Complete"}
            </button>
            <button
              data-testid={`delete-attempt-${attempt.id}`}
              onClick={() => handleDelete(attempt.id)}
            >
              Delete
            </button>

            <div>
              <span data-testid={`clue-count-${attempt.id}`}>{attempt.clues.length}</span>
              <ul>
                {attempt.clues.map((clue, idx) => (
                  <li key={idx} data-testid={`clue-item-${attempt.id}-${idx}`}>
                    {clue}
                  </li>
                ))}
              </ul>
              <input
                data-testid={`clue-input-${attempt.id}`}
                type="text"
                value={clueInputs[attempt.id] || ""}
                onChange={(e) =>
                  setClueInputs((prev) => ({ ...prev, [attempt.id]: e.target.value }))
                }
                placeholder="Add a clue"
              />
              <button
                data-testid={`add-clue-btn-${attempt.id}`}
                onClick={() => handleAddClue(attempt.id)}
              >
                Add Clue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
