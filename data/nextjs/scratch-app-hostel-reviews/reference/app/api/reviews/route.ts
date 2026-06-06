import { getReviews, addReview } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getReviews());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const review = addReview(body);
  return Response.json(review, { status: 201 });
}
