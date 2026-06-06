import { useState } from "react";

type TripStatus = "upcoming" | "completed";

interface Activity {
  id: number;
  label: string;
  done: boolean;
}

interface Trip {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  activities: Activity[];
}

let globalActivityId = 100;

const SEED_TRIPS: Trip[] = [
  {
    id: 1,
    name: "Yosemite Weekend",
    startDate: "2024-08-10",
    endDate: "2024-08-12",
    status: "upcoming",
    activities: [
      { id: globalActivityId++, label: "Drive to camp, set up site", done: true },
      { id: globalActivityId++, label: "Hike to Mirror Lake, 5 mi", done: false },
      { id: globalActivityId++, label: "Pack out, drive home", done: false },
    ],
  },
  {
    id: 2,
    name: "Desert Star Camp",
    startDate: "2024-09-20",
    endDate: "2024-09-22",
    status: "upcoming",
    activities: [
      { id: globalActivityId++, label: "Arrive at Joshua Tree", done: false },
      { id: globalActivityId++, label: "Rock scramble + stargazing", done: false },
    ],
  },
  {
    id: 3,
    name: "Coastal Backpack",
    startDate: "2024-07-01",
    endDate: "2024-07-03",
    status: "completed",
    activities: [
      { id: globalActivityId++, label: "Trailhead start, 8 mi", done: true },
      { id: globalActivityId++, label: "Camp to beach cove, 6 mi", done: true },
      { id: globalActivityId++, label: "Return loop, 7 mi", done: true },
    ],
  },
];

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(SEED_TRIPS);
  const [nextTripId, setNextTripId] = useState(4);
  const [nextActId, setNextActId] = useState(globalActivityId);

  const [formName, setFormName] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");

  const [actInputs, setActInputs] = useState<Record<number, string>>({});

  const upcomingCount = trips.filter((t) => t.status === "upcoming").length;
  const completedCount = trips.filter((t) => t.status === "completed").length;

  const addTrip = () => {
    if (!formName.trim()) return;
    setTrips([
      ...trips,
      {
        id: nextTripId,
        name: formName.trim(),
        startDate: formStart,
        endDate: formEnd,
        status: "upcoming",
        activities: [],
      },
    ]);
    setNextTripId(nextTripId + 1);
    setFormName("");
    setFormStart("");
    setFormEnd("");
  };

  const removeTrip = (id: number) => {
    setTrips(trips.filter((t) => t.id !== id));
  };

  const markComplete = (id: number) => {
    setTrips(trips.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
  };

  const toggleActivity = (tripId: number, actId: number) => {
    setTrips(
      trips.map((t) =>
        t.id === tripId
          ? {
              ...t,
              activities: t.activities.map((a) =>
                a.id === actId ? { ...a, done: !a.done } : a
              ),
            }
          : t
      )
    );
  };

  const addActivity = (tripId: number) => {
    const label = (actInputs[tripId] || "").trim();
    if (!label) return;
    setTrips(
      trips.map((t) =>
        t.id === tripId
          ? {
              ...t,
              activities: [...t.activities, { id: nextActId, label, done: false }],
            }
          : t
      )
    );
    setNextActId(nextActId + 1);
    setActInputs({ ...actInputs, [tripId]: "" });
  };

  return (
    <div>
      <h1>Outdoor Planner</h1>

      <div data-testid="summary">
        <span data-testid="upcoming-count">{upcomingCount} upcoming</span>
        <span data-testid="completed-count">{completedCount} completed trips</span>
      </div>

      <div data-testid="trip-list">
        {trips.map((trip) => {
          const doneCount = trip.activities.filter((a) => a.done).length;
          const totalActs = trip.activities.length;
          return (
            <div key={trip.id} data-testid={`trip-${trip.id}`}>
              <h2 data-testid={`trip-name-${trip.id}`}>{trip.name}</h2>
              <span data-testid={`trip-dates-${trip.id}`}>
                {trip.startDate} — {trip.endDate}
              </span>
              {trip.status === "completed" ? (
                <span data-testid={`trip-completed-badge-${trip.id}`}>Completed</span>
              ) : (
                <button data-testid={`mark-complete-${trip.id}`} onClick={() => markComplete(trip.id)}>
                  Mark Trip Complete
                </button>
              )}
              <span data-testid={`trip-progress-${trip.id}`}>
                {doneCount}/{totalActs} activities done
              </span>
              <ul data-testid={`activity-list-${trip.id}`}>
                {trip.activities.map((act) => (
                  <li key={act.id} data-testid={`activity-${act.id}`}>
                    <input
                      type="checkbox"
                      data-testid={`activity-check-${act.id}`}
                      checked={act.done}
                      onChange={() => toggleActivity(trip.id, act.id)}
                    />
                    <span data-testid={`activity-label-${act.id}`}>{act.label}</span>
                  </li>
                ))}
              </ul>
              <input
                data-testid={`act-input-${trip.id}`}
                type="text"
                placeholder="New activity"
                value={actInputs[trip.id] || ""}
                onChange={(e) =>
                  setActInputs({ ...actInputs, [trip.id]: e.target.value })
                }
              />
              <button data-testid={`add-activity-${trip.id}`} onClick={() => addActivity(trip.id)}>
                Add Activity
              </button>
              <button data-testid={`remove-trip-${trip.id}`} onClick={() => removeTrip(trip.id)}>
                Remove Trip
              </button>
            </div>
          );
        })}
      </div>

      <div data-testid="add-trip-form">
        <input
          data-testid="form-name"
          type="text"
          placeholder="Trip name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <input
          data-testid="form-start"
          type="date"
          value={formStart}
          onChange={(e) => setFormStart(e.target.value)}
        />
        <input
          data-testid="form-end"
          type="date"
          value={formEnd}
          onChange={(e) => setFormEnd(e.target.value)}
        />
        <button data-testid="add-trip-btn" onClick={addTrip}>
          Add Trip
        </button>
      </div>
    </div>
  );
}
