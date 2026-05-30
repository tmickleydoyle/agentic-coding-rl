'use client'

export default function BookPage() {
  // TODO: if no room is selected show no-room; otherwise render the booking form
  // (title-input, start-input, end-input, submit-booking) with validation + conflict.
  return (
    <section data-testid="page-book">
      <h1>Book</h1>
      <p data-testid="no-room">Pick a room first.</p>
    </section>
  )
}
