import React, { useState } from "react";

interface VolunteerEntry {
  id: number;
  name: string;
  activity: string;
  hours: number;
  date: string;
}

const SEED_ENTRIES: VolunteerEntry[] = [
  { id: 1, name: "Alice Johnson", activity: "Park Cleanup", hours: 3, date: "2024-03-01" },
  { id: 2, name: "Bob Smith", activity: "Food Bank", hours: 5, date: "2024-03-05" },
  { id: 3, name: "Alice Johnson", activity: "Tutoring", hours: 2, date: "2024-03-10" },
  { id: 4, name: "Carol Davis", activity: "Park Cleanup", hours: 4, date: "2024-03-12" },
  { id: 5, name: "Bob Smith", activity: "Animal Shelter", hours: 6, date: "2024-03-15" },
];

let nextId = 6;

export default function App() {
  const [entries, setEntries] = useState<VolunteerEntry[]>(SEED_ENTRIES);
  const [nameInput, setNameInput] = useState("");
  const [activityInput, setActivityInput] = useState("");
  const [hoursInput, setHoursInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [filterName, setFilterName] = useState("");

  const handleAdd = () => {
    const hours = parseFloat(hoursInput);
    if (!nameInput.trim() || !activityInput.trim() || !hoursInput || !dateInput || hours <= 0) {
      return;
    }
    const newEntry: VolunteerEntry = {
      id: nextId++,
      name: nameInput.trim(),
      activity: activityInput.trim(),
      hours,
      date: dateInput,
    };
    setEntries([newEntry, ...entries]);
    setNameInput("");
    setActivityInput("");
    setHoursInput("");
    setDateInput("");
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const filteredEntries = filterName.trim()
    ? entries.filter((e) => e.name.toLowerCase().includes(filterName.toLowerCase()))
    : entries;

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  const volunteerTotals: { name: string; total: number }[] = [];
  entries.forEach((e) => {
    const existing = volunteerTotals.find((v) => v.name === e.name);
    if (existing) {
      existing.total += e.hours;
    } else {
      volunteerTotals.push({ name: e.name, total: e.hours });
    }
  });

  return (
    <div>
      <h1>Volunteer Log</h1>

      <section>
        <h2>Add Entry</h2>
        <label htmlFor="vol-name">Name</label>
        <input
          id="vol-name"
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          data-testid="input-name"
        />
        <label htmlFor="vol-activity">Activity</label>
        <input
          id="vol-activity"
          type="text"
          value={activityInput}
          onChange={(e) => setActivityInput(e.target.value)}
          data-testid="input-activity"
        />
        <label htmlFor="vol-hours">Hours</label>
        <input
          id="vol-hours"
          type="number"
          min="0.5"
          step="0.5"
          value={hoursInput}
          onChange={(e) => setHoursInput(e.target.value)}
          data-testid="input-hours"
        />
        <label htmlFor="vol-date">Date</label>
        <input
          id="vol-date"
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          data-testid="input-date"
        />
        <button onClick={handleAdd} data-testid="btn-add">
          Add Entry
        </button>
      </section>

      <section>
        <label htmlFor="filter-name">Filter by name</label>
        <input
          id="filter-name"
          type="text"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          data-testid="filter-name"
        />
      </section>

      <section>
        <h2>Entries</h2>
        {filteredEntries.length === 0 ? (
          <p data-testid="empty-message">No entries yet.</p>
        ) : (
          <ul data-testid="entries-list">
            {filteredEntries.map((entry) => (
              <li key={entry.id} data-testid={`entry-${entry.id}`}>
                <span data-testid={`entry-name-${entry.id}`}>{entry.name}</span>
                {" — "}
                <span data-testid={`entry-activity-${entry.id}`}>{entry.activity}</span>
                {" — "}
                <span data-testid={`entry-hours-${entry.id}`}>{entry.hours.toFixed(1)} hrs</span>
                {" — "}
                <span data-testid={`entry-date-${entry.id}`}>{entry.date}</span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  data-testid={`btn-delete-${entry.id}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Summary</h2>
        <p data-testid="total-hours">Total Hours: {totalHours.toFixed(1)}</p>
        <ul data-testid="volunteer-summary">
          {volunteerTotals.map((v) => (
            <li key={v.name} data-testid={`summary-${v.name.replace(/\s+/g, "-")}`}>
              {v.name}: {v.total.toFixed(1)} hrs
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
