import { getPolicies, addPolicy } from "../../../lib/store";
import type { Department, PolicyStatus } from "../../../lib/types";

export function GET(_req: Request): Response {
  return Response.json(getPolicies());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, department, version, status, owner, reviewDate, summary } = body as {
    title: string; department: Department; version: string;
    status: PolicyStatus; owner: string; reviewDate: string; summary: string;
  };
  const errs: string[] = [];
  if (!title?.trim()) errs.push("Title is required");
  if (!version?.trim()) errs.push("Version is required");
  if (errs.length > 0) return Response.json({ errors: errs }, { status: 400 });
  const p = addPolicy({ title, department, version, status, owner, reviewDate, summary: summary ?? "" });
  return Response.json(p, { status: 201 });
}
