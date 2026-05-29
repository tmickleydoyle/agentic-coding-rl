'use client'
import { useState } from 'react'

export default function BreadcrumbNav() {
  // TODO: maintain a path stack starting ["Home"]; render crumbs, current=last;
  // 3 go-* buttons append; clicking crumb-<i> truncates path to that index + 1.
  return (
    <div>
      <nav data-testid="crumbs"></nav>
      <span data-testid="current">Home</span>
      <button data-testid="go-products">Go to Products</button>
      <button data-testid="go-electronics">Go to Electronics</button>
      <button data-testid="go-phones">Go to Phones</button>
    </div>
  )
}
