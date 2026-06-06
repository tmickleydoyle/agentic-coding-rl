import { getInvoices, addInvoice, getClients, addClient } from '../../../lib/store'
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  if (url.pathname.endsWith('/clients')) return Response.json({ clients: getClients() })
  return Response.json({ invoices: getInvoices() })
}
export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const body = await req.json()
  if (url.pathname.endsWith('/clients')) {
    const { name, email } = body
    if (!name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400 })
    return Response.json(addClient({ name, email: email ?? '' }), { status: 201 })
  }
  const { clientId, status, items, taxRate } = body
  if (!clientId) return new Response(JSON.stringify({ error: 'Missing clientId' }), { status: 400 })
  const inv = addInvoice({ clientId, status: status ?? 'draft', items: items ?? [], taxRate: Number(taxRate) || 0, createdAt: new Date().toISOString().slice(0, 10) })
  return Response.json(inv, { status: 201 })
}
