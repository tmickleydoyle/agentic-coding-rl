# Build a multi-step checkout wizard

Build a single-page React application that walks a shopper through a four-step checkout flow:
**Cart → Shipping → Payment → Review**, ending on an order-confirmation screen. Only one step is
shown at a time, and each step has a visible heading with that step's name.

Seed the cart with exactly these items:

- Notebook — $12.00 × 2
- Pen — $3.00 × 1

Steps:

- **Cart.** List each item with its name, price, and quantity. Each item has a control to
  increase its quantity, decrease it (not below 1), and remove it. Show the running
  `Subtotal: $27.00` and keep it accurate as quantities change.
- **Shipping.** Collect **Full name**, **Address**, **City**, and **ZIP code**. The ZIP must be
  exactly 5 digits. All four fields are required.
- **Payment.** Collect **Card number** (16 digits), **Name on card**, **Expiry** (format
  `MM/YY`), and **CVC** (3 digits).
- **Review.** Show the order summary with four lines: `Subtotal: $…`, a `Shipping:` line, a
  `Tax: $…` line, and `Total: $…`. Shipping is **free** when the subtotal is $50.00 or more,
  otherwise **$5.99** (show the word `Free` when it is free). Tax is **8% of the subtotal**,
  rounded to the nearest cent. The total is subtotal + shipping + tax.

Navigation: a **Continue** button advances to the next step but is **disabled until the current
step is valid** (a non-empty cart; all shipping fields valid; all payment fields valid). A
**Back** button returns to the previous step with its data preserved. On Review, a **Place order**
button finishes and shows an **Order confirmed** screen that displays the total paid.

All state is in memory. Implement the root component as the default export of `app/page.tsx`. Use
only `react` and `react-dom` — no other libraries, no Next.js APIs.
