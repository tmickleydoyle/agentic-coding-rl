'use client'

export default function Choice({
  index,
  label,
  onChoose,
}: {
  index: number
  label: string
  onChoose: (index: number) => void
}) {
  // TODO: render an answer button calling onChoose(index).
  void label
  void onChoose
  return <button data-testid={`choice-${index}`} />
}
