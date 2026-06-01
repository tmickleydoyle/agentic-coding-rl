'use client'
import { useApp } from '../../components/AppStateProvider'
import { useOpenHouses } from '../../hooks/useOpenHouses'

export default function HouseDetailPage() {
  const { houses, currentHouseId } = useApp()
  const { visitorCount, averageRating } = useOpenHouses()
  const current = houses.find((h) => h.id === currentHouseId)
  if (!current) {
    return (
      <section data-testid="page-house-detail">
        <p data-testid="no-house">No house selected.</p>
      </section>
    )
  }
  return (
    <section data-testid="page-house-detail">
      <h1 data-testid="detail-address">{current.address}</h1>
      <p data-testid="detail-time">{current.time}</p>
      <p data-testid="detail-count">{visitorCount(current)}</p>
      <p data-testid="detail-avg">{averageRating(current)}</p>
      <ul data-testid="visitor-list">
        {current.visitors.map((v, idx) => (
          <li key={idx} data-testid={`visitor-${idx}`}>
            {v.name}
          </li>
        ))}
      </ul>
      <ul data-testid="feedback-list">
        {current.feedback.map((f, idx) => (
          <li key={idx} data-testid={`feedback-${idx}`}>
            <span data-testid={`feedback-${idx}-visitor`}>{f.visitor}</span>
            <span data-testid={`feedback-${idx}-rating`}>{f.rating}</span>
            <span data-testid={`feedback-${idx}-note`}>{f.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
