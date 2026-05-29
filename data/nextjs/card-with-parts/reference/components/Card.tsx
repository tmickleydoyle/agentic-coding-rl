import CardHeader from './CardHeader'
import CardBody from './CardBody'
import CardFooter from './CardFooter'

type Props = { title: string; body: string; action?: string }

export default function Card({ title, body, action }: Props) {
  return (
    <div data-testid="card">
      <CardHeader title={title} />
      <CardBody body={body} />
      {action !== undefined && <CardFooter action={action} />}
    </div>
  )
}
