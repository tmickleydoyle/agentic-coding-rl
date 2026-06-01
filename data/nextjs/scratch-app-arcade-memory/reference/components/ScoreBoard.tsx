'use client'

export default function ScoreBoard({
  moves,
  matches,
}: {
  moves: number
  matches: number
}) {
  return (
    <div data-testid="scoreboard">
      <span data-testid="moves">{moves}</span>
      <span data-testid="matches">{matches}</span>
    </div>
  )
}
