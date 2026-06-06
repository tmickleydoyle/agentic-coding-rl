import { useState } from "react";

interface Measurement {
  id: number;
  date: string;
  ageMonths: number;
  weightLbs: number;
  heightIn: number;
  headCircumIn: number;
  notes: string;
}

const SEED_MEASUREMENTS: Measurement[] = [
  { id: 1, date: "2024-01-01", ageMonths: 0, weightLbs: 7.5, heightIn: 20.0, headCircumIn: 13.5, notes: "Birth measurements" },
  { id: 2, date: "2024-02-01", ageMonths: 1, weightLbs: 9.2, heightIn: 21.5, headCircumIn: 14.2, notes: "1 month checkup" },
  { id: 3, date: "2024-04-01", ageMonths: 3, weightLbs: 12.8, heightIn: 23.5, headCircumIn: 15.5, notes: "3 month checkup" },
  { id: 4, date: "2024-07-01", ageMonths: 6, weightLbs: 16.4, heightIn: 26.0, headCircumIn: 16.8, notes: "6 month checkup" },
  { id: 5, date: "2024-10-01", ageMonths: 9, weightLbs: 19.1, heightIn: 28.0, headCircumIn: 17.5, notes: "9 month checkup" },
];

export default function App() {
  const [measurements, setMeasurements] = useState<Measurement[]>(SEED_MEASUREMENTS);
  const [date, setDate] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [headCircumIn, setHeadCircumIn] = useState("");
  const [notes, setNotes] = useState("");
  const [nextId, setNextId] = useState(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightLbs);
    const h = parseFloat(heightIn);
    const hc = parseFloat(headCircumIn);
    if (!date || isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(hc) || hc <= 0) return;
    const entry: Measurement = {
      id: nextId,
      date,
      ageMonths: parseInt(ageMonths) || 0,
      weightLbs: w,
      heightIn: h,
      headCircumIn: hc,
      notes,
    };
    setMeasurements([entry, ...measurements]);
    setNextId(nextId + 1);
    setDate("");
    setAgeMonths("");
    setWeightLbs("");
    setHeightIn("");
    setHeadCircumIn("");
    setNotes("");
  };

  const handleDelete = (id: number) => {
    setMeasurements(measurements.filter((m) => m.id !== id));
  };

  const latestWeight = measurements.length > 0 ? String(measurements[0].weightLbs) : "—";
  const latestHeight = measurements.length > 0 ? String(measurements[0].heightIn) : "—";
  const totalMeasurements = measurements.length;

  return (
    <div>
      <h1>Growth Chart</h1>

      <form onSubmit={handleSubmit}>
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

        <label htmlFor="weight">Weight (lbs)</label>
        <input
          id="weight"
          type="number"
          value={weightLbs}
          onChange={(e) => setWeightLbs(e.target.value)}
          min="0.1"
          step="0.1"
        />

        <label htmlFor="height">Height (in)</label>
        <input
          id="height"
          type="number"
          value={heightIn}
          onChange={(e) => setHeightIn(e.target.value)}
          min="0.1"
          step="0.1"
        />

        <label htmlFor="head-circum">Head Circumference (in)</label>
        <input
          id="head-circum"
          type="number"
          value={headCircumIn}
          onChange={(e) => setHeadCircumIn(e.target.value)}
          min="0.1"
          step="0.1"
        />

        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Add Measurement</button>
      </form>

      <div>
        <span data-testid="latest-weight">Latest Weight: {latestWeight}</span>
        <span data-testid="latest-height">Latest Height: {latestHeight}</span>
        <span data-testid="total-measurements">Total: {totalMeasurements}</span>
      </div>

      <ul>
        {measurements.map((m) => (
          <li key={m.id} data-testid="measurement-item">
            <span data-testid="measurement-date">{m.date}</span>
            <span data-testid="measurement-age">{m.ageMonths}</span>
            <span data-testid="measurement-weight">{m.weightLbs}</span>
            <span data-testid="measurement-height">{m.heightIn}</span>
            <span data-testid="measurement-head">{m.headCircumIn}</span>
            <span data-testid="measurement-notes">{m.notes}</span>
            <button onClick={() => handleDelete(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
