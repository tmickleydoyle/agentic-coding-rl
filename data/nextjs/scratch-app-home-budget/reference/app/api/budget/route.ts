import { getExpenses, getIncomes, addExpense, addIncome, deleteExpense, deleteIncome } from "../../../lib/store";
import { Expense, Income } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  if (type === "income") {
    return Response.json({ data: getIncomes() });
  }
  return Response.json({ data: getExpenses() });
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const body = await request.json();
  if (type === "income") {
    const income: Income = body as Income;
    addIncome(income);
    return Response.json({ success: true, data: income }, { status: 201 });
  }
  const expense: Expense = body as Expense;
  addExpense(expense);
  return Response.json({ success: true, data: expense }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  if (type === "income") {
    deleteIncome(id);
  } else {
    deleteExpense(id);
  }
  return Response.json({ success: true });
}
