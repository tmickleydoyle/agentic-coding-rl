# Vocab Trainer App

A multi-route vocabulary trainer for learning words and their definitions.

## Routes
- **Home** (`/`): Shows total word count, quiz count completed, and a "Start Quiz" button.
- **Library** (`/library`): CRUD for words. Each word has: id, term, definition, category. Filter by category.
- **Quiz** (`/quiz`): Randomly picks 5 words from the library. Shows definition; user types the term. After submitting each answer, show correct/incorrect. At the end, show score.
- **Results** (`/results`): History of quiz attempts — each with date, score (correct out of 5).

## Seed Data
Words: `[{ id: "w1", term: "Ephemeral", definition: "Lasting for a very short time", category: "adjective" }, { id: "w2", term: "Ubiquitous", definition: "Present everywhere", category: "adjective" }, { id: "w3", term: "Loquacious", definition: "Tending to talk a great deal", category: "adjective" }, { id: "w4", term: "Pensive", definition: "Engaged in deep thought", category: "adjective" }, { id: "w5", term: "Serene", definition: "Calm and peaceful", category: "adjective" }]`

## Behaviors
- Adding a word requires non-empty term and definition.
- Duplicate terms (case-insensitive) are rejected.
- Quiz answers are case-insensitive comparison.
- Quiz records a result when completed.
- Filtering library by category shows only matching words; "All" shows all.

## API
`GET /api/words` → returns `{ words: Word[] }`
`POST /api/words` body `{ term, definition, category }` → returns `{ word: Word }`
`DELETE /api/words?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Quiz with fewer than 5 words: use all available words.
- Empty library: quiz shows "No words available".
- Results with no history: show "No quizzes taken yet".
