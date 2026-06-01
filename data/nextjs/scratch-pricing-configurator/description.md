# Build a Pricing Configurator

Build a single-page React application that lets a user configure a subscription price by choosing a base plan, toggling add-ons, and switching between billing periods.

## Billing period switch

At the top of the page, show a **Billing** section with two buttons: **Monthly** and **Annual**. The active period is highlighted (use `aria-pressed` so tests can detect it). When **Annual** is selected, a **10% discount** is applied to the total.

## Base plans

Show a **Base Plan** section with exactly three radio-button options:

| Label | Monthly price |
|---|---|
| Starter | $9 |
| Professional | $29 |
| Enterprise | $99 |

Exactly one plan is always selected; default to **Starter**.

## Add-ons

Show an **Add-ons** section with exactly three checkboxes. Each starts **unchecked**:

| Label | Monthly price |
|---|---|
| Extra Storage | $5 |
| Priority Support | $10 |
| Advanced Analytics | $15 |

Checking an add-on includes its price in the total; unchecking removes it.

## Live total

Below the add-ons, show the running total as a single line:

`Total: $XX.XX per month` (Monthly) or `Total: $XX.XX per month (10% annual discount applied)` (Annual)

The dollar amount is always formatted with **exactly two decimal places**. The calculation is:

- Monthly: `(base + sum of checked add-ons)`, formatted to 2 dp.
- Annual: `(base + sum of checked add-ons) * 0.90`, formatted to 2 dp.

For example, with Starter ($9) selected, Extra Storage ($5) checked, and Annual billing active, the total is `$12.60` → display `Total: $12.60 per month (10% annual discount applied)`.

## Behaviour

- Switching between Monthly and Annual instantly recalculates the total.
- Selecting a different plan instantly recalculates.
- Toggling an add-on instantly recalculates.
- State is kept in memory — no backend needed.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
