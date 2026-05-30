'use client'

export default function StatCard(_props: { label: string; value: number; testid: string }) {
  // TODO: render <div data-testid={testid}> with a -label and -value child.
  return <div data-testid={_props.testid} />
}
