import { getAppointments, addAppointment, updateAppointmentStatus, getPatients } from '../../../lib/store'

export async function GET() {
  return Response.json(getAppointments())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { patientId, date, time, reason } = body
  if (!patientId || !date || !time || !reason) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const patients = getPatients()
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return Response.json({ error: 'Patient not found' }, { status: 400 })
  const appt = addAppointment({ patientId, patientName: patient.name, date, time, reason, status: 'scheduled' })
  return Response.json(appt, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, status } = body
  if (!id || !status) return Response.json({ error: 'Missing id or status' }, { status: 400 })
  const ok = updateAppointmentStatus(id, status)
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ success: true })
}
