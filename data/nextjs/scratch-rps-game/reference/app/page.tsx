'use client'
import { useState } from 'react'

type Choice = 'Rock' | 'Paper' | 'Scissors'
const CHOICES: Choice[] = ['Rock', 'Paper', 'Scissors']

function getResult(player: Choice, computer: Choice): 'win' | 'lose' | 'tie' {
  if (player === computer) return 'tie'
  if (
    (player === 'Rock' && computer === 'Scissors') ||
    (player === 'Scissors' && computer === 'Paper') ||
    (player === 'Paper' && computer === 'Rock')
  ) {
    return 'win'
  }
  return 'lose'
}

type RoundState = {
  playerChoice: Choice
  computerChoice: Choice
  result: 'win' | 'lose' | 'tie'
} | null

export default function App() {
  const [round, setRound] = useState<RoundState>(null)
  const [scorePlayer, setScorePlayer] = useState(0)
  const [scoreComputer, setScoreComputer] = useState(0)
  const [scoreTies, setScoreTies] = useState(0)

  function handleChoice(player: Choice) {
    const idx = Math.floor(Math.random() * 3)
    const computer = CHOICES[idx]
    const result = getResult(player, computer)
    setRound({ playerChoice: player, computerChoice: computer, result })
    if (result === 'win') setScorePlayer(s => s + 1)
    else if (result === 'lose') setScoreComputer(s => s + 1)
    else setScoreTies(s => s + 1)
  }

  function handleReset() {
    setRound(null)
    setScorePlayer(0)
    setScoreComputer(0)
    setScoreTies(0)
  }

  const resultText =
    round === null
      ? ''
      : round.result === 'win'
      ? 'You win!'
      : round.result === 'lose'
      ? 'Computer wins!'
      : "It's a tie!"

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem', textAlign: 'center' }}>
      <h1>Rock Paper Scissors</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button data-testid="choice-rock" onClick={() => handleChoice('Rock')} style={{ margin: '0.25rem', fontSize: '1.25rem' }}>
          Rock
        </button>
        <button data-testid="choice-paper" onClick={() => handleChoice('Paper')} style={{ margin: '0.25rem', fontSize: '1.25rem' }}>
          Paper
        </button>
        <button data-testid="choice-scissors" onClick={() => handleChoice('Scissors')} style={{ margin: '0.25rem', fontSize: '1.25rem' }}>
          Scissors
        </button>
      </div>

      {round && (
        <div style={{ marginBottom: '1rem' }}>
          <p>You chose: <strong data-testid="player-choice">{round.playerChoice}</strong></p>
          <p>Computer chose: <strong data-testid="computer-choice">{round.computerChoice}</strong></p>
          <p data-testid="round-result" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {resultText}
          </p>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <h2>Scores</h2>
        <p>You: <span data-testid="score-player">{scorePlayer}</span></p>
        <p>Computer: <span data-testid="score-computer">{scoreComputer}</span></p>
        <p>Ties: <span data-testid="score-ties">{scoreTies}</span></p>
      </div>

      <button data-testid="reset-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}
