'use client'
import { useState } from 'react'
import { useWarehouse } from '../../components/AppStateProvider'
import { useBins } from '../../hooks/useBins'

export default function MovePage() {
  const { move, lastError } = useWarehouse()
  const { bins } = useBins()
  const [fromId, setFromId] = useState(bins[0]?.id ?? '')
  const [toId, setToId] = useState(bins[1]?.id ?? '')
  const [name, setName] = useState('')
  const [qty, setQty] = useState('1')
  const [done, setDone] = useState(false)

  const submit = () => {
    const n = Number(qty)
    const ok = move(fromId, toId, name.trim(), Number.isFinite(n) ? Math.trunc(n) : 0)
    setDone(ok)
  }

  return (
    <section data-testid="page-move">
      <h1>Move items</h1>
      <label htmlFor="from-bin">From</label>
      <select
        id="from-bin"
        data-testid="from-bin"
        value={fromId}
        onChange={(e) => setFromId(e.target.value)}
      >
        {bins.map((b) => (
          <option key={b.id} value={b.id}>
            {b.code}
          </option>
        ))}
      </select>
      <label htmlFor="to-bin">To</label>
      <select id="to-bin" data-testid="to-bin" value={toId} onChange={(e) => setToId(e.target.value)}>
        {bins.map((b) => (
          <option key={b.id} value={b.id}>
            {b.code}
          </option>
        ))}
      </select>
      <input
        data-testid="item-name"
        placeholder="Item"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input data-testid="move-qty" value={qty} onChange={(e) => setQty(e.target.value)} />
      <button data-testid="do-move" onClick={submit}>
        Move
      </button>
      {lastError ? <p data-testid="move-error">{lastError}</p> : null}
      {done && !lastError ? <p data-testid="move-success">Moved.</p> : null}
    </section>
  )
}
