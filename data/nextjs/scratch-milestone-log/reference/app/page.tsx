import { useState } from "react";

type Category = "motor" | "social" | "cognitive" | "language";

interface Milestone {
  id: number;
  category: Category;
  title: string;
  date: string;
  ageMonths: number;
  description: string;
  achieved: boolean;
}

const SEED_MILESTONES: Milestone[] = [
  { id: 1, category: "motor", title: "First smile", date: "2024-02-10", ageMonths: 1, description: "Smiled at mom for the first time", achieved: true },
  { id: 2, category: "motor", title: "Holds head up", date: "2024-03-01", ageMonths: 2, description: "Held head steady during tummy time", achieved: true },
  { id: 3, category: "social", title: "Laughed out loud", date: "2024-04-15", ageMonths: 3, description: "First real laugh while playing", achieved: true },
  { id: 4, category: "cognitive", title: "Reaches for objects", date: "2024-05-01", ageMonths: 4, description: "Started reaching for toys", achieved: false },
  { id: 5, category: "language", title: "Says mama", date: "2024-09-01", ageMonths: 8, description: "First word!", achieved: false },
];

export default function App() {
  const [milestones, setMilestones] = useState<Milestone[]>(SEED_MILESTONES);
  const [category, setCategory] = useState<Category>("motor");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [ageMonths, setAgeMonths] = useState("0");
  const [description, setDescription] = useState("");
  const [achieved, setAchieved] = useState(false);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [nextId, setNextId] = useState(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    const entry: Milestone = {
      id: nextId,
      category,
      title,
      date,
      ageMonths: parseInt(ageMonths) || 0,
      description,
      achieved,
    };
    setMilestones([entry, ...milestones]);
    setNextId(nextId + 1);
    setTitle("");
    setDate("");
    setAgeMonths("0");
    setDescription("");
    setAchieved(false);
  };

  const handleDelete = (id: number) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const filtered =
    filter === "all" ? milestones : milestones.filter((m) => m.category === filter);

  const totalMilestones = milestones.length;
  const achievedCount = milestones.filter((m) => m.achieved).length;
  const pendingCount = totalMilestones - achievedCount;

  return (
    <div>
      <h1>Milestone Log</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="motor">Motor</option>
          <option value="social">Social</option>
          <option value="cognitive">Cognitive</option>
          <option value="language">Language</option>
        </select>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="age-months">Age (months)</label>
        <input
          id="age-months"
          type="number"
          value={ageMonths}
          onChange={(e) => setAgeMonths(e.target.value)}
          min="0"
        />

        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="achieved">Achieved</label>
        <input
          id="achieved"
          type="checkbox"
          checked={achieved}
          onChange={(e) => setAchieved(e.target.checked)}
        />

        <button type="submit">Add Milestone</button>
      </form>

      <div>
        <span data-testid="total-milestones">Total: {totalMilestones}</span>
        <span data-testid="achieved-count">Achieved: {achievedCount}</span>
        <span data-testid="pending-count">Pending: {pendingCount}</span>
      </div>

      <label htmlFor="filter-category">Filter by Category</label>
      <select
        id="filter-category"
        value={filter}
        onChange={(e) => setFilter(e.target.value as Category | "all")}
      >
        <option value="all">All</option>
        <option value="motor">Motor</option>
        <option value="social">Social</option>
        <option value="cognitive">Cognitive</option>
        <option value="language">Language</option>
      </select>

      <ul>
        {filtered.map((m) => (
          <li key={m.id} data-testid="milestone-item">
            <span data-testid="milestone-category">{m.category}</span>
            <span data-testid="milestone-title">{m.title}</span>
            <span data-testid="milestone-date">{m.date}</span>
            <span data-testid="milestone-age">{m.ageMonths}</span>
            <span data-testid="milestone-description">{m.description}</span>
            <span data-testid="milestone-achieved">{m.achieved ? "Yes" : "No"}</span>
            <button onClick={() => handleDelete(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
