export default function GreetByTime({ hour }: { hour: number }) {
  let text = 'Good night'
  if (hour >= 5 && hour <= 11) text = 'Good morning'
  else if (hour >= 12 && hour <= 16) text = 'Good afternoon'
  else if (hour >= 17 && hour <= 21) text = 'Good evening'
  return <span data-testid="greeting">{text}</span>
}
