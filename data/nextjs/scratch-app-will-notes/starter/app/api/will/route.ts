export async function GET(_request: Request): Promise<Response> {
  return Response.json({ clauseCount: 0, signedCount: 0, pendingCount: 0, complete: false });
}
