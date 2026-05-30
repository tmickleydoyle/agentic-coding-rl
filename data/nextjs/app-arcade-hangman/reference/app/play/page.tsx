'use client'
import { useApp } from '../../components/AppStateProvider'
import Key from '../../components/Key'
import { isOver, masked, remaining } from '../../lib/hangman'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default function PlayPage() {
  const { game, play, reset, next } = useApp()
  const over = isOver(game)
  return (
    <section data-testid="page-play">
      <h1>Hangman</h1>
      <p data-testid="masked">{masked(game)}</p>
      <span data-testid="remaining">{remaining(game)}</span>
      <span data-testid="status">{game.status}</span>
      {over ? <p data-testid="game-over">Game over</p> : null}
      <div data-testid="keyboard">
        {ALPHABET.map((l) => (
          <Key
            key={l}
            letter={l}
            disabled={over || game.guessed.indexOf(l) !== -1}
            onPress={play}
          />
        ))}
      </div>
      <button data-testid="reset" onClick={reset}>
        Reset
      </button>
      <button data-testid="next-word" onClick={next}>
        Next word
      </button>
    </section>
  )
}
