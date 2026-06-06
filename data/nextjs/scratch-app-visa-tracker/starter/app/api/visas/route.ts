export function GET(): Response {
  return Response.json([]);
}

export async function POST(_req: Request): Promise<Response> {
  return Response.json({}, { status: 201 });
}
