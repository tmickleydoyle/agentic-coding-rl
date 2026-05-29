import CardHeader from './CardHeader'
import CardBody from './CardBody'
import CardFooter from './CardFooter'

type Props = { title: string; body: string; action?: string }

export default function Card({ title, body, action }: Props) {
  // TODO: render data-testid="card" containing CardHeader, CardBody, and CardFooter
  // (footer only when `action` is provided).
  return <div data-testid="card"></div>
}
