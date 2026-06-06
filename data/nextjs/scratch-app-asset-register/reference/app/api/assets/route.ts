import { getSummary } from "../../../lib/store";

export async function GET(_request: Request): Promise<Response> {
  return Response.json(getSummary());
}
