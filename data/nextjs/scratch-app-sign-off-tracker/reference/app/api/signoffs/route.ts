import { getItems, addItem, signItem } from "../../../lib/store";

export function GET(_req: Request): Response {
  return Response.json(getItems());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, signers, dueDate } = body as { title: string; signers: string[]; dueDate: string };
  const errs: string[] = [];
  if (!title?.trim()) errs.push("Title is required");
  if (!signers || signers.length === 0) errs.push("At least one signer is required");
  if (errs.length > 0) return Response.json({ errors: errs }, { status: 400 });
  const item = addItem({ title, signers, dueDate: dueDate ?? "" });
  return Response.json(item, { status: 201 });
}

export async function PATCH(req: Request): Promise<Response> {
  const body = await req.json();
  const { id, signer } = body as { id: string; signer: string };
  const updated = signItem(id, signer);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}
