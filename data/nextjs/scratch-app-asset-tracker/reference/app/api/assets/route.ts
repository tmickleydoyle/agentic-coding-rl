import { getAssets, addAsset } from '../../../lib/store'
export async function GET(_req: Request): Promise<Response> {
  return Response.json({ assets: getAssets() })
}
export async function POST(req: Request): Promise<Response> {
  const body = await req.json()
  const { name, category, purchasePrice, purchaseYear, depreciationRate } = body
  if (!name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400 })
  const a = addAsset({ name, category: category ?? '', purchasePrice: Number(purchasePrice) || 0, purchaseYear: Number(purchaseYear) || 2026, depreciationRate: Number(depreciationRate) || 0 })
  return Response.json(a, { status: 201 })
}
