import { getRisks, addRisk } from "../../../lib/store";
import type { RiskCategory, RiskStatus } from "../../../lib/types";

export function GET(_req: Request): Response {
  return Response.json(getRisks());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, category, likelihood, impact, status, owner, description } = body as {
    title: string; category: RiskCategory; likelihood: number; impact: number;
    status: RiskStatus; owner: string; description: string;
  };
  if (!title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
  const risk = addRisk({ title, category, likelihood, impact, status, owner, description });
  return Response.json(risk, { status: 201 });
}
