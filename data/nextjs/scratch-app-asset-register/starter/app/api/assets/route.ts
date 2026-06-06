export async function GET(_request: Request): Promise<Response> {
  return Response.json({ assetCount: 0, valuationCount: 0, totalValue: 0 });
}
