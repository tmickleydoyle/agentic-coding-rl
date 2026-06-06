export async function POST(_request: Request): Promise<Response> {
  return Response.json({ totalValue: 0, assetCount: 0, beneficiaryCount: 0 });
}
