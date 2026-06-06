import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getPatients, getAppointments, getRecords } from '../reference/lib/store'
import { GET as patientsGET, POST as patientsPOST } from '../reference/app/api/patients/route'
import { GET as appointmentsGET, POST as appointmentsPOST, PATCH as appointmentsPATCH } from '../reference/app/api/appointments/route'
import { GET as recordsGET, POST as recordsPOST } from '../reference/app/api/records/route'

beforeEach(() => { __reset() })

function makeReq(body?: unknown, method = 'POST') {
  return new Request('http://localhost/', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

describe('Patients API', () => {
  it('GET returns 3 seed patients', async () => {
    const res = await patientsGET()
    const data = await res.json()
    expect(data.length).toBe(3)
  })

  it('POST creates a new patient', async () => {
    const res = await patientsPOST(makeReq({ name: 'Eve', dob: '2000-01-01', gender: 'Female', phone: '555-9999' }))
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe('Eve')
  })

  it('POST returns 400 when missing fields', async () => {
    const res = await patientsPOST(makeReq({ name: 'Eve' }))
    expect(res.status).toBe(400)
  })
})

describe('Appointments API', () => {
  it('GET returns 2 seed appointments', async () => {
    const res = await appointmentsGET()
    const data = await res.json()
    expect(data.length).toBe(2)
  })

  it('POST creates appointment', async () => {
    const res = await appointmentsPOST(makeReq({ patientId: 'p1', date: '2024-07-01', time: '10:00', reason: 'Check' }))
    expect(res.status).toBe(201)
  })

  it('PATCH updates appointment status', async () => {
    const res = await appointmentsPATCH(makeReq({ id: 'a1', status: 'completed' }, 'PATCH'))
    expect(res.status).toBe(200)
    const appts = getAppointments()
    expect(appts.find(a => a.id === 'a1')?.status).toBe('completed')
  })
})

describe('Records API', () => {
  it('GET returns 2 seed records', async () => {
    const res = await recordsGET()
    const data = await res.json()
    expect(data.length).toBe(2)
  })

  it('POST creates record', async () => {
    const res = await recordsPOST(makeReq({ patientId: 'p1', date: '2024-06-01', diagnosis: 'Cold' }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 when missing diagnosis', async () => {
    const res = await recordsPOST(makeReq({ patientId: 'p1', date: '2024-06-01' }))
    expect(res.status).toBe(400)
  })
})
