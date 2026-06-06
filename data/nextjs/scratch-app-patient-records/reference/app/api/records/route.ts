import { getRecords, addRecord, getPatients } from '../../../lib/store'

export async function GET() {
  return Response.json(getRecords())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { patientId, date, diagnosis, notes } = body
  if (!patientId || !date || !diagnosis) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const patients = getPatients()
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return Response.json({ error: 'Patient not found' }, { status: 400 })
  const record = addRecord({ patientId, patientName: patient.name, date, diagnosis, notes: notes || '' })
  return Response.json(record, { status: 201 })
}
