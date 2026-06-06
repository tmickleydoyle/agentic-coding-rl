import { getQuizzes, addQuiz, deleteQuiz, getQuestions, addQuestion } from '../../../lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  if (type === 'questions') return Response.json(getQuestions());
  return Response.json(getQuizzes());
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type } = body;
  if (type === 'question') {
    const { quizId, text, options, correctIndex } = body;
    if (!text || !text.trim()) return Response.json({ error: 'Text required' }, { status: 400 });
    if (!Array.isArray(options) || options.length !== 4 || options.some((o: string) => !o.trim())) {
      return Response.json({ error: 'All 4 options required' }, { status: 400 });
    }
    const q = addQuestion({ quizId, text: text.trim(), options, correctIndex: correctIndex ?? 0 });
    return Response.json(q, { status: 201 });
  }
  if (!body.title || !body.title.trim()) return Response.json({ error: 'Title required' }, { status: 400 });
  const quiz = addQuiz({ title: body.title.trim(), description: body.description ?? '' });
  return Response.json(quiz, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const ok = deleteQuiz(id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
