import { getContracts, addContract } from "../../../lib/store";
import type { ContractStatus } from "../../../lib/types";

export function GET(_req: Request): Response {
  return Response.json(getContracts());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, party, value, startDate, endDate, status } = body as {
    title: string; party: string; value: number;
    startDate: string; endDate: string; status: ContractStatus;
  };
  const errs: string[] = [];
  if (!title?.trim()) errs.push("Title is required");
  if (!party?.trim()) errs.push("Party is required");
  if (!value || value <= 0) errs.push("Value must be greater than 0");
  if (errs.length > 0) return Response.json({ errors: errs }, { status: 400 });
  const c = addContract({ title, party, value, startDate, endDate, status });
  return Response.json(c, { status: 201 });
}
