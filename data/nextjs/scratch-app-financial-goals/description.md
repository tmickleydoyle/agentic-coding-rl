# scratch-app-financial-goals

## Overview
A financial goals tracker with 4 routes: Dashboard, Goals, Milestones, and Insights.

## Routes
- **Dashboard** (`dashboard`): Shows total goals, completed goals, total target amount, total saved amount.
- **Goals** (`goals`): List goals (title, targetAmount, savedAmount, category, status). Add/delete goals. Update saved amount.
- **Milestones** (`milestones`): For each goal, list milestones (25%, 50%, 75%, 100%). Show which milestones have been reached based on savedAmount.
- **Insights** (`insights`): Show goals grouped by category. Show average completion % across all goals. Show nearest goal to completion.

## Seed Data
Goals:
- { id: "fg1", title: "Buy a Car", targetAmount: 20000, savedAmount: 8000, category: "purchase", status: "active" }
- { id: "fg2", title: "Emergency Fund", targetAmount: 10000, savedAmount: 10000, category: "savings", status: "completed" }
- { id: "fg3", title: "Down Payment", targetAmount: 50000, savedAmount: 15000, category: "purchase", status: "active" }
- { id: "fg4", title: "Vacation", targetAmount: 3000, savedAmount: 2700, category: "lifestyle", status: "active" }

## Fields
- Goal: id, title, targetAmount, savedAmount, category (purchase|savings|investment|lifestyle|education|other), status (active|completed|paused)

## Behaviors
- Completion % = (savedAmount / targetAmount) * 100
- Milestone reached if savedAmount >= milestone threshold
- Nearest to completion = highest completion % among active goals
- Updating saved amount recalculates completion and milestones
