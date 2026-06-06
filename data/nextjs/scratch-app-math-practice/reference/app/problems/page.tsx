import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { generateProblem } from "../../lib/store";
import type { Operation, Difficulty } from "../../lib/types";

const OPERATIONS: Operation[] = ["addition", "subtraction", "multiplication", "division"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const OP_SYMBOL: Record<Operation, string> = { addition: "+", subtraction: "-", multiplication: "×", division: "÷" };

export default function ProblemsPage() {
  const { problems, setProblems } = useApp();
  const [operation, setOperation] = useState<Operation>("addition");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [userAnswer, setUserAnswer] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [filterOp, setFilterOp] = useState<Operation | "">("");

  function handleGenerate() {
    const p = generateProblem(operation, difficulty);
    setProblems([...problems, p]);
  }

  function handleCheck(id: string, answer: number) {
    const ua = parseInt(userAnswer[id] || "", 10);
    setChecked(prev => ({ ...prev, [id]: ua === answer }));
  }

  const displayed = filterOp ? problems.filter(p => p.operation === filterOp) : problems;

  return (
    <div data-testid="problems-page">
      <h2>Practice Problems</h2>
      <div>
        <select data-testid="filter-operation" value={filterOp} onChange={e => setFilterOp(e.target.value as Operation | "")}>
          <option value="">All Operations</option>
          {OPERATIONS.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      </div>
      <ul data-testid="problem-list">
        {displayed.map(p => (
          <li key={p.id} data-testid={`problem-item-${p.id}`}>
            <span data-testid={`problem-text-${p.id}`}>{p.operand1} {OP_SYMBOL[p.operation]} {p.operand2} = ?</span>
            <span data-testid={`problem-difficulty-${p.id}`}>{p.difficulty}</span>
            <input
              data-testid={`answer-input-${p.id}`}
              value={userAnswer[p.id] || ""}
              onChange={e => setUserAnswer(prev => ({ ...prev, [p.id]: e.target.value }))}
              placeholder="Your answer"
            />
            <button data-testid={`btn-check-${p.id}`} onClick={() => handleCheck(p.id, p.answer)}>Check</button>
            {p.id in checked && (
              <span data-testid={`result-${p.id}`}>{checked[p.id] ? "Correct!" : "Wrong"}</span>
            )}
          </li>
        ))}
      </ul>
      <div data-testid="generate-form">
        <select data-testid="select-operation" value={operation} onChange={e => setOperation(e.target.value as Operation)}>
          {OPERATIONS.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
        <select data-testid="select-difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button data-testid="btn-generate" onClick={handleGenerate}>Generate Problem</button>
      </div>
    </div>
  );
}
