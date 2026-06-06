export async function GET(_request: Request): Promise<Response> {
  return Response.json({ entryCount: 0, totalAmount: 0, heirCount: 0 });
}
