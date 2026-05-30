'use client'

export default function ScoreBoard({
  moves,
  matches,
}: {
  moves: number
  matches: number
}) {
  // TODO: render moves and matches counters.
  void moves
  void matches
  return (
    <div data-testid="scoreboard">
      <span data-testid="moves" />
      <span data-testid="matches" />
    </div>
  )
}
