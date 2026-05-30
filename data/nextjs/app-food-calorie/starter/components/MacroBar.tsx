'use client'

export default function MacroBar(_props: {
  label: string
  value: number
  goal: number
  testid: string
}) {
  // TODO: render macro-<testid> with -value/-goal and data-ontrack (value <= goal)
  return <div data-testid={`macro-${_props.testid}`} />
}
