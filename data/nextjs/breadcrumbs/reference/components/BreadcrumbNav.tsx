'use client'
import { useState } from 'react'

export default function BreadcrumbNav() {
  const [path, setPath] = useState<string[]>(['Home'])

  const append = (seg: string) => setPath((p) => [...p, seg])
  const truncate = (i: number) => setPath((p) => p.slice(0, i + 1))

  return (
    <div>
      <nav data-testid="crumbs">
        {path.map((seg, i) => (
          <button key={i} data-testid={`crumb-${i}`} onClick={() => truncate(i)}>
            {seg}
          </button>
        ))}
      </nav>
      <span data-testid="current">{path[path.length - 1]}</span>
      <button data-testid="go-products" onClick={() => append('Products')}>
        Go to Products
      </button>
      <button data-testid="go-electronics" onClick={() => append('Electronics')}>
        Go to Electronics
      </button>
      <button data-testid="go-phones" onClick={() => append('Phones')}>
        Go to Phones
      </button>
    </div>
  )
}
