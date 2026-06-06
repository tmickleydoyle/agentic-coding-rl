import { getProjects, addProject, deleteProject } from "../../../lib/store";

export function GET() {
  return Response.json({ projects: getProjects() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const project = addProject(body);
  return Response.json({ project }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const result = deleteProject(id);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
