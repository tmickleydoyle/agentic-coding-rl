'use client'

export default function StatBadge({
  label,
  value,
  testid,
}: {
  label: string
  value: number | string
  testid: string
}) {
  return (
    <div data-testid={`stat-${testid}`}>
      <span data-testid={`stat-${testid}-label`}>{label}</span>
      <span data-testid={`stat-${testid}-value`}>{value}</span>
    </div>
  )
}
