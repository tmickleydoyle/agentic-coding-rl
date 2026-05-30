'use client'

export default function HowToPage() {
  return (
    <section data-testid="page-how-to">
      <h1>How to play</h1>
      <p data-testid="rules-intro">Guess the hidden word one letter at a time.</p>
      <ul data-testid="rules">
        <li>Tap a letter to guess it.</li>
        <li>A wrong guess costs one of your six chances.</li>
        <li>Reveal every letter to win; run out of chances to lose.</li>
      </ul>
    </section>
  )
}
