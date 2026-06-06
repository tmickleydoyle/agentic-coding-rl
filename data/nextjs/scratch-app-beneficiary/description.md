# Beneficiary Manager App

A multi-route React application for managing estate beneficiary profiles, their asset allocations, and generating a report.

## Routes
- `/` (Profiles): List beneficiary profiles with name, date of birth (YYYY-MM-DD), and contact email. Allow adding and deleting profiles.
- `/allocations`: List allocations with beneficiary name, asset description, and percentage (0-100). Allow adding and deleting allocations. Show a warning if total allocation for any beneficiary exceeds 100%.
- `/report`: For each beneficiary, show their name, total allocation percentage, and list of assets.

## Seed Data
Profiles:
- { id: "p1", name: "Alice Chen", dob: "1985-04-12", email: "alice@example.com" }
- { id: "p2", name: "Bob Tran", dob: "1990-08-23", email: "bob@example.com" }

Allocations:
- { id: "al1", beneficiary: "Alice Chen", asset: "Family Home", percentage: 60 }
- { id: "al2", beneficiary: "Alice Chen", asset: "Savings Account", percentage: 30 }
- { id: "al3", beneficiary: "Bob Tran", asset: "Stock Portfolio", percentage: 100 }

## Behaviors
- Adding profile: name (required) + dob + email; generates id.
- Adding allocation: beneficiary (required) + asset (required) + percentage (0-100); generates id.
- Deleting removes item.
- Report groups allocations by beneficiary name, shows total %.
- Warning shown on allocations page if any beneficiary total > 100.
- NavBar: Profiles, Allocations, Report.

## API
`POST /api/beneficiary` body `{ action: "report" }` returns array of `{ name: string, total: number }`.

## Edge Cases
- No profiles: "No profiles found."
- No allocations: "No allocations found."
- Percentage outside 0-100: ignored.
