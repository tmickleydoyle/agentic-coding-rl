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
  return (
    <div data-testid={`stat-${testid}`}>
      <span data-testid={`stat-${testid}-label`}>{label}</span>
      <span data-testid={`stat-${testid}-value`}>{value}</span>
    </div>
  )
}
