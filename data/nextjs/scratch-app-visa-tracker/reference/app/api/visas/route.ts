import { getVisas, addVisa } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getVisas());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const visa = addVisa(body);
  return Response.json(visa, { status: 201 });
}
