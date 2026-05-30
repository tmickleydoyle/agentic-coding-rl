'use client'

export default function StatBlock({
  label,
  value,
  testid,
}: {
  label: string
  value: number
  testid: string
}) {
  // TODO: render the label and value with stat-<testid>-value testid
  void label
  void value
  return <div data-testid={`stat-${testid}`} />
}
