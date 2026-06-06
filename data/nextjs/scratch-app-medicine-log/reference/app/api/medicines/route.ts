import { getMedicines, addMedicine, deleteMedicine } from '../../../lib/store'

export async function GET() {
  return Response.json(getMedicines())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, dosage, frequency, notes } = body
  if (!name || !dosage || !frequency) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const m = addMedicine({ name, dosage, frequency, notes: notes || '' })
  return Response.json(m, { status: 201 })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })
  const ok = deleteMedicine(id)
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ success: true })
}
