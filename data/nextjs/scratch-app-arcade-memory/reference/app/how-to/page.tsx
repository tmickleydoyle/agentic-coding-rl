'use client'

export default function HowToPage() {
  return (
    <section data-testid="page-how-to">
      <h1>How to play</h1>
      <p data-testid="rules-intro">Flip cards two at a time to find matching pairs.</p>
      <ul data-testid="rules">
        <li>Tap a card to flip it face up.</li>
        <li>Flip a second card; a match stays up, a mismatch flips back.</li>
        <li>Match every pair in as few moves as possible.</li>
      </ul>
    </section>
  )
}
