import React, { useState } from "react";

type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type Subject = "Math" | "Science" | "English" | "History";

interface Activity {
  id: number;
  day: Day;
  title: string;
  subject: Subject;
  duration: number;
  completed: boolean;
}

const SEED_ACTIVITIES: Activity[] = [
  { id: 1, day: "Monday", title: "Introduction to Fractions", subject: "Math", duration: 30, completed: false },
  { id: 2, day: "Monday", title: "Reading Comprehension", subject: "English", duration: 45, completed: true },
  { id: 3, day: "Wednesday", title: "States of Matter", subject: "Science", duration: 40, completed: false },
  { id: 4, day: "Friday", title: "Ancient Rome", subject: "History", duration: 35, completed: false },
];

const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SUBJECTS: Subject[] = ["Math", "Science", "English", "History"];

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [filterDay, setFilterDay] = useState<string>("All");
  const [title, setTitle] = useState("");
  const [day, setDay] = useState<Day>("Monday");
  const [subject, setSubject] = useState<Subject>("Math");
  const [duration, setDuration] = useState<number>(30);

  const visible = activities.filter(
    (a) => filterDay === "All" || a.day === filterDay
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const newId = activities.length > 0 ? Math.max(...activities.map((a) => a.id)) + 1 : 1;
    const dur = duration > 0 ? duration : 30;
    setActivities([...activities, { id: newId, day, title, subject, duration: dur, completed: false }]);
    setTitle("");
    setDay("Monday");
    setSubject("Math");
    setDuration(30);
  }

  function handleComplete(id: number) {
    setActivities(activities.map((a) => (a.id === id ? { ...a, completed: true } : a)));
  }

  function handleDelete(id: number) {
    setActivities(activities.filter((a) => a.id !== id));
  }

  const totalMinutes = visible.reduce((sum, a) => sum + a.duration, 0);
  const completedCount = visible.filter((a) => a.completed).length;

  return (
    <div>
      <h1 data-testid="app-title">Lesson Plan</h1>

      <form data-testid="add-form" onSubmit={handleAdd}>
        <input
          data-testid="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity title"
        />
        <select
          data-testid="select-day"
          value={day}
          onChange={(e) => setDay(e.target.value as Day)}
        >
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          data-testid="select-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as Subject)}
        >
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          data-testid="input-duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <button data-testid="btn-add" type="submit">Add Activity</button>
      </form>

      <select
        data-testid="filter-day"
        value={filterDay}
        onChange={(e) => setFilterDay(e.target.value)}
      >
        <option value="All">All</option>
        {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <div data-testid="total-activities">Total: {visible.length} activities</div>
      <div data-testid="total-minutes">Total: {totalMinutes} min</div>
      <div data-testid="completed-count">{completedCount} completed</div>

      <div data-testid="activity-list">
        {visible.map((a) => (
          <div key={a.id} data-testid={`activity-item-${a.id}`}>
            <span data-testid={`activity-title-${a.id}`}>{a.title}</span>
            <span data-testid={`activity-day-${a.id}`}>{a.day}</span>
            <span data-testid={`activity-subject-${a.id}`}>{a.subject}</span>
            <span data-testid={`activity-duration-${a.id}`}>{a.duration} min</span>
            <button
              data-testid={`btn-complete-${a.id}`}
              onClick={() => handleComplete(a.id)}
            >
              {a.completed ? "Done" : "Mark Done"}
            </button>
            <button
              data-testid={`btn-delete-${a.id}`}
              onClick={() => handleDelete(a.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
