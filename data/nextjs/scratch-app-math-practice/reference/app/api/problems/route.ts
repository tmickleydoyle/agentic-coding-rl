import { getProblems, generateProblem } from "../../../lib/store";
import type { Operation, Difficulty } from "../../../lib/types";

export function GET(): Response {
  return Response.json(getProblems());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { operation, difficulty } = body;
  const validOps: Operation[] = ["addition", "subtraction", "multiplication", "division"];
  const validDiffs: Difficulty[] = ["easy", "medium", "hard"];
  if (!operation || !validOps.includes(operation)) {
    return Response.json({ error: "operation must be one of: " + validOps.join(", ") }, { status: 400 });
  }
  if (difficulty && !validDiffs.includes(difficulty)) {
    return Response.json({ error: "invalid difficulty" }, { status: 400 });
  }
  const problem = generateProblem(operation as Operation, (difficulty as Difficulty) || "easy");
  return Response.json(problem, { status: 201 });
}
