'use client'
import { useApp } from '../../components/AppStateProvider'
import Cell from '../../components/Cell'
import StatusBar from '../../components/StatusBar'

export default function PlayPage() {
  const { board, result, play, reset } = useApp()
  const over = result !== null
  return (
    <section data-testid="page-play">
      <h1>Play</h1>
      <StatusBar result={result} />
      <div data-testid="board">
        {board.map((c, i) => (
          <Cell
            key={i}
            index={i}
            value={c}
            disabled={over || c !== null}
            onPlay={play}
          />
        ))}
      </div>
      <button data-testid="reset" onClick={reset}>
        Reset game
      </button>
    </section>
  )
}
