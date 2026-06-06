# Trust Manager App

A multi-route React application for managing legal trusts, recording distributions, and viewing an overview.

## Routes
- `/` (Trusts): List trusts with name, trustee, and principal amount. Allow adding and deleting trusts.
- `/distributions`: List distribution records with trust name, beneficiary, amount, and date. Allow adding and deleting distributions.
- `/overview`: Summary of total trust principal, total distributed, and remaining (principal - distributed). Per-trust breakdown showing trust name, principal, distributed, and remaining.

## Seed Data
Trusts:
- { id: "t1", name: "Family Trust", trustee: "Alice", principal: 500000 }
- { id: "t2", name: "Education Trust", trustee: "Bob", principal: 150000 }

Distributions:
- { id: "d1", trustName: "Family Trust", beneficiary: "Carol", amount: 25000, date: "2024-03-01" }
- { id: "d2", trustName: "Education Trust", beneficiary: "Dave", amount: 10000, date: "2024-04-15" }

## Behaviors
- Adding a trust: name (required) + trustee (required) + principal (positive number).
- Adding a distribution: trustName (required) + beneficiary (required) + amount (positive) + date (required).
- Overview total principal = sum of all trust principals.
- Overview total distributed = sum of all distributions.
- Overview remaining = total principal - total distributed.
- Per-trust distributed = sum of distributions matching that trust name.
- NavBar: Trusts, Distributions, Overview.

## API
`GET /api/trust` returns `{ trustCount: number, totalPrincipal: number, totalDistributed: number }`.

## Edge Cases
- No trusts: "No trusts found."
- No distributions: "No distributions found."
- Invalid principal/amount (non-positive): ignored.
