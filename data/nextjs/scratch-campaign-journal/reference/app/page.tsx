import React, { useState } from "react";

interface Session {
  id: number;
  title: string;
  date: string;
  summary: string;
  xp: number;
  characters: string[];
}

type QuestStatus = "active" | "completed" | "failed";

interface Quest {
  id: number;
  name: string;
  status: QuestStatus;
  reward: string;
}

const SEED_SESSIONS: Session[] = [
  { id: 1, title: "The Dark Forest", date: "2024-01-10", summary: "Party entered the cursed forest and fought a wraith", xp: 300, characters: ["Aria", "Brom"] },
  { id: 2, title: "City of Shadows", date: "2024-02-14", summary: "Infiltrated the thieves guild headquarters", xp: 450, characters: ["Aria", "Brom", "Corvus"] },
  { id: 3, title: "Dragon's Lair", date: "2024-03-20", summary: "Defeated the ancient dragon Xaroth", xp: 1200, characters: ["Aria", "Brom", "Corvus"] },
];

const SEED_QUESTS: Quest[] = [
  { id: 1, name: "Find the Lost Artifact", status: "active", reward: "500 gold" },
  { id: 2, name: "Defeat the Lich King", status: "completed", reward: "Legendary sword" },
  { id: 3, name: "Rescue the Village Elder", status: "failed", reward: "100 gold" },
];

let nextSessionId = 4;
let nextQuestId = 4;

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [quests, setQuests] = useState<Quest[]>(SEED_QUESTS);

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionSummary, setSessionSummary] = useState("");
  const [sessionXp, setSessionXp] = useState("");

  const [questName, setQuestName] = useState("");
  const [questReward, setQuestReward] = useState("");

  const totalSessions = sessions.length;
  const totalXp = sessions.reduce((sum, s) => sum + s.xp, 0);
  const activeQuests = quests.filter((q) => q.status === "active").length;

  function handleAddSession() {
    const trimTitle = sessionTitle.trim();
    const trimSummary = sessionSummary.trim();
    if (!trimTitle || !sessionDate || !trimSummary) return;
    const xp = Math.max(0, parseInt(sessionXp, 10) || 0);
    const newSession: Session = {
      id: nextSessionId++,
      title: trimTitle,
      date: sessionDate,
      summary: trimSummary,
      xp,
      characters: [],
    };
    setSessions((prev) => [...prev, newSession]);
    setSessionTitle("");
    setSessionDate("");
    setSessionSummary("");
    setSessionXp("");
  }

  function handleDeleteSession(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function handleAddQuest() {
    const trimName = questName.trim();
    if (!trimName) return;
    const newQuest: Quest = {
      id: nextQuestId++,
      name: trimName,
      status: "active",
      reward: questReward.trim(),
    };
    setQuests((prev) => [...prev, newQuest]);
    setQuestName("");
    setQuestReward("");
  }

  function handleCompleteQuest(id: number) {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "completed" } : q))
    );
  }

  function handleFailQuest(id: number) {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "failed" } : q))
    );
  }

  function handleRemoveQuest(id: number) {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  }

  return (
    <div>
      <h1>Campaign Journal</h1>

      <div>
        <span data-testid="total-sessions">{totalSessions}</span>
        <span data-testid="total-xp">{totalXp}</span>
        <span data-testid="active-quests">{activeQuests}</span>
      </div>

      <div>
        <input
          data-testid="session-title-input"
          type="text"
          value={sessionTitle}
          onChange={(e) => setSessionTitle(e.target.value)}
          placeholder="Session title"
        />
        <input
          data-testid="session-date-input"
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
        />
        <textarea
          data-testid="session-summary-input"
          value={sessionSummary}
          onChange={(e) => setSessionSummary(e.target.value)}
          placeholder="Session summary"
        />
        <input
          data-testid="session-xp-input"
          type="number"
          value={sessionXp}
          onChange={(e) => setSessionXp(e.target.value)}
          min={0}
          placeholder="XP gained"
        />
        <button data-testid="add-session-btn" onClick={handleAddSession}>
          Add Session
        </button>
      </div>

      <div>
        {sessions.map((session) => (
          <div key={session.id} data-testid={`session-card-${session.id}`}>
            <span data-testid={`session-title-${session.id}`}>{session.title}</span>
            <span data-testid={`session-date-${session.id}`}>{session.date}</span>
            <span data-testid={`session-summary-${session.id}`}>{session.summary}</span>
            <span data-testid={`session-xp-${session.id}`}>{session.xp} XP</span>
            <span data-testid={`session-characters-${session.id}`}>
              {session.characters.join(", ")}
            </span>
            <button
              data-testid={`delete-session-${session.id}`}
              onClick={() => handleDeleteSession(session.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          data-testid="quest-name-input"
          type="text"
          value={questName}
          onChange={(e) => setQuestName(e.target.value)}
          placeholder="Quest name"
        />
        <input
          data-testid="quest-reward-input"
          type="text"
          value={questReward}
          onChange={(e) => setQuestReward(e.target.value)}
          placeholder="Reward"
        />
        <button data-testid="add-quest-btn" onClick={handleAddQuest}>
          Add Quest
        </button>
      </div>

      <div>
        {quests.map((quest) => (
          <div key={quest.id} data-testid={`quest-card-${quest.id}`}>
            <span data-testid={`quest-name-${quest.id}`}>{quest.name}</span>
            <span data-testid={`quest-status-${quest.id}`}>{quest.status}</span>
            <span data-testid={`quest-reward-${quest.id}`}>{quest.reward}</span>
            {quest.status === "active" && (
              <>
                <button
                  data-testid={`complete-quest-${quest.id}`}
                  onClick={() => handleCompleteQuest(quest.id)}
                >
                  Complete
                </button>
                <button
                  data-testid={`fail-quest-${quest.id}`}
                  onClick={() => handleFailQuest(quest.id)}
                >
                  Fail
                </button>
              </>
            )}
            <button
              data-testid={`remove-quest-${quest.id}`}
              onClick={() => handleRemoveQuest(quest.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
