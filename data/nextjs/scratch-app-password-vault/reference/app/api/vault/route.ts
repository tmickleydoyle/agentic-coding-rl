import { getCredentials, addCredential, removeCredential, getWeakCredentials, getSettings, updateSettings, generatePassword } from "../../../lib/store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "weak") return Response.json(getWeakCredentials());
  if (resource === "settings") return Response.json(getSettings());
  return Response.json(getCredentials());
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { resource, ...data } = body;
  if (resource === "generate") {
    const pw = generatePassword(data.length ?? 16, data.useSymbols ?? true);
    return Response.json({ password: pw });
  }
  if (resource === "settings") {
    const s = updateSettings(data);
    return Response.json(s);
  }
  const c = addCredential(data);
  return Response.json(c, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = removeCredential(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
