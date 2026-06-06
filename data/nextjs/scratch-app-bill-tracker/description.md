# scratch-app-bill-tracker

## Overview
A bill tracker with 4 routes: Dashboard, Bills, Calendar, and Settings.

## Routes
- **Dashboard** (`dashboard`): Shows total monthly bills, number of bills due this month, bills due in the next 7 days.
- **Bills** (`bills`): List all bills (name, amount, dueDay 1-28, category, isActive). Add/toggle/delete bills.
- **Calendar** (`calendar`): Show bills organized by due day (1-31). Each day shows which bills are due.
- **Settings** (`settings`): Toggle a bill's active status. Show total if all active vs deactivated bills.

## Seed Data
Bills:
- { id: "b1", name: "Rent", amount: 1500, dueDay: 1, category: "housing", isActive: true }
- { id: "b2", name: "Electric", amount: 120, dueDay: 15, category: "utilities", isActive: true }
- { id: "b3", name: "Internet", amount: 60, dueDay: 20, category: "utilities", isActive: true }
- { id: "b4", name: "Gym", amount: 45, dueDay: 5, category: "health", isActive: false }

## Fields
- Bill: id, name, amount, dueDay (1-28), category (housing|utilities|health|entertainment|insurance|other), isActive

## Behaviors
- Dashboard total = sum of active bills
- Bills due next 7 days uses current day of month (use day 1 as reference for tests)
- Toggle isActive on/off without deleting
- Calendar groups bills by dueDay
