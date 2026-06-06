export async function GET(_request: Request): Promise<Response> {
  return Response.json({ trustCount: 0, totalPrincipal: 0, totalDistributed: 0 });
}
