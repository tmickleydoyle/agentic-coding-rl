import React, { useState, useMemo } from "react";

interface Tool {
  id: number;
  name: string;
  category: string;
  website: string;
  scores: Record<string, number>;
}

const INITIAL_CRITERIA = ["Ease of Use", "Performance", "Cost", "Community"];

const SEED_TOOLS: Tool[] = [
  { id: 1, name: "GitHub Actions", category: "CI/CD", website: "github.com", scores: { "Ease of Use": 9, "Performance": 8, "Cost": 7, "Community": 10 } },
  { id: 2, name: "CircleCI", category: "CI/CD", website: "circleci.com", scores: { "Ease of Use": 7, "Performance": 9, "Cost": 6, "Community": 8 } },
  { id: 3, name: "GitLab CI", category: "CI/CD", website: "gitlab.com", scores: { "Ease of Use": 8, "Performance": 8, "Cost": 8, "Community": 7 } },
  { id: 4, name: "Jenkins", category: "CI/CD", website: "jenkins.io", scores: { "Ease of Use": 5, "Performance": 7, "Cost": 10, "Community": 9 } },
];

function average(scores: Record<string, number>, criteria: string[]): number {
  if (criteria.length === 0) return 0;
  const total = criteria.reduce((sum, c) => sum + (scores[c] ?? 0), 0);
  return total / criteria.length;
}

export default function App() {
  const [tools, setTools] = useState<Tool[]>(SEED_TOOLS);
  const [criteria, setCriteria] = useState<string[]>(INITIAL_CRITERIA);
  const [highlightBest, setHighlightBest] = useState(false);
  const [nextId, setNextId] = useState(5);

  const [inputToolName, setInputToolName] = useState("");
  const [inputToolCategory, setInputToolCategory] = useState("");
  const [inputToolWebsite, setInputToolWebsite] = useState("");
  const [inputScores, setInputScores] = useState<string[]>(INITIAL_CRITERIA.map(() => "5"));

  const [inputCriterion, setInputCriterion] = useState("");

  const bestId = useMemo(() => {
    if (tools.length === 0) return null;
    let best = tools[0];
    tools.forEach((t) => {
      if (average(t.scores, criteria) > average(best.scores, criteria)) {
        best = t;
      }
    });
    return best.id;
  }, [tools, criteria]);

  function handleAddTool(e: React.FormEvent) {
    e.preventDefault();
    if (!inputToolName.trim()) return;
    const scores: Record<string, number> = {};
    criteria.forEach((c, i) => {
      const v = parseInt(inputScores[i], 10);
      scores[c] = isNaN(v) || v < 1 || v > 10 ? 5 : v;
    });
    const newTool: Tool = {
      id: nextId,
      name: inputToolName.trim(),
      category: inputToolCategory.trim(),
      website: inputToolWebsite.trim(),
      scores,
    };
    setTools((prev) => [...prev, newTool]);
    setNextId((n) => n + 1);
    setInputToolName("");
    setInputToolCategory("");
    setInputToolWebsite("");
    setInputScores(criteria.map(() => "5"));
  }

  function handleRemoveTool(id: number) {
    setTools((prev) => prev.filter((t) => t.id !== id));
  }

  function handleAddCriterion(e: React.FormEvent) {
    e.preventDefault();
    if (!inputCriterion.trim()) return;
    const name = inputCriterion.trim();
    setCriteria((prev) => [...prev, name]);
    setTools((prev) =>
      prev.map((t) => ({ ...t, scores: { ...t.scores, [name]: 0 } }))
    );
    setInputScores((prev) => [...prev, "5"]);
    setInputCriterion("");
  }

  return (
    <div>
      <h1>Tool Comparison</h1>

      <button data-testid="highlight-best-btn" onClick={() => setHighlightBest((v) => !v)}>
        {highlightBest ? "Unhighlight Best" : "Highlight Best"}
      </button>

      <table data-testid="comparison-table">
        <thead>
          <tr>
            <th>Tool</th>
            {criteria.map((c) => (
              <th key={c}>{c}</th>
            ))}
            <th>Average</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((t) => {
            const avg = average(t.scores, criteria);
            const isBest = highlightBest && t.id === bestId;
            return (
              <tr
                key={t.id}
                data-testid={isBest ? "best-tool" : "tool-row"}
              >
                <td data-testid="tool-name">{t.name}</td>
                {criteria.map((c, i) => (
                  <td key={c} data-testid={`score-${i}`}>
                    {t.scores[c] ?? 0}
                  </td>
                ))}
                <td data-testid="tool-average">{avg.toFixed(1)}</td>
                <td>
                  <button data-testid="remove-tool-btn" onClick={() => handleRemoveTool(t.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <form onSubmit={handleAddTool}>
        <label>
          Tool Name
          <input
            data-testid="input-tool-name"
            value={inputToolName}
            onChange={(e) => setInputToolName(e.target.value)}
          />
        </label>
        <label>
          Category
          <input
            data-testid="input-category"
            value={inputToolCategory}
            onChange={(e) => setInputToolCategory(e.target.value)}
          />
        </label>
        <label>
          Website
          <input
            data-testid="input-website"
            value={inputToolWebsite}
            onChange={(e) => setInputToolWebsite(e.target.value)}
          />
        </label>
        {criteria.map((c, i) => (
          <label key={c}>
            {c}
            <input
              type="number"
              min={1}
              max={10}
              data-testid={`input-score-${i}`}
              value={inputScores[i] ?? "5"}
              onChange={(e) => {
                const updated = [...inputScores];
                updated[i] = e.target.value;
                setInputScores(updated);
              }}
            />
          </label>
        ))}
        <button type="submit">Add Tool</button>
      </form>

      <form onSubmit={handleAddCriterion}>
        <label>
          Criterion Name
          <input
            data-testid="input-criterion"
            value={inputCriterion}
            onChange={(e) => setInputCriterion(e.target.value)}
          />
        </label>
        <button type="submit">Add Criterion</button>
      </form>
    </div>
  );
}
