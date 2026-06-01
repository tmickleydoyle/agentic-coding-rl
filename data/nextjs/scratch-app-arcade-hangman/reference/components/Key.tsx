'use client'

export default function Key({
  letter,
  disabled,
  onPress,
}: {
  letter: string
  disabled: boolean
  onPress: (letter: string) => void
}) {
  return (
    <button
      data-testid={`key-${letter}`}
      disabled={disabled}
      onClick={() => onPress(letter)}
    >
      {letter}
    </button>
  )
}
