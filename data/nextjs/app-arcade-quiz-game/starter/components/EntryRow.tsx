'use client'

export default function EntryRow({
  id,
  name,
  score,
}: {
  id: string
  name: string
  score: number
}) {
  // TODO: render the entry name and score.
  void name
  void score
  return <li data-testid={`entry-${id}`} />
}
