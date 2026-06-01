'use client'

export default function StatCard({
  label,
  value,
  testid,
}: {
  label: string
  value: string | number
  testid: string
}) {
  return (
    <div data-testid={`stat-${testid}`}>
      <span data-testid={`stat-${testid}-label`}>{label}</span>
      <span data-testid={`stat-${testid}-value`}>{value}</span>
    </div>
  )
}
