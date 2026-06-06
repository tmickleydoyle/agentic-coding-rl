import { getOverview } from "../../../../lib/store";

export function GET() {
  return Response.json(getOverview());
}
