'use client'

export default function ClassDetailPage() {
  // TODO: if no class is selected show no-class; otherwise show name/enrolled/capacity,
  // a full notice when applicable, and an enroll form (student-input, enroll-submit).
  return (
    <section data-testid="page-class-detail">
      <h1>Class</h1>
      <p data-testid="no-class">Pick a class first.</p>
    </section>
  )
}
