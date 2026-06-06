import { getPages, addPage } from "../../../../lib/store";

export function GET() { return Response.json({ pages: getPages() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const result = addPage(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ page: result }, { status: 201 });
}
