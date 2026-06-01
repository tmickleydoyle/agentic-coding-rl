'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSales } from '../../hooks/useSales'
import ProductRow from '../../components/ProductRow'

export default function ProductsPage() {
  const { selectedProduct, selectProduct } = useApp()
  const { byProduct } = useSales()
  const detail = byProduct.find((p) => p.product === selectedProduct)
  return (
    <section data-testid="page-products">
      <h1>Products</h1>
      <ul data-testid="product-list">
        {byProduct.map((p) => (
          <ProductRow
            key={p.product}
            product={p.product}
            revenue={p.revenue}
            units={p.units}
            onSelect={selectProduct}
          />
        ))}
      </ul>
      {selectedProduct && detail ? (
        <div data-testid="product-detail">
          <span data-testid="detail-name">{detail.product}</span>
          <span data-testid="detail-revenue">{detail.revenue}</span>
        </div>
      ) : null}
    </section>
  )
}
