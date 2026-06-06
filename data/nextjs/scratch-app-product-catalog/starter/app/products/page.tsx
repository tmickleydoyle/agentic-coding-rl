'use client'
import React from 'react'
export function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <form data-testid="add-product-form">
        <input data-testid="input-product-name" placeholder="Name" />
        <input data-testid="input-product-sku" placeholder="SKU" />
        <input data-testid="input-product-price" type="number" placeholder="Price" />
        <select data-testid="select-product-category"><option value="">Select category</option></select>
        <input data-testid="input-product-stock" type="number" placeholder="Stock" />
        <button data-testid="btn-add-product" type="submit">Add Product</button>
      </form>
      <ul data-testid="product-list"></ul>
    </div>
  )
}
