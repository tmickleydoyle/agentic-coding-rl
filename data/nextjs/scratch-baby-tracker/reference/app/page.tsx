import { useState } from "react";

type ActivityType = "feeding" | "diaper" | "sleep";

interface Activity {
  id: number;
  type: ActivityType;
  time: string;
  note: string;
}

const SEED_ACTIVITIES: Activity[] = [
  { id: 1, type: "feeding", time: "07:00", note: "Breast milk, 4 oz" },
  { id: 2, type: "diaper", time: "08:30", note: "Wet" },
  { id: 3, type: "sleep", time: "09:00", note: "Nap, 1.5 hours" },
  { id: 4, type: "feeding", time: "11:00", note: "Formula, 5 oz" },
  { id: 5, type: "diaper", time: "12:00", note: "Dirty" },
];

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [type, setType] = useState<ActivityType>("feeding");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const [nextId, setNextId] = useState(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time.trim() || !note.trim()) return;
    const newActivity: Activity = { id: nextId, type, time, note };
    setActivities([newActivity, ...activities]);
    setNextId(nextId + 1);
    setTime("");
    setNote("");
  };

  const handleDelete = (id: number) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const filtered =
    filter === "all" ? activities : activities.filter((a) => a.type === filter);

  const countFeeding = activities.filter((a) => a.type === "feeding").length;
  const countDiaper = activities.filter((a) => a.type === "diaper").length;
  const countSleep = activities.filter((a) => a.type === "sleep").length;

  return (
    <div>
      <h1>Baby Tracker</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="activity-type">Activity Type</label>
        <select
          id="activity-type"
          value={type}
          onChange={(e) => setType(e.target.value as ActivityType)}
        >
          <option value="feeding">Feeding</option>
          <option value="diaper">Diaper</option>
          <option value="sleep">Sleep</option>
        </select>

        <label htmlFor="activity-time">Time</label>
        <input
          id="activity-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label htmlFor="activity-note">Note</label>
        <input
          id="activity-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit">Log Activity</button>
      </form>

      <div>
        <span data-testid="count-feeding">Feeding: {countFeeding}</span>
        <span data-testid="count-diaper">Diaper: {countDiaper}</span>
        <span data-testid="count-sleep">Sleep: {countSleep}</span>
      </div>

      <label htmlFor="filter-type">Filter by Type</label>
      <select
        id="filter-type"
        value={filter}
        onChange={(e) => setFilter(e.target.value as ActivityType | "all")}
      >
        <option value="all">All</option>
        <option value="feeding">Feeding</option>
        <option value="diaper">Diaper</option>
        <option value="sleep">Sleep</option>
      </select>

      <ul>
        {filtered.map((activity) => (
          <li key={activity.id} data-testid="activity-item">
            <span data-testid="activity-type">{activity.type}</span>
            <span data-testid="activity-time">{activity.time}</span>
            <span data-testid="activity-note">{activity.note}</span>
            <button onClick={() => handleDelete(activity.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
