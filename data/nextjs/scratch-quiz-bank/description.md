# Quiz Bank Manager

Build a single-page React app for managing a bank of quiz questions with topic filtering and usage tracking.

## Seed Data

Start with these questions pre-loaded:

```
[
  { id: 1, question: "What is the Pythagorean theorem?", topic: "Math", difficulty: "Easy", answer: "a² + b² = c²", used: false },
  { id: 2, question: "What is photosynthesis?", topic: "Science", difficulty: "Easy", answer: "Process by which plants convert sunlight to food.", used: true },
  { id: 3, question: "Who wrote Hamlet?", topic: "English", difficulty: "Medium", answer: "William Shakespeare", used: false },
  { id: 4, question: "What year did World War I begin?", topic: "History", difficulty: "Medium", answer: "1914", used: false },
]
```

## Fields

Each question has:
- `id`: unique number
- `question`: question text (string)
- `topic`: one of "Math", "Science", "English", "History"
- `difficulty`: one of "Easy", "Medium", "Hard"
- `answer`: answer text (string)
- `used`: boolean

## UI Components

### Header
- `data-testid="app-title"`: shows "Quiz Bank"

### Add Question Form
- `data-testid="add-form"` wraps the form
- Textarea `data-testid="input-question"` for question text
- Select `data-testid="select-topic"` with options: Math, Science, English, History
- Select `data-testid="select-difficulty"` with options: Easy, Medium, Hard
- Text input `data-testid="input-answer"` for the answer
- Submit button `data-testid="btn-add"` labeled "Add Question"

### Filters
- Select `data-testid="filter-topic"` with options: "All", "Math", "Science", "English", "History"
- Select `data-testid="filter-difficulty"` with options: "All", "Easy", "Medium", "Hard"

### Question List
- `data-testid="question-list"` wraps the list
- Each item: `data-testid="question-item-{id}"`
- Question text: `data-testid="question-text-{id}"`
- Topic: `data-testid="question-topic-{id}"`
- Difficulty: `data-testid="question-difficulty-{id}"`
- Answer (hidden by default, revealed on toggle): `data-testid="question-answer-{id}"`
- Toggle answer button `data-testid="btn-toggle-answer-{id}"`: shows "Show Answer" when hidden, "Hide Answer" when visible
- Mark used button `data-testid="btn-mark-used-{id}"`: shows "Mark Used" when not used, "Used" when used
- Delete button `data-testid="btn-delete-{id}"`

### Stats
- `data-testid="question-count"`: shows "X questions"
- `data-testid="used-count"`: shows "X used"

## Behaviors

1. **Add Question**: fills form and submits. Question added with `used: false`, answer hidden. Form resets. id = max + 1.
2. **Filter by Topic**: shows only matching topic. Combines with difficulty filter.
3. **Filter by Difficulty**: shows only matching difficulty. Combines with topic filter.
4. **Toggle Answer**: clicking "Show Answer" reveals the answer text and changes button to "Hide Answer". Clicking "Hide Answer" hides it again.
5. **Mark Used**: clicking "Mark Used" sets `used: true` and changes button to "Used". Clicking again has no effect.
6. **Delete**: removes the question.
7. **Empty validation**: if question or answer is empty, do nothing on submit.
8. **Stats**: question-count and used-count reflect visible (filtered) questions.
9. **Answer hidden by default**: answer text is not visible until toggled.

## Edge Cases
- Both filters apply simultaneously.
- used-count counts only used questions among currently visible ones.
- Seed question id=2 is already marked used.
