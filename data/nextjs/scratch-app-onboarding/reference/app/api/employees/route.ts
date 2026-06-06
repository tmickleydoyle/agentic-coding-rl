import { getEmployees, addEmployee } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getEmployees());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, email, department, startDate } = body;
  if (!name || !email || !email.includes("@") || !department || !startDate) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const employee = addEmployee({ name, email, department, startDate, managerId: body.managerId || "" });
  return Response.json(employee, { status: 201 });
}
