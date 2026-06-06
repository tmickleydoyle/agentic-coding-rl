import { getLogs, addLog } from "../../../lib/store";
import type { Regulation, Severity, LogStatus } from "../../../lib/types";

export function GET(_req: Request): Response {
  return Response.json(getLogs());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, regulation, severity, status, date, notes } = body as {
    title: string; regulation: Regulation; severity: Severity;
    status: LogStatus; date: string; notes: string;
  };
  if (!title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
  const entry = addLog({ title, regulation, severity, status, date, notes: notes ?? "" });
  return Response.json(entry, { status: 201 });
}
