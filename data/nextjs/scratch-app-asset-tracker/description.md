# Asset Tracker

A business asset tracking app for managing physical assets, tracking depreciation, and organizing by category.

## Routes
- `/` → Home: total assets, total original value, total current value (after depreciation)
- `/assets` → Assets: list all assets with name, category, purchase price, purchase year; add new asset
- `/depreciation` → Depreciation: for each asset show original value, current value based on depreciation, and depreciated amount
- `/categories` → Categories: unique asset categories with count and total value (current)

## Data Model

### Asset
```ts
interface Asset {
  id: string
  name: string
  category: string
  purchasePrice: number
  purchaseYear: number
  depreciationRate: number  // annual percentage e.g. 20 = 20% per year
}
```

## Current Value Calculation
- yearsOwned = CURRENT_YEAR (2026) - asset.purchaseYear
- currentValue = purchasePrice * Math.pow(1 - depreciationRate / 100, yearsOwned)
- currentValue is floored at 0 (cannot go negative)
- Round to 2 decimal places

## Seed Data (CURRENT_YEAR = 2026)
Assets:
- { id: "a1", name: "MacBook Pro", category: "Electronics", purchasePrice: 3000, purchaseYear: 2024, depreciationRate: 25 }
  - yearsOwned=2, currentValue = 3000 * 0.75^2 = 3000 * 0.5625 = 1687.5
- { id: "a2", name: "Office Desk", category: "Furniture", purchasePrice: 800, purchaseYear: 2022, depreciationRate: 10 }
  - yearsOwned=4, currentValue = 800 * 0.9^4 = 800 * 0.6561 = 524.88
- { id: "a3", name: "Company Car", category: "Vehicles", purchasePrice: 30000, purchaseYear: 2023, depreciationRate: 15 }
  - yearsOwned=3, currentValue = 30000 * 0.85^3 = 30000 * 0.614125 = 18423.75
- { id: "a4", name: "Laptop Stand", category: "Electronics", purchasePrice: 150, purchaseYear: 2025, depreciationRate: 25 }
  - yearsOwned=1, currentValue = 150 * 0.75 = 112.5

## Behaviors

### Home Page
- data-testid="total-assets": count (4)
- data-testid="total-original-value": sum of purchasePrice (33950)
- data-testid="total-current-value": sum of currentValues (rounded individually then summed)

### Assets Page
- Each asset: data-testid="asset-card-{id}"
- Shows name, category, purchasePrice, purchaseYear, depreciationRate
- Add form: name, category, purchasePrice (number), purchaseYear (number), depreciationRate (number)
- Submit: data-testid="add-asset-btn"

### Depreciation Page
- For each asset: data-testid="dep-row-{id}"
- Shows name, original price, current value, depreciated amount (purchasePrice - currentValue)
- data-testid="dep-current-{id}": current value
- data-testid="dep-amount-{id}": depreciated amount

### Categories Page
- For each unique category: data-testid="cat-{category}" (spaces→hyphens)
- Shows category name, asset count, total current value in that category

## API Routes
- GET /api/assets → { assets: Asset[] }
- POST /api/assets → body { name, category, purchasePrice, purchaseYear, depreciationRate } → created Asset
- Missing name returns 400

## Edge Cases
- currentValue cannot go below 0
- Categories page aggregates dynamically from assets list
- Adding an asset updates all computed values (home totals, depreciation, categories)
