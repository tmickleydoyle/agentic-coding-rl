# Rent Manager

A property rent management app for landlords to track tenants, collect rent payments, and manage leases.

## Routes
- **/** — Dashboard with rent summary
- **/tenants** — List and add tenants with lease info
- **/payments** — Record and view rent payments
- **/settings** — Property settings and rent amounts

## Features
- Add/remove tenants (name, unit, monthly rent, lease dates)
- Record rent payments (tenant, amount, date, month)
- Mark payments as paid/overdue
- Dashboard shows total expected vs collected rent
- Filter payments by month

## Data Model
- Tenant: id, name, unit, monthlyRent, leaseStart, leaseEnd, status
- Payment: id, tenantId, amount, date, month, status (paid|overdue|pending)
