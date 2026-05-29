export type Command = {
  id: string
  label: string
  category: string
  run: () => void
}
