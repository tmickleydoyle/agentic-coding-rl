'use client'
import { useState } from 'react'
import { useSalon } from '../hooks/useSalon'
import { STYLISTS, SERVICES } from '../lib/types'

export function Appointments() {
  const { appts, addAppt, setStatus, hideCancelled } = useSalon()
  const [client, setClient] = useState('')
  const [stylist, setStylist] = useState(STYLISTS[0])
  const [service, setService] = useState(SERVICES[0].name)

  const visible = appts.filter((a) => !(hideCancelled && a.status === 'cancelled'))

  return (
    <section aria-label="Appointments view">
      <h1>Appointments</h1>
      <input aria-label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
      <select aria-label="Stylist" value={stylist} onChange={(e) => setStylist(e.target.value)}>
        {STYLISTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select aria-label="Service" value={service} onChange={(e) => setService(e.target.value)}>
        {SERVICES.map((s) => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>
      <button
        onClick={() => {
          addAppt(client, stylist, service)
          setClient('')
        }}
      >
        Book appointment
      </button>
      <ul>
        {visible.map((a) => (
          <li key={a.id}>
            <span>{`${a.client} with ${a.stylist}: ${a.service} ($${a.price}) — ${a.status}`}</span>
            {a.status === 'booked' && (
              <>
                <button aria-label={`Complete ${a.client}`} onClick={() => setStatus(a.id, 'completed')}>
                  Complete
                </button>
                <button aria-label={`Cancel ${a.client}`} onClick={() => setStatus(a.id, 'cancelled')}>
                  Cancel
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
