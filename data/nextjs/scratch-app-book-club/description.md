# Book Club App

Manage a book club with books, members, and reviews.

## Routes
- **Home** (`home`): Dashboard showing total books, total members, and total reviews count.
- **Books** (`books`): List all books with title, author, genre, year, status (reading/finished/wishlist). Add new book. Delete book.
- **Reviews** (`reviews`): List reviews with book title, member name, rating (1-5), text, date. Add new review (select book, select member, rating, text).
- **Members** (`members`): List club members with name, joinDate, and their review count. Add new member (name, joinDate).

## Seed Data
Three books:
1. "The Great Gatsby", F. Scott Fitzgerald, Fiction, 1925, finished
2. "Dune", Frank Herbert, Sci-Fi, 1965, reading
3. "Atomic Habits", James Clear, Non-Fiction, 2018, wishlist

Two members:
1. Sarah Connor, joined 2024-01-01
2. John Wick, joined 2024-02-15

Two reviews:
1. "The Great Gatsby", Sarah Connor, rating: 5, "A masterpiece", 2024-03-01
2. "Dune", John Wick, rating: 4, "Epic world-building", 2024-04-10

## Fields & Validation
- Book: title (required), author (required), genre (required), year (required number), status (reading/finished/wishlist, default wishlist)
- Review: bookId (required), memberId (required), rating (1-5), text (required), date (required)
- Member: name (required), joinDate (required)

## Behaviors
- Books page: filter by status using a select dropdown
- Reviews page: shows book title and member name resolved from IDs
- Members page: shows review count per member
- API returns 400 for missing required fields

## API
- GET/POST /api/books — list / create book
- DELETE /api/books — delete `{ id }`
- GET/POST /api/reviews — list / create review
- GET/POST /api/members — list / create member

## data-testid Requirements
- nav-home, nav-books, nav-reviews, nav-members
- dashboard-book-count, dashboard-member-count, dashboard-review-count
- book-list, book-item, book-status-filter, add-book-form, book-title-input, book-author-input, book-genre-input, book-year-input, book-status-select, submit-book, delete-book
- review-list, review-item, add-review-form, review-book-select, review-member-select, review-rating-input, review-text-input, review-date-input, submit-review
- member-list, member-item, add-member-form, member-name-input, member-join-date-input, submit-member
