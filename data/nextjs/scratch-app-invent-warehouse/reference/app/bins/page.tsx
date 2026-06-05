'use client'
import { useWarehouse } from '../../components/AppStateProvider'
import { useBins } from '../../hooks/useBins'
import BinRow from '../../components/BinRow'

export default function BinsPage() {
  const { selectBin } = useWarehouse()
  const { bins } = useBins()

  return (
    <section data-testid="page-bins">
      <h1>Bins</h1>
      {bins.length === 0 ? (
        <p data-testid="empty-state">No bins.</p>
      ) : (
        <ul data-testid="bin-list">
          {bins.map((b) => (
            <BinRow key={b.id} bin={b} onView={selectBin} />
          ))}
        </ul>
      )}
    </section>
  )
}
