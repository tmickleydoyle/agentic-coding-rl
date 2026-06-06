import { getAccounts, addAccount, removeAccount } from "../../../lib/store";

export function GET() { return Response.json({ accounts: getAccounts() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const acc = addAccount(body);
  return Response.json({ account: acc }, { status: 201 });
}

export function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const result = removeAccount(id);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
