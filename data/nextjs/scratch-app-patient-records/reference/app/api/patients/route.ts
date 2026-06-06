import { getPatients, addPatient } from '../../../lib/store'

export async function GET() {
  return Response.json(getPatients())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, dob, gender, phone } = body
  if (!name || !dob || !gender || !phone) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const patient = addPatient({ name, dob, gender, phone })
  return Response.json(patient, { status: 201 })
}
