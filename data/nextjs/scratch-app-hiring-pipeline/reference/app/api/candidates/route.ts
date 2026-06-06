import { getCandidates, addCandidate, updateCandidate, deleteCandidate, getJobs } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getCandidates());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, email, jobId, stage } = body;
  if (!name || !email || !email.includes("@") || !jobId || !stage) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const jobs = getJobs();
  const job = jobs.find((j) => j.id === jobId);
  if (job && job.status === "Closed") {
    return Response.json({ error: "Job is closed" }, { status: 400 });
  }
  const candidate = addCandidate({ name, email, jobId, stage });
  return Response.json(candidate, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const updated = updateCandidate(id, body);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteCandidate(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
