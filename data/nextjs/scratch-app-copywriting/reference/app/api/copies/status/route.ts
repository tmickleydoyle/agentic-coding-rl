import { updateCopyStatus } from "../../../../lib/store";
import { CopyStatus } from "../../../../lib/types";

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const result = updateCopyStatus(id, status as CopyStatus);
  if (!result) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ copy: result });
}
