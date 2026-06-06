# Insurance Vault

Store and manage insurance policies, track claims, upload document references, and keep insurer contact info.

## Routes
- **/** — Dashboard with active policies and pending claims
- **/policies** — Add and view insurance policies
- **/claims** — File and track claims against policies
- **/documents** — Reference important policy documents
- **/contacts** — Insurer and agent contact directory

## Features
- Add/remove policies (name, type, provider, policyNumber, premium, startDate, endDate)
- File claims (policyId, description, amount, date, status: open|resolved|denied)
- Store document references (policyId, name, url, type)
- Manage insurer contacts (name, company, phone, email, role)
- Dashboard shows active policies count and open claims count

## Data Model
- Policy: id, name, type (auto|home|life|health|other), provider, policyNumber, premium, startDate, endDate, active
- Claim: id, policyId, description, amount, date, status (open|resolved|denied)
- Document: id, policyId, name, url, type
- Contact: id, name, company, phone, email, role
