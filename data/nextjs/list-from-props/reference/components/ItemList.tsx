export default function ItemList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p data-testid="empty">No items</p>
  }
  return (
    <ul data-testid="list">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}
