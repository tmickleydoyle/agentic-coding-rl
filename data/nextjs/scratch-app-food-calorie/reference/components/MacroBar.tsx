'use client'

export default function MacroBar({
  label,
  value,
  goal,
  testid,
}: {
  label: string
  value: number
  goal: number
  testid: string
}) {
  const onTrack = value <= goal
  return (
    <div data-testid={`macro-${testid}`} data-ontrack={onTrack ? 'true' : 'false'}>
      <span data-testid={`macro-${testid}-label`}>{label}</span>
      <span data-testid={`macro-${testid}-value`}>{value}</span>
      <span data-testid={`macro-${testid}-goal`}>{goal}</span>
    </div>
  )
}
