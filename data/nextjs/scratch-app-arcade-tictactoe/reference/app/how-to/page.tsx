'use client'

export default function HowToPage() {
  return (
    <section data-testid="page-how-to">
      <h1>How to play</h1>
      <p data-testid="rules-intro">You are X. Beat the computer (O).</p>
      <ul data-testid="rules">
        <li>Tap an empty cell to place your X.</li>
        <li>The computer responds with an O automatically.</li>
        <li>Line up three in a row, column, or diagonal to win.</li>
        <li>A full board with no line is a draw.</li>
      </ul>
    </section>
  )
}
