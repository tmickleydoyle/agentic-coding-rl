# Library Manager

A multi-route React application for managing a library's books, members, and loans.

## Routes
- **Home** (`home`): Dashboard showing total books, members, active loans, and overdue loans counts.
- **Books** (`books`): List all books with title, author, ISBN, genre, and availability status. Add new books via a form. Mark books as available/unavailable.
- **Members** (`members`): List all library members with name, email, membershipId, and joinDate. Add new members via a form.
- **Loans** (`loans`): List all active loans showing book title, member name, loanDate, and dueDate. Create new loans by selecting a book (only available) and member. Return a loan (marks book available again).

## Seed Data
### Books (5)
1. { id: "b1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", genre: "Fiction", available: true }
2. { id: "b2", title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", genre: "Fiction", available: false }
3. { id: "b3", title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", genre: "Dystopian", available: true }
4. { id: "b4", title: "Brave New World", author: "Aldous Huxley", isbn: "978-0-06-085052-4", genre: "Dystopian", available: true }
5. { id: "b5", title: "Fahrenheit 451", author: "Ray Bradbury", isbn: "978-1-4516-7331-9", genre: "Dystopian", available: false }

### Members (3)
1. { id: "m1", name: "Alice Johnson", email: "alice@library.com", membershipId: "LIB001", joinDate: "2023-01-15" }
2. { id: "m2", name: "Bob Smith", email: "bob@library.com", membershipId: "LIB002", joinDate: "2023-03-22" }
3. { id: "m3", name: "Carol White", email: "carol@library.com", membershipId: "LIB003", joinDate: "2023-06-10" }

### Loans (2)
1. { id: "l1", bookId: "b2", memberId: "m1", loanDate: "2024-01-10", dueDate: "2024-01-24", returned: false }
2. { id: "l2", bookId: "b5", memberId: "m2", loanDate: "2024-01-15", dueDate: "2024-01-29", returned: false }

## Behaviors
- Adding a book: POST /api/books with { title, author, isbn, genre }. New book starts available: true.
- Adding a member: POST /api/books endpoint? No — members use POST /api/members.
- Creating a loan: POST /api/loans with { bookId, memberId, dueDate }. Sets book available: false.
- Returning a loan: PATCH /api/loans/:id with { returned: true }. Sets book available: true.
- Dashboard counts must be reactive (update when loans/books change).
- Only available books appear in the loan creation dropdown.
- Overdue: dueDate < today and returned: false.

## Fields & Validation
- Book form: title (required), author (required), isbn (required), genre (required).
- Member form: name (required), email (required), membershipId (required).
- Loan form: bookId (required, select from available books), memberId (required, select), dueDate (required).

## data-testids
- `nav-home`, `nav-books`, `nav-members`, `nav-loans`
- `stat-total-books`, `stat-total-members`, `stat-active-loans`, `stat-overdue-loans`
- `book-list`, `book-item`, `book-title`, `book-author`, `book-status`
- `add-book-form`, `input-title`, `input-author`, `input-isbn`, `input-genre`, `btn-add-book`
- `member-list`, `member-item`, `member-name`, `member-email`, `member-membership-id`
- `add-member-form`, `input-member-name`, `input-member-email`, `input-member-id`, `btn-add-member`
- `loan-list`, `loan-item`, `loan-book`, `loan-member`, `loan-due`, `btn-return`
- `add-loan-form`, `select-book`, `select-member`, `input-due-date`, `btn-add-loan`
