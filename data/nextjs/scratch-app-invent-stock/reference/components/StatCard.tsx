'use client'

export default function StatCard({
  label,
  value,
  testid,
}: {
  label: string
  value: number
  testid: string
}) {
  return (
    <div data-testid={testid}>
      <span data-testid={`${testid}-label`}>{label}</span>
      <span data-testid={`${testid}-value`}>{value}</span>
    </div>
  )
}
