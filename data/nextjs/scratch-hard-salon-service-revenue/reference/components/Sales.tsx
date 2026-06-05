'use client'
import { useState } from 'react'
import { useSalon } from '../hooks/useSalon'
import { SERVICES, priceOf } from '../lib/types'

export function Sales() {
  const { sales, addSale, hideZeroTip } = useSalon()
  const [client, setClient] = useState('')
  const [service, setService] = useState(SERVICES[0].name)
  const [tip, setTip] = useState('')

  const visible = sales.filter((s) => !hideZeroTip || s.tip > 0)

  return (
    <section aria-label="Sales view">
      <h1>Sales</h1>
      <input aria-label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
      <select aria-label="Service" value={service} onChange={(e) => setService(e.target.value)}>
        {SERVICES.map((s) => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>
      <input aria-label="Tip" type="number" value={tip} onChange={(e) => setTip(e.target.value)} />
      <button
        onClick={() => {
          addSale(client, service, tip)
          setClient('')
          setTip('')
        }}
      >
        Record sale
      </button>
      <ul>
        {visible.map((s) => (
          <li key={s.id}>{`${s.client}: ${s.service} $${priceOf(s.service)} + $${s.tip} tip`}</li>
        ))}
      </ul>
    </section>
  )
}
