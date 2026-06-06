# Mutual Aid Network

A community mutual aid app with Requests, Offers, Matches, and a REST API.

## Routes
- `/` — Shell
- `/requests` — aid requests (title, category: Food/Transport/Childcare/Other, requester, status: Open/Fulfilled, date)
- `/offers` — aid offers (title, category, offerer, available: boolean, date)
- `/matches` — manual matches pairing a request with an offer (request title, offer title, matched-by, date)

## Data / Seed
### Requests
```
{ id: "req1", title: "Need groceries delivered", category: "Food", requester: "Alice", status: "Open", date: "2024-06-01" }
{ id: "req2", title: "Ride to clinic", category: "Transport", requester: "Bob", status: "Open", date: "2024-06-02" }
{ id: "req3", title: "Babysitting Tuesday", category: "Childcare", requester: "Carol", status: "Fulfilled", date: "2024-06-03" }
```

### Offers
```
{ id: "off1", title: "Can deliver groceries", category: "Food", offerer: "Dave", available: true, date: "2024-06-01" }
{ id: "off2", title: "Happy to drive", category: "Transport", offerer: "Eve", available: true, date: "2024-06-02" }
{ id: "off3", title: "Available for babysitting", category: "Childcare", offerer: "Frank", available: false, date: "2024-06-03" }
```

### Matches
```
{ id: "m1", requestId: "req3", offerId: "off3", matchedBy: "Admin", date: "2024-06-04" }
```

## Behaviors
- Requests page: add request form (title, category, requester); "Fulfill" button marks request status Fulfilled
- Offers page: add offer form (title, category, offerer); "Toggle Available" flips available boolean
- Matches page: form to create match (select open request, select available offer, matchedBy name)
- API GET /api/requests returns all requests
- API POST /api/requests adds a request (body: {title, category, requester})

## Edge Cases
- Match form: only shows Open requests and available offers in selects
- Empty matches state: "No matches yet"
- Fulfill button only appears on Open requests
