import { getTutors, addTutor } from "../../../lib/store";
import type { Subject } from "../../../lib/types";

export function GET(): Response {
  return Response.json(getTutors());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, subjects, hourlyRate, bio } = body;
  if (!name || !subjects || !hourlyRate) {
    return Response.json({ error: "name, subjects, hourlyRate required" }, { status: 400 });
  }
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return Response.json({ error: "subjects must be non-empty array" }, { status: 400 });
  }
  const rate = Number(hourlyRate);
  if (isNaN(rate) || rate <= 0) {
    return Response.json({ error: "hourlyRate must be positive" }, { status: 400 });
  }
  const tutor = addTutor({ name, subjects: subjects as Subject[], hourlyRate: rate, rating: 0, bio: bio || "", available: true });
  return Response.json(tutor, { status: 201 });
}
