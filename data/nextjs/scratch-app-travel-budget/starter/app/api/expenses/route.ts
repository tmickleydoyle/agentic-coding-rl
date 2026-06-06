export function GET(): Response {
  return Response.json({ expenses: [], budget: { totalBudget: 3000, tripName: "Japan Adventure", currency: "USD" } });
}

export async function POST(_req: Request): Promise<Response> {
  return Response.json({}, { status: 201 });
}
