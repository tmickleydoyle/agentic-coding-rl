import { getSegments, addSegment } from "../../../../lib/store";

export function GET() { return Response.json({ segments: getSegments() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const seg = addSegment(body);
  return Response.json({ segment: seg }, { status: 201 });
}
