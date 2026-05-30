'use client'
import { useApp } from '../../components/AppStateProvider'

export default function OrdersPage() {
  const { orders, products, fulfillOrder } = useApp()

  const productName = (id: string): string =>
    products.find((p) => p.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-orders">
      <h1>Orders</h1>
      <ul data-testid="order-list">
        {orders.map((o) => (
          <li key={o.id} data-testid={`order-${o.id}`} data-fulfilled={o.fulfilled ? 'true' : 'false'}>
            <span data-testid={`order-${o.id}-product`}>{productName(o.productId)}</span>
            <span data-testid={`order-${o.id}-qty`}>{o.qty}</span>
            {o.fulfilled ? (
              <span data-testid={`order-${o.id}-done`}>Fulfilled</span>
            ) : (
              <button data-testid={`fulfill-${o.id}`} onClick={() => fulfillOrder(o.id)}>
                Mark fulfilled
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
