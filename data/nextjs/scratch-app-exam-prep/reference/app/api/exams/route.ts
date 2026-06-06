import { getExams, addExam } from "../../../lib/store";
import type { Difficulty } from "../../../lib/types";

export function GET(): Response {
  return Response.json(getExams());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, subject, date, totalQuestions, difficulty } = body;
  if (!title || !subject || !date) {
    return Response.json({ error: "title, subject, date required" }, { status: 400 });
  }
  const total = Number(totalQuestions);
  if (isNaN(total) || total < 1) {
    return Response.json({ error: "totalQuestions must be >= 1" }, { status: 400 });
  }
  const exam = addExam({ title, subject, date, totalQuestions: total, difficulty: (difficulty as Difficulty) || "medium", status: "upcoming" });
  return Response.json(exam, { status: 201 });
}
