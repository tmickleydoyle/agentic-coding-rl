'use client'
import { useApp } from '../../components/AppStateProvider'
import GameCard from '../../components/GameCard'

export default function GamesPage() {
  const { games, scores, openGame } = useApp()
  return (
    <section data-testid="page-games">
      <h1>Games</h1>
      <ul data-testid="game-list">
        {games.map((g) => (
          <GameCard key={g.id} game={g} scores={scores} onOpen={openGame} />
        ))}
      </ul>
    </section>
  )
}
