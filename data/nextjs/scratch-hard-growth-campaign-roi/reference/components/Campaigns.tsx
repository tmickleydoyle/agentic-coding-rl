'use client'
import { useState } from 'react'
import { useGrowth } from '../hooks/useGrowth'
import { CHANNELS } from '../lib/types'

export function Campaigns() {
  const { campaigns, addCampaign, activeOnly } = useGrowth()
  const [name, setName] = useState('')
  const [channel, setChannel] = useState('Search')
  const [spend, setSpend] = useState('')
  const [conversions, setConversions] = useState('')

  const visible = campaigns.filter((c) => !activeOnly || c.conversions > 0)

  return (
    <section aria-label="Campaigns view">
      <h1>Campaigns</h1>
      <input aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <select aria-label="Channel" value={channel} onChange={(e) => setChannel(e.target.value)}>
        {CHANNELS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input aria-label="Spend" type="number" value={spend} onChange={(e) => setSpend(e.target.value)} />
      <input
        aria-label="Conversions"
        type="number"
        value={conversions}
        onChange={(e) => setConversions(e.target.value)}
      />
      <button
        onClick={() => {
          addCampaign(name, channel, spend, conversions)
          setName('')
          setSpend('')
          setConversions('')
        }}
      >
        Add campaign
      </button>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            {`${c.name} — ${c.channel}: $${c.spend} spent, ${c.conversions} conversions`}
          </li>
        ))}
      </ul>
    </section>
  )
}
