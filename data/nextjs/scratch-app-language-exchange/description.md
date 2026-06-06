# scratch-app-language-exchange

A language exchange platform where users can manage vocabulary words, find language partners, and log practice sessions.

## Routes
- **Home** (`home`): Dashboard showing stats — online partner count, total sessions, total practice minutes.
- **Vocabulary** (`vocabulary`): Add/view vocabulary words with word, translation, language; toggle mastered status; show mastered count.
- **Partners** (`partners`): Browse language partners, filter by language, add new partners with native/learning language.
- **Sessions** (`sessions`): Log practice sessions with partner, language, date, duration; delete sessions; show total minutes.

## Seed Data
- Partners: Maria Garcia (Spanish→French, intermediate, online), Yuki Tanaka (Japanese→German, beginner), Pierre Dupont (French→Mandarin, advanced, online)
- Vocab: "hola"=hello (Spanish, unmastered), "gracias"=thank you (Spanish, mastered), "bonjour"=good morning (French, unmastered)
- Sessions: 1 session with Maria (Spanish, 2024-03-01, 30 min)

## Behaviors
- Adding partner requires name; native and learning languages must differ
- Adding vocab requires word and translation; defaults mastered=false
- Adding session requires partner, date, duration; duration must be positive integer
- Filtering partners by language shows those with matching native OR learning language
- Toggle mastered flips boolean; mastered count updates reactively

## API (app/api/sessions/route.ts)
- GET /api/sessions — returns all sessions
- POST /api/sessions — creates session (body: partnerId, partnerName, language, date, durationMinutes, notes); 400 if missing required fields or invalid duration
- DELETE /api/sessions?id=<id> — deletes by id; 404 if not found
