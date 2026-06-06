# scratch-app-visa-tracker

## Overview
A visa tracker app for travelers to manage visa applications, track deadlines, and see upcoming reminders for expiring visas.

## Routes
- `/` — Home: title, counts by status (applied/approved/expired)
- `/visas` — Visa list: all visa records
- `/add-visa` — Form to add a new visa
- `/reminders` — Reminders: visas expiring within 30 days of today (today = 2024-06-01 for test purposes)

## Data Model (Visa)
```ts
interface Visa {
  id: string;
  country: string;
  visaType: string;       // e.g. "Tourist", "Business"
  appliedDate: string;    // "YYYY-MM-DD"
  expiryDate: string;     // "YYYY-MM-DD"
  status: "applied" | "approved" | "expired";
  passportNumber: string;
  notes: string;
}
```

## Seed Data
```ts
[
  { id: "1", country: "Japan", visaType: "Tourist", appliedDate: "2024-01-10", expiryDate: "2024-06-10", status: "approved", passportNumber: "A1234567", notes: "3-month stay" },
  { id: "2", country: "USA", visaType: "Business", appliedDate: "2024-02-01", expiryDate: "2024-12-31", status: "approved", passportNumber: "A1234567", notes: "B1 visa" },
  { id: "3", country: "China", visaType: "Tourist", appliedDate: "2024-03-15", expiryDate: "2024-04-15", status: "expired", passportNumber: "A1234567", notes: "Expired" },
  { id: "4", country: "India", visaType: "eVisa", appliedDate: "2024-05-20", expiryDate: "2024-07-20", status: "applied", passportNumber: "A1234567", notes: "Pending" },
]
```

## Behaviors

### Home (`/`)
- Heading "Visa Tracker"
- data-testid="home-applied-count" — visas with status "applied"
- data-testid="home-approved-count" — visas with status "approved"
- data-testid="home-expired-count" — visas with status "expired"

### Visas (`/visas`)
- data-testid="visa-card" per visa
- data-testid="visa-country", "visa-type", "visa-status", "visa-expiry" within each card

### Add Visa (`/add-visa`)
- Fields: country (text), visaType (text), appliedDate (date), expiryDate (date), status (select: applied/approved/expired), passportNumber (text), notes (textarea)
- data-testid: input-country, input-visa-type, input-applied-date, input-expiry-date, input-status, input-passport, input-notes, submit-visa
- On submit: adds visa, navigates to /visas

### Reminders (`/reminders`)
- data-testid="reminders-page"
- Shows visas whose expiryDate is between today (2024-06-01) and 30 days later (2024-07-01) inclusive
- data-testid="reminder-card" per visa
- data-testid="reminder-country" and "reminder-days" (days until expiry from 2024-06-01)
- From seed: Japan (expiryDate 2024-06-10, 9 days) qualifies; USA and China do not qualify within 30 days; India (2024-07-20) does not qualify

## API: /api/visas
- GET: all visas
- POST: create visa, return 201

## Edge Cases
- Expired visas still appear in list, not in reminders (already past)
- Reminders only shows approved visas that expire within 30 days (not applied/expired)
