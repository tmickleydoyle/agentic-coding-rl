export default function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.floor(rating)))
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} data-testid={`star-${i}`}>
          {i <= clamped ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
