import { getExpenses, addExpense, budget } from "../../../lib/store";

export function GET(): Response {
  return Response.json({ expenses: getExpenses(), budget });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const expense = addExpense(body);
  return Response.json(expense, { status: 201 });
}
