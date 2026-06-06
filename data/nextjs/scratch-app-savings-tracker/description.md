# scratch-app-savings-tracker

## Overview
A savings tracker app with 4 routes: Dashboard, Goals, Contributions, and Progress.

## Routes
- **Dashboard** (`dashboard`): Shows total saved across all goals, number of active goals, most recent contribution.
- **Goals** (`goals`): List goals. Add goal form (name, target amount, deadline). Delete goal by id.
- **Contributions** (`contributions`): Add contribution (goalId, amount, date). List all contributions.
- **Progress** (`progress`): For each goal, show amount saved vs target, percentage complete.

## Seed Data
Goals:
- { id: "g1", name: "Emergency Fund", target: 5000, deadline: "2024-12-31" }
- { id: "g2", name: "Vacation", target: 2000, deadline: "2024-06-30" }

Contributions:
- { id: "c1", goalId: "g1", amount: 500, date: "2024-01-10" }
- { id: "c2", goalId: "g1", amount: 750, date: "2024-02-01" }
- { id: "c3", goalId: "g2", amount: 300, date: "2024-01-15" }

## Fields
- Goal: id, name (string), target (number > 0), deadline (YYYY-MM-DD)
- Contribution: id, goalId (ref to goal id), amount (number > 0), date (YYYY-MM-DD)

## Behaviors
- Total saved = sum of all contributions
- Per-goal saved = sum of contributions matching goalId
- Progress % = (saved / target) * 100, capped at 100
- Deleting goal also removes its contributions
