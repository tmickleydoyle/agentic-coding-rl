import { getRequests, addRequest, updateRequest } from "../../../lib/store";
import type { RequestType, RequestStatus } from "../../../lib/types";

export function GET(_req: Request): Response {
  return Response.json(getRequests());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, submitter, type, amount } = body as {
    title: string; submitter: string; type: RequestType; amount: number;
  };
  const errs: string[] = [];
  if (!title?.trim()) errs.push("Title is required");
  if (!submitter?.trim()) errs.push("Submitter is required");
  if (!amount || amount <= 0) errs.push("Amount must be greater than 0");
  if (errs.length > 0) return Response.json({ errors: errs }, { status: 400 });
  const r = addRequest({ title, submitter, type, amount });
  return Response.json(r, { status: 201 });
}

export async function PATCH(req: Request): Promise<Response> {
  const body = await req.json();
  const { id, status, comment } = body as { id: string; status: RequestStatus; comment: string };
  const updated = updateRequest(id, status, comment ?? "");
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}
