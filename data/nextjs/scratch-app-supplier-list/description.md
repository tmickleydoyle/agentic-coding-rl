# Supplier List

A multi-route React application for managing suppliers, their contacts, and contracts.

## Routes
- **Home** (`home`): Dashboard with total suppliers, active contracts, total contacts, and expired contracts count.
- **Suppliers** (`suppliers`): List suppliers with name, category, country, and status (active/inactive). Add new suppliers. Toggle active/inactive.
- **Contacts** (`contacts`): List supplier contacts with name, email, phone, supplierId (supplier name shown), and role. Add new contacts.
- **Contracts** (`contracts`): List contracts with supplierId (supplier name), startDate, endDate, value, and status (active/expired). Add new contracts. A contract is expired if endDate < today.

## Seed Data
### Suppliers (5)
1. { id: "sup1", name: "Acme Corp", category: "Electronics", country: "USA", status: "active" }
2. { id: "sup2", name: "Global Parts Ltd", category: "Components", country: "UK", status: "active" }
3. { id: "sup3", name: "FastShip Co", category: "Logistics", country: "Germany", status: "inactive" }
4. { id: "sup4", name: "TechSource Inc", category: "Electronics", country: "Taiwan", status: "active" }
5. { id: "sup5", name: "BulkGoods SA", category: "Raw Materials", country: "Brazil", status: "active" }

### Contacts (5)
1. { id: "con1", name: "John Smith", email: "john@acme.com", phone: "555-0101", supplierId: "sup1", role: "Account Manager" }
2. { id: "con2", name: "Emily Jones", email: "emily@globalparts.com", phone: "555-0102", supplierId: "sup2", role: "Sales Director" }
3. { id: "con3", name: "Hans Mueller", email: "hans@fastship.de", phone: "555-0103", supplierId: "sup3", role: "Operations" }
4. { id: "con4", name: "Wei Chen", email: "wei@techsource.com", phone: "555-0104", supplierId: "sup4", role: "Technical Lead" }
5. { id: "con5", name: "Maria Santos", email: "maria@bulkgoods.com", phone: "555-0105", supplierId: "sup5", role: "Procurement" }

### Contracts (4)
1. { id: "ct1", supplierId: "sup1", startDate: "2024-01-01", endDate: "2024-12-31", value: 50000, status: "active" }
2. { id: "ct2", supplierId: "sup2", startDate: "2023-01-01", endDate: "2023-12-31", value: 30000, status: "expired" }
3. { id: "ct3", supplierId: "sup4", startDate: "2024-03-01", endDate: "2025-02-28", value: 75000, status: "active" }
4. { id: "ct4", supplierId: "sup5", startDate: "2024-06-01", endDate: "2024-11-30", value: 20000, status: "active" }

## Behaviors
- Add supplier: POST /api/suppliers with { name, category, country }. Status defaults to "active".
- Toggle supplier status: PATCH /api/suppliers/:id.
- Add contact: POST /api/contacts with { name, email, phone, supplierId, role }.
- Add contract: POST /api/contracts with { supplierId, startDate, endDate, value }. Status defaults to "active" or "expired" based on endDate.
- Active contracts = status "active". Expired = status "expired".

## data-testids
- `nav-home`, `nav-suppliers`, `nav-contacts`, `nav-contracts`
- `stat-total-suppliers`, `stat-active-contracts`, `stat-total-contacts`, `stat-expired-contracts`
- `supplier-list`, `supplier-item`, `supplier-name`, `supplier-category`, `supplier-country`, `supplier-status`, `btn-toggle-supplier`
- `add-supplier-form`, `input-supplier-name`, `input-supplier-category`, `input-supplier-country`, `btn-add-supplier`
- `contact-list`, `contact-item`, `contact-name`, `contact-email`, `contact-supplier`, `contact-role`
- `add-contact-form`, `input-contact-name`, `input-contact-email`, `input-contact-phone`, `select-contact-supplier`, `input-contact-role`, `btn-add-contact`
- `contract-list`, `contract-item`, `contract-supplier`, `contract-value`, `contract-end-date`, `contract-status`
- `add-contract-form`, `select-contract-supplier`, `input-contract-start`, `input-contract-end`, `input-contract-value`, `btn-add-contract`
