# Quiz Maker

A multi-route quiz creation and taking application.

## Routes
- `/home` — Total quiz count, total question count, start quiz button
- `/quizzes` — List of quizzes; add new quiz; delete quiz
- `/create` — Add questions to a selected quiz: question text, 4 options (A/B/C/D), correct answer selection
- `/results` — Show last quiz attempt score and breakdown

## Data Model

### Quiz
```ts
{ id: string; title: string; description: string }
```

### Question
```ts
{ id: string; quizId: string; text: string; options: [string, string, string, string]; correctIndex: number }
```

### QuizAttempt
```ts
{ quizId: string; answers: number[]; score: number; total: number }
```

## Seed Data
Quizzes: `[{id:"q1",title:"General Knowledge",description:"Test your general knowledge"},{id:"q2",title:"Science Basics",description:"Basic science questions"}]`

Questions:
```
{id:"qu1", quizId:"q1", text:"What is the capital of France?", options:["London","Paris","Berlin","Rome"], correctIndex:1}
{id:"qu2", quizId:"q1", text:"How many continents are there?", options:["5","6","7","8"], correctIndex:2}
{id:"qu3", quizId:"q2", text:"What is H2O?", options:["Gold","Water","Salt","Iron"], correctIndex:1}
```

## Behaviors
- Add quiz: title (required), description (optional)
- Delete quiz: removes quiz and all its questions
- Add question: select quiz, question text (required), 4 option texts (all required), correct answer (radio A/B/C/D)
- Take quiz: from quizzes list, show each question one at a time, user picks answer, at end show score
- Results page: shows last attempt's score (e.g. "2/2"), per-question correct/incorrect

## Edge Cases
- Cannot add quiz with empty title
- Cannot add question if any option is empty or question text is empty
- If no quizzes exist, show empty state
- Score is number of correct answers / total questions

## UI Requirements
- NavBar: `data-testid="nav-home"`, `data-testid="nav-quizzes"`, `data-testid="nav-create"`, `data-testid="nav-results"`
- Quiz rows: `data-testid="quiz-row-{id}"`
- Delete quiz: `data-testid="delete-quiz-{id}"`
- Add quiz form: `data-testid="quiz-title"`, `data-testid="quiz-description"`, `data-testid="add-quiz-btn"`
- Quiz error: `data-testid="quiz-error"`
- Create page quiz select: `data-testid="create-quiz-select"`
- Question form: `data-testid="question-text"`, `data-testid="option-a"`, `data-testid="option-b"`, `data-testid="option-c"`, `data-testid="option-d"`, `data-testid="correct-answer"`, `data-testid="add-question-btn"`
- Question error: `data-testid="question-error"`
- Question rows: `data-testid="question-row-{id}"`
- Home counts: `data-testid="quiz-count"`, `data-testid="question-count"`
- Start quiz button: `data-testid="start-quiz-{quizId}"`
- Quiz answer options: `data-testid="answer-option-{index}"` (0-3)
- Next question: `data-testid="next-question-btn"`
- Submit quiz: `data-testid="submit-quiz-btn"`
- Results: `data-testid="result-score"`, `data-testid="result-row-{questionId}"`
