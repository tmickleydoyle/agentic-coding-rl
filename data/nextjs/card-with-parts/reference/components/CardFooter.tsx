export default function CardFooter({ action }: { action: string }) {
  return (
    <footer data-testid="card-footer">
      <button data-testid="card-action">{action}</button>
    </footer>
  )
}
