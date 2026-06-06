import { getTemplates, addTemplate, deleteTemplate } from "../../../lib/store";

export function GET() { return Response.json({ templates: getTemplates() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const t = addTemplate(body);
  return Response.json({ template: t }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const result = deleteTemplate(id);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
