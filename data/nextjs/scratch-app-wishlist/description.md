# scratch-app-wishlist

A personal wishlist app for tracking desired items, organizing by category, and sharing lists.

## Routes
- `/` — Home: shows wishlist summary and total estimated cost
- `/items` — Manage wishlist items (add, remove, mark purchased, filter by category)
- `/categories` — Manage categories (add, rename)
- `/shared` — View a shareable read-only snapshot of your wishlist

## Features
- Add items with name, price, URL, category, and priority (low/medium/high)
- Mark items as purchased or unpurchased
- Organize items by category
- Shared view shows only unpurchased items
- All state managed via AppStateProvider context

## API
- `GET /api/wishlist` — list all items
- `POST /api/wishlist` — add an item `{ name, price, url, category, priority }`
- `PATCH /api/wishlist` — update item `{ id, purchased? }`
- `DELETE /api/wishlist` — remove item `{ id }`
