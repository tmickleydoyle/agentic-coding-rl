'use client'
import { useState } from 'react'

interface MenuItem {
  id: number
  name: string
  price: number
  category: string
}

const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Soup of the Day', price: 5.99, category: 'Appetizers' },
  { id: 2, name: 'Bruschetta', price: 7.49, category: 'Appetizers' },
  { id: 3, name: 'Calamari', price: 9.99, category: 'Appetizers' },
  { id: 4, name: 'Grilled Salmon', price: 18.99, category: 'Mains' },
  { id: 5, name: 'Pasta Carbonara', price: 14.99, category: 'Mains' },
  { id: 6, name: 'Veggie Burger', price: 12.49, category: 'Mains' },
  { id: 7, name: 'Cheesecake', price: 6.99, category: 'Desserts' },
  { id: 8, name: 'Chocolate Lava Cake', price: 7.99, category: 'Desserts' },
  { id: 9, name: 'Tiramisu', price: 6.49, category: 'Desserts' },
]

const CATEGORIES = ['All', 'Appetizers', 'Mains', 'Desserts']

interface CartItem {
  cartId: number
  menuItem: MenuItem
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [nextCartId, setNextCartId] = useState(1)

  const filtered = activeCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeCategory)

  function addToCart(item: MenuItem) {
    setCart(prev => [...prev, { cartId: nextCartId, menuItem: item }])
    setNextCartId(n => n + 1)
  }

  function clearCart() {
    setCart([])
  }

  const cartTotal = cart.reduce((sum, ci) => sum + ci.menuItem.price, 0)

  function fmt(n: number) {
    return '$' + n.toFixed(2)
  }

  return (
    <div>
      <h1>Restaurant Menu</h1>

      <div data-testid="category-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div data-testid="menu-grid">
        {filtered.map(item => (
          <div key={item.id} data-testid="menu-item">
            <span data-testid="item-name">{item.name}</span>
            <span data-testid="item-price">{fmt(item.price)}</span>
            <span data-testid="item-category">{item.category}</span>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div data-testid="cart-section">
        <h2>Cart</h2>
        <ul>
          {cart.map(ci => (
            <li key={ci.cartId} data-testid="cart-item">
              {ci.menuItem.name} — {fmt(ci.menuItem.price)}
            </li>
          ))}
        </ul>
        <p data-testid="cart-count">{cart.length}</p>
        <p data-testid="cart-total">{fmt(cartTotal)}</p>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  )
}
