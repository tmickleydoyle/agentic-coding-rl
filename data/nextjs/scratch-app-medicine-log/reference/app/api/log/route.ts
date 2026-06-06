import { getLogEntries, addLogEntry, getMedicines } from '../../../lib/store'

export async function GET() {
  return Response.json(getLogEntries())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { medicineId, datetime, notes } = body
  if (!medicineId || !datetime) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const medicines = getMedicines()
  const medicine = medicines.find(m => m.id === medicineId)
  if (!medicine) return Response.json({ error: 'Medicine not found' }, { status: 400 })
  const entry = addLogEntry({ medicineId, medicineName: medicine.name, datetime, notes: notes || '' })
  return Response.json(entry, { status: 201 })
}
