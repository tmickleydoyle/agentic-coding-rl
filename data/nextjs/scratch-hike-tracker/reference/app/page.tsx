import { useState } from "react";

type Status = "planned" | "completed";

interface Hike {
  id: number;
  name: string;
  location: string;
  distance: number;
  elevationGain: number;
  status: Status;
  date: string;
}

const SEED_HIKES: Hike[] = [
  { id: 1, name: "Half Dome", location: "Yosemite, CA", distance: 16.4, elevationGain: 4800, status: "completed", date: "2024-06-10" },
  { id: 2, name: "Angels Landing", location: "Zion, CA", distance: 5.4, elevationGain: 1488, status: "completed", date: "2024-07-04" },
  { id: 3, name: "Enchantments", location: "WA", distance: 18.0, elevationGain: 2200, status: "planned", date: "2024-09-01" },
  { id: 4, name: "Havasupai Falls", location: "AZ", distance: 20.0, elevationGain: 2400, status: "planned", date: "2024-10-15" },
  { id: 5, name: "Rim-to-Rim", location: "Grand Canyon, AZ", distance: 21.0, elevationGain: 5760, status: "planned", date: "2025-05-01" },
  { id: 6, name: "Cascade Pass", location: "WA", distance: 7.4, elevationGain: 1800, status: "completed", date: "2024-08-20" },
];

export default function App() {
  const [hikes, setHikes] = useState<Hike[]>(SEED_HIKES);
  const [view, setView] = useState<"All" | "Planned" | "Completed">("All");
  const [nextId, setNextId] = useState(7);

  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDistance, setFormDistance] = useState("");
  const [formElevation, setFormElevation] = useState("");
  const [formDate, setFormDate] = useState("");

  const completedHikes = hikes.filter((h) => h.status === "completed");
  const plannedHikes = hikes.filter((h) => h.status === "planned");
  const totalMilesCompleted = completedHikes.reduce((s, h) => s + h.distance, 0);
  const totalElevationCompleted = completedHikes.reduce((s, h) => s + h.elevationGain, 0);

  const displayed =
    view === "All" ? hikes : view === "Planned" ? plannedHikes : completedHikes;

  const markDone = (id: number) => {
    setHikes(hikes.map((h) => (h.id === id ? { ...h, status: "completed" } : h)));
  };

  const removeHike = (id: number) => {
    setHikes(hikes.filter((h) => h.id !== id));
  };

  const addHike = () => {
    if (!formName.trim() || !formDistance || parseFloat(formDistance) <= 0) return;
    setHikes([
      ...hikes,
      {
        id: nextId,
        name: formName.trim(),
        location: formLocation,
        distance: parseFloat(formDistance),
        elevationGain: formElevation ? parseInt(formElevation, 10) : 0,
        status: "planned",
        date: formDate,
      },
    ]);
    setNextId(nextId + 1);
    setFormName("");
    setFormLocation("");
    setFormDistance("");
    setFormElevation("");
    setFormDate("");
  };

  return (
    <div>
      <h1>Hike Tracker</h1>

      <div data-testid="stats">
        <span data-testid="stat-planned">{plannedHikes.length} planned</span>
        <span data-testid="stat-completed">{completedHikes.length} completed</span>
        <span data-testid="stat-miles">{totalMilesCompleted.toFixed(1)} mi completed</span>
        <span data-testid="stat-elevation">{totalElevationCompleted} ft gained</span>
      </div>

      <div data-testid="filter-bar">
        {(["All", "Planned", "Completed"] as const).map((v) => (
          <button
            key={v}
            data-testid={`filter-${v.toLowerCase()}`}
            onClick={() => setView(v)}
            aria-pressed={view === v}
          >
            {v}
          </button>
        ))}
      </div>

      <div data-testid="hike-list">
        {displayed.map((hike) => (
          <div key={hike.id} data-testid={`hike-${hike.id}`}>
            <span data-testid={`hike-name-${hike.id}`}>{hike.name}</span>
            <span data-testid={`hike-location-${hike.id}`}>{hike.location}</span>
            <span data-testid={`hike-distance-${hike.id}`}>{hike.distance.toFixed(1)} mi</span>
            <span data-testid={`hike-elevation-${hike.id}`}>{hike.elevationGain} ft</span>
            <span data-testid={`hike-date-${hike.id}`}>{hike.date}</span>
            {hike.status === "completed" ? (
              <span data-testid={`completed-label-${hike.id}`}>Completed</span>
            ) : (
              <span data-testid={`planned-label-${hike.id}`}>Planned</span>
            )}
            {hike.status === "planned" && (
              <button data-testid={`mark-done-${hike.id}`} onClick={() => markDone(hike.id)}>
                Mark Done
              </button>
            )}
            <button data-testid={`remove-${hike.id}`} onClick={() => removeHike(hike.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div data-testid="add-hike-form">
        <input
          data-testid="form-name"
          type="text"
          placeholder="Hike name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <input
          data-testid="form-location"
          type="text"
          placeholder="Location"
          value={formLocation}
          onChange={(e) => setFormLocation(e.target.value)}
        />
        <input
          data-testid="form-distance"
          type="number"
          placeholder="Distance (mi)"
          value={formDistance}
          onChange={(e) => setFormDistance(e.target.value)}
        />
        <input
          data-testid="form-elevation"
          type="number"
          placeholder="Elevation gain (ft)"
          value={formElevation}
          onChange={(e) => setFormElevation(e.target.value)}
        />
        <input
          data-testid="form-date"
          type="date"
          value={formDate}
          onChange={(e) => setFormDate(e.target.value)}
        />
        <button data-testid="add-hike-btn" onClick={addHike}>
          Add Hike
        </button>
      </div>
    </div>
  );
}
