import { getEntries, addEntry } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getEntries());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const entry = addEntry(body);
  return Response.json(entry, { status: 201 });
}
