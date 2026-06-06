import React, { useState, useEffect } from "react";
import { Citation } from "../../lib/types";

export function ExportPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [output, setOutput] = useState("");

  useEffect(() => {
    fetch("/api/citations").then((r) => r.json()).then((d) => setCitations(d.citations ?? []));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const generate = async () => {
    const ids = selected.length > 0 ? selected : citations.map((c) => c.id);
    const res = await fetch(`/api/citations?export=apa&ids=${ids.join(",")}`);
    const d = await res.json();
    setOutput(d.apa ?? "");
  };

  return (
    <div data-testid="export-page">
      <h1>Export Citations</h1>
      <ul data-testid="export-citations-list">
        {citations.map((c) => (
          <li key={c.id} data-testid={`export-item-${c.id}`}>
            <input
              type="checkbox"
              data-testid={`export-check-${c.id}`}
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            <span data-testid={`export-title-${c.id}`}>{c.title}</span>
          </li>
        ))}
      </ul>
      <button data-testid="btn-export" onClick={generate}>Generate APA</button>
      {output && <pre data-testid="export-output">{output}</pre>}
    </div>
  );
}
