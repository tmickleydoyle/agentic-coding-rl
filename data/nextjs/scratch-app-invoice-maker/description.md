# Invoice Maker

An invoicing app for managing clients, creating invoices with line items, and previewing invoice totals.

## Routes
- `/` → Home: total invoices, total clients, total revenue (sum of all paid invoice totals)
- `/invoices` → Invoices: list all invoices with client, status, total; add new invoice
- `/clients` → Clients: list all clients with name, email; add new client
- `/preview` → Preview: select an invoice, show line items with description/qty/unit price, show subtotal, tax, total

## Data Model

### Client
```ts
interface Client {
  id: string
  name: string
  email: string
}
```

### InvoiceItem
```ts
interface InvoiceItem {
  description: string
  qty: number
  unitPrice: number
}
```

### Invoice
```ts
interface Invoice {
  id: string
  clientId: string
  status: 'draft' | 'sent' | 'paid'
  items: InvoiceItem[]
  taxRate: number  // percentage e.g. 10 for 10%
  createdAt: string
}
```

## Seed Data
Clients:
- { id: "c1", name: "Acme Corp", email: "billing@acme.com" }
- { id: "c2", name: "Globex Inc", email: "pay@globex.com" }

Invoices:
- { id: "i1", clientId: "c1", status: "paid", items: [{ description: "Web Design", qty: 1, unitPrice: 5000 }, { description: "Hosting", qty: 12, unitPrice: 50 }], taxRate: 10, createdAt: "2026-01-15" }
- { id: "i2", clientId: "c2", status: "sent", items: [{ description: "Consulting", qty: 8, unitPrice: 150 }], taxRate: 8, createdAt: "2026-02-01" }
- { id: "i3", clientId: "c1", status: "draft", items: [{ description: "Logo Design", qty: 1, unitPrice: 800 }], taxRate: 10, createdAt: "2026-03-01" }

## Computed Values
- Invoice subtotal = sum(item.qty * item.unitPrice)
- Invoice tax = subtotal * taxRate / 100
- Invoice total = subtotal + tax
- i1: subtotal = 5000 + 600 = 5600, tax = 560, total = 6160
- i2: subtotal = 1200, tax = 96, total = 1296
- i3: subtotal = 800, tax = 80, total = 880

## Behaviors

### Home Page
- data-testid="total-invoices": count (3)
- data-testid="total-clients": count (2)
- data-testid="total-revenue": sum of totals of paid invoices only (i1 = 6160)

### Invoices Page
- Each invoice: data-testid="invoice-item-{id}"
- Shows clientId or client name, status, total
- Add invoice form: clientId (select from clients), status (select), taxRate (number), items as JSON text area
- Submit: data-testid="add-invoice-btn"

### Clients Page
- Each client: data-testid="client-item-{id}"
- Shows name and email
- Add form: name, email inputs
- Submit: data-testid="add-client-btn"

### Preview Page
- Invoice selector: data-testid="invoice-select"
- When selected, show:
  - data-testid="preview-client": client name
  - data-testid="preview-status": status
  - data-testid="preview-subtotal": subtotal
  - data-testid="preview-tax": tax amount
  - data-testid="preview-total": total
  - Each line item: data-testid="preview-item-{index}"

## API Routes
- GET /api/invoices → { invoices: Invoice[] }
- POST /api/invoices → body { clientId, status, items, taxRate } → created Invoice
- GET /api/invoices/clients → { clients: Client[] }
- POST /api/invoices/clients → body { name, email } → created Client

## Edge Cases
- Missing clientId on invoice POST returns 400
- Total revenue only sums paid invoices
- Preview with no invoice selected shows nothing
