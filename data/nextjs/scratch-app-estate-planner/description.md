# Estate Planner App

A multi-route React application for planning and tracking an estate. Users can view a dashboard summary, manage assets, manage beneficiaries, and write notes.

## Routes
- `/` (Dashboard): Summary cards showing total asset value, number of assets, number of beneficiaries, and a recent notes preview.
- `/assets`: List all assets with name, type (Real Estate | Investment | Personal Property | Cash), value (number), and assigned beneficiary. Allow adding a new asset via a form. Allow deleting an asset.
- `/beneficiaries`: List all beneficiaries with name and relationship (Spouse | Child | Sibling | Other). Allow adding and deleting beneficiaries.
- `/notes`: A simple text area showing a single estate note. Allow editing and saving.

## Seed Data
Assets:
- { id: "a1", name: "Family Home", type: "Real Estate", value: 450000, beneficiary: "Alice" }
- { id: "a2", name: "Stock Portfolio", type: "Investment", value: 120000, beneficiary: "Bob" }
- { id: "a3", name: "Savings Account", type: "Cash", value: 30000, beneficiary: "Alice" }

Beneficiaries:
- { id: "b1", name: "Alice", relationship: "Spouse" }
- { id: "b2", name: "Bob", relationship: "Child" }

Notes: "Review asset allocation annually."

## Behaviors
- Dashboard total value = sum of all asset values.
- Adding an asset: name + type + value (number) + beneficiary (text); generates a unique id.
- Adding a beneficiary: name + relationship; generates a unique id.
- Deleting removes item from list.
- Saving notes updates the stored note string.
- NavBar shows links: Dashboard, Assets, Beneficiaries, Notes.

## API
`POST /api/estate` body `{ action: "summary" }` returns `{ totalValue: number, assetCount: number, beneficiaryCount: number }`.

## Edge Cases
- Empty asset list: show "No assets found."
- Empty beneficiary list: show "No beneficiaries found."
- Asset value must be a positive number; invalid submissions are ignored.
