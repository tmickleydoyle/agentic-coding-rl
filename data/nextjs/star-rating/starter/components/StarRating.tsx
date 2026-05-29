export default function StarRating({ rating }: { rating: number }) {
  // TODO: clamp rating into [0,5] (floor non-integers), render 5 stars with
  // data-testid="star-1".."star-5" — first `clamped` filled ★, rest empty ☆.
  return (
    <div>
      <span data-testid="star-1">☆</span>
      <span data-testid="star-2">☆</span>
      <span data-testid="star-3">☆</span>
      <span data-testid="star-4">☆</span>
      <span data-testid="star-5">☆</span>
    </div>
  )
}
