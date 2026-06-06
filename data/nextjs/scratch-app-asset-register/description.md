# Asset Register App

A multi-route React application for registering estate assets, recording valuations over time, and viewing a summary.

## Routes
- `/` (Register): List all registered assets with name, category (Property | Vehicle | Financial | Other), and acquisition date. Allow adding and deleting assets.
- `/valuations`: List valuation records with asset name, value, and valuation date. Allow adding and deleting valuations.
- `/summary`: For each asset, show the most recent valuation value and date. Show total current portfolio value (sum of most recent valuations per asset).

## Seed Data
Assets:
- { id: "a1", name: "Main Residence", category: "Property", acquired: "2010-06-15" }
- { id: "a2", name: "Tesla Model S", category: "Vehicle", acquired: "2022-03-01" }
- { id: "a3", name: "ISA Account", category: "Financial", acquired: "2015-09-01" }

Valuations:
- { id: "v1", assetName: "Main Residence", value: 480000, date: "2024-01-01" }
- { id: "v2", assetName: "Main Residence", value: 500000, date: "2024-06-01" }
- { id: "v3", assetName: "Tesla Model S", value: 35000, date: "2024-06-01" }
- { id: "v4", assetName: "ISA Account", value: 45000, date: "2024-06-01" }

## Behaviors
- Adding asset: name (required) + category + acquired date; generates id.
- Adding valuation: assetName (required) + value (positive) + date (required); generates id.
- Summary: most recent valuation = latest by date per asset.
- Total portfolio = sum of most recent valuations.
- NavBar: Register, Valuations, Summary.

## API
`GET /api/assets` returns `{ assetCount: number, valuationCount: number, totalValue: number }` where totalValue uses most recent valuation per asset.

## Edge Cases
- Asset with no valuations shows "No valuation" in summary.
- Valuation with non-positive value is ignored.
- No assets: "No assets found." on register page.
