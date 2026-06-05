'use client'
import { useWarehouse } from '../../components/AppStateProvider'
import { useBins } from '../../hooks/useBins'
import { freeSpace, usagePct, used } from '../../lib/types'

export default function BinDetailPage() {
  const { navigate } = useWarehouse()
  const { selected } = useBins()

  if (!selected) {
    return (
      <section data-testid="page-bin-detail">
        <h1>Bin detail</h1>
        <p data-testid="no-selection">No bin selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-bin-detail">
      <h1>Bin detail</h1>
      <span data-testid="detail-code">{selected.code}</span>
      <span data-testid="detail-used">{used(selected)}</span>
      <span data-testid="detail-capacity">{selected.capacity}</span>
      <span data-testid="detail-free">{freeSpace(selected)}</span>
      <span data-testid="detail-usage">{usagePct(selected)}</span>
      {selected.items.length === 0 ? (
        <p data-testid="bin-empty">This bin is empty.</p>
      ) : (
        <ul data-testid="item-list">
          {selected.items.map((it) => (
            <li key={it.name} data-testid={`item-${it.name}`}>
              <span data-testid={`item-${it.name}-qty`}>{it.qty}</span>
            </li>
          ))}
        </ul>
      )}
      <button data-testid="go-move" onClick={() => navigate('move')}>
        Move items
      </button>
    </section>
  )
}
