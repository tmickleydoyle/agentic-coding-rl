'use client'

export default function BookPage() {
  // TODO: if no provider is selected show no-provider; otherwise render the booking form
  // (patient-input, slot-select of available slots, submit-appointment) with validation,
  // or no-slots when the provider is fully booked.
  return (
    <section data-testid="page-book">
      <h1>Book</h1>
      <p data-testid="no-provider">Pick a provider first.</p>
    </section>
  )
}
