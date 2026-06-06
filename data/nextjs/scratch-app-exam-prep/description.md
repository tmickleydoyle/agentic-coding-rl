# scratch-app-exam-prep

An exam preparation app where students manage upcoming exams, take practice quizzes, and track their scores.

## Routes
- **Home** (`home`): Stats — total exams, upcoming count, practice result count.
- **Exams** (`exams`): List exams (title, subject, status, difficulty); add new exam; start/complete status transitions.
- **Practice** (`practice`): Select exam, answer multiple-choice questions, submit for score; show percentage; allow reset.
- **Results** (`results`): View all practice results with score, percentage, date; show average score.

## Seed Data
- Exams: Algebra Final (Math, 2024-04-15, 30q, medium, upcoming), Biology Midterm (Science, 2024-03-20, 25q, hard, upcoming), Grammar Quiz (English, 2024-03-10, 20q, easy, completed)
- Questions: 2 for Algebra Final, 1 for Biology Midterm (with correct answer indices)
- Results: Grammar Quiz — 17/20, 2024-03-10

## Behaviors
- Adding exam requires title, subject, date; totalQuestions >= 1
- Status transitions: upcoming → in-progress → completed
- Practice: select exam, answer radio buttons, submit shows score + percentage; reset clears state
- Average score is arithmetic mean of (score/total)*100 across all results, rounded
- Results page lists all attempts with percentage

## API (app/api/exams/route.ts)
- GET /api/exams — returns all exams
- POST /api/exams — creates exam (title, subject, date, totalQuestions, difficulty?); 400 if missing required or totalQuestions < 1
