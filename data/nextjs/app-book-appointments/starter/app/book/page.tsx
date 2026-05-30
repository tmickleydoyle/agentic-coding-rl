'use client'

export default function BookPage() {
  // TODO: if no service is selected show no-service; otherwise render the booking form
  // (customer-input, slot-select of free slots, submit-booking) with validation.
  return (
    <section data-testid="page-book">
      <h1>Book</h1>
      <p data-testid="no-service">Pick a service first.</p>
    </section>
  )
}
