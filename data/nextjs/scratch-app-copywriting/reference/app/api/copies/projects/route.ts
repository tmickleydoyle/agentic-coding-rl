import { getProjects, addProject } from "../../../../lib/store";

export function GET() { return Response.json({ projects: getProjects() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const result = addProject(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ project: result }, { status: 201 });
}
