import React, { useState } from "react";

type Status = "waiting" | "printing" | "done";

interface PrintJob {
  id: number;
  name: string;
  material: string;
  duration: number;
  status: Status;
}

const SEED_JOBS: PrintJob[] = [
  { id: 1, name: "Benchy Boat", material: "PLA", duration: 45, status: "waiting" },
  { id: 2, name: "Phone Stand", material: "PETG", duration: 120, status: "waiting" },
  { id: 3, name: "Cable Clip x10", material: "PLA", duration: 30, status: "waiting" },
];

let nextId = 4;

export default function App() {
  const [jobs, setJobs] = useState<PrintJob[]>(SEED_JOBS);
  const [nameInput, setNameInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [durationInput, setDurationInput] = useState("");

  function addJob() {
    const dur = parseInt(durationInput, 10);
    if (!nameInput.trim() || !materialInput.trim() || isNaN(dur) || dur <= 0) return;
    const newJob: PrintJob = {
      id: nextId++,
      name: nameInput.trim(),
      material: materialInput.trim(),
      duration: dur,
      status: "waiting",
    };
    setJobs((prev) => [...prev, newJob]);
    setNameInput("");
    setMaterialInput("");
    setDurationInput("");
  }

  function setStatus(id: number, status: Status) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  }

  function removeJob(id: number) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setJobs((prev) => {
      const arr = [...prev];
      const tmp = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = tmp;
      return arr;
    });
  }

  function moveDown(index: number) {
    setJobs((prev) => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      const tmp = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = tmp;
      return arr;
    });
  }

  const waitingCount = jobs.filter((j) => j.status === "waiting").length;
  const printingCount = jobs.filter((j) => j.status === "printing").length;
  const doneCount = jobs.filter((j) => j.status === "done").length;

  return (
    <div>
      <h1>3D Print Queue</h1>

      <div>
        <input
          aria-label="Job name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Model name"
        />
        <input
          aria-label="Material"
          value={materialInput}
          onChange={(e) => setMaterialInput(e.target.value)}
          placeholder="Material"
        />
        <input
          aria-label="Duration"
          type="number"
          value={durationInput}
          onChange={(e) => setDurationInput(e.target.value)}
          placeholder="Duration (min)"
        />
        <button onClick={addJob}>Add Job</button>
      </div>

      <ol>
        {jobs.map((job, index) => (
          <li key={job.id}>
            <span data-testid={`job-name-${job.id}`}>{job.name}</span>
            <span data-testid={`job-material-${job.id}`}>{job.material}</span>
            <span data-testid={`job-duration-${job.id}`}>{job.duration}</span>
            <span data-testid={`job-status-${job.id}`}>{job.status}</span>
            {job.status === "waiting" && (
              <button onClick={() => setStatus(job.id, "printing")}>Start</button>
            )}
            {job.status === "printing" && (
              <button onClick={() => setStatus(job.id, "done")}>Done</button>
            )}
            <button onClick={() => removeJob(job.id)}>Remove</button>
            {index > 0 && (
              <button onClick={() => moveUp(index)}>Move Up</button>
            )}
            {index < jobs.length - 1 && (
              <button onClick={() => moveDown(index)}>Move Down</button>
            )}
          </li>
        ))}
      </ol>

      <div data-testid="queue-summary">
        {waitingCount} waiting, {printingCount} printing, {doneCount} done
      </div>
    </div>
  );
}
