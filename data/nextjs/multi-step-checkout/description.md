# Multi-step checkout

Implement a client component `Checkout` in `components/Checkout.tsx`. Three pages:

**1. Cart** (initial):
- `<h1 data-testid="page-title">Cart</h1>`
- `<span data-testid="total">"$<n>"</span>` where `<n>` starts at `0`.
- `<button data-testid="add">"Add $5"</button>` adds 5 to the total.
- `<button data-testid="next">"Continue"</button>` advances to step 2. `disabled` when total is 0.

**2. Shipping**:
- `<h1 data-testid="page-title">Shipping</h1>`
- `<input data-testid="address">` (controlled).
- `<button data-testid="back">"Back"</button>` returns to Cart (total preserved).
- `<button data-testid="next">"Continue"</button>` advances to Confirmation. `disabled` when address is empty (after trim).

**3. Confirmation**:
- `<h1 data-testid="page-title">Confirmation</h1>`
- `<p data-testid="summary">"<address> · $<total>"</p>`
- `<button data-testid="back">"Back"</button>` returns to Shipping (address preserved).
- `<button data-testid="submit">"Place order"</button>` replaces everything with `<p data-testid="done">"Order placed"</p>`.

Default export.
