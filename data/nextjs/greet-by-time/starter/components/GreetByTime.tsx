export default function GreetByTime({ hour }: { hour: number }) {
  // TODO: pick one of "Good morning"/"Good afternoon"/"Good evening"/"Good night"
  // based on the hour buckets in description.md.
  return <span data-testid="greeting">Good night</span>
}
