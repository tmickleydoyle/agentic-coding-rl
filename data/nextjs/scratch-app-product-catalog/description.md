# Product Catalog

A multi-route React application for managing a product catalog with categories and reviews.

## Routes
- **Home** (`home`): Dashboard with total products, total categories, total reviews, and average rating across all reviews.
- **Products** (`products`): List products with name, sku, price, categoryId (category name shown), and stock. Add new products. Toggle active/inactive.
- **Categories** (`categories`): List categories with name and description. Add new categories.
- **Reviews** (`reviews`): List reviews with productName, rating (1-5), comment, and reviewer. Add new reviews by selecting a product.

## Seed Data
### Categories (3)
1. { id: "c1", name: "Electronics", description: "Electronic devices and accessories" }
2. { id: "c2", name: "Books", description: "Physical and digital books" }
3. { id: "c3", name: "Clothing", description: "Apparel and accessories" }

### Products (5)
1. { id: "p1", name: "Wireless Headphones", sku: "SKU001", price: 79.99, categoryId: "c1", stock: 45, active: true }
2. { id: "p2", name: "TypeScript Handbook", sku: "SKU002", price: 39.99, categoryId: "c2", stock: 120, active: true }
3. { id: "p3", name: "Running Shoes", sku: "SKU003", price: 129.99, categoryId: "c3", stock: 30, active: true }
4. { id: "p4", name: "USB-C Hub", sku: "SKU004", price: 49.99, categoryId: "c1", stock: 0, active: false }
5. { id: "p5", name: "Cotton T-Shirt", sku: "SKU005", price: 24.99, categoryId: "c3", stock: 200, active: true }

### Reviews (4)
1. { id: "rv1", productId: "p1", rating: 5, comment: "Excellent sound quality!", reviewer: "John D." }
2. { id: "rv2", productId: "p1", rating: 4, comment: "Good value for money", reviewer: "Sara M." }
3. { id: "rv3", productId: "p2", rating: 5, comment: "Best TypeScript resource", reviewer: "Dev K." }
4. { id: "rv4", productId: "p3", rating: 3, comment: "Comfortable but sizing runs small", reviewer: "Lisa P." }

## Behaviors
- Add product: POST /api/products with { name, sku, price, categoryId, stock }. Active defaults to true.
- Add category: POST /api/categories with { name, description }.
- Add review: POST /api/reviews with { productId, rating, comment, reviewer }.
- Toggle product active: PATCH /api/products/:id with { active: !current }.
- Average rating = sum of all ratings / count of reviews (rounded to 1 decimal place).

## data-testids
- `nav-home`, `nav-products`, `nav-categories`, `nav-reviews`
- `stat-total-products`, `stat-total-categories`, `stat-total-reviews`, `stat-avg-rating`
- `product-list`, `product-item`, `product-name`, `product-sku`, `product-price`, `product-stock`, `btn-toggle-active`
- `add-product-form`, `input-product-name`, `input-product-sku`, `input-product-price`, `select-product-category`, `input-product-stock`, `btn-add-product`
- `category-list`, `category-item`, `category-name`, `category-description`
- `add-category-form`, `input-category-name`, `input-category-description`, `btn-add-category`
- `review-list`, `review-item`, `review-product`, `review-rating`, `review-comment`, `review-reviewer`
- `add-review-form`, `select-review-product`, `input-review-rating`, `input-review-comment`, `input-review-reviewer`, `btn-add-review`
