export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ logs: [], goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 } }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({}), { status: 201, headers: { "Content-Type": "application/json" } });
}
