import { getLists, addList } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getLists());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const list = addList(body);
  return Response.json(list, { status: 201 });
}
