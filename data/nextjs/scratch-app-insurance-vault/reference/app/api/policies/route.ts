import { getPolicies, addPolicy, removePolicy, getClaims, addClaim, updateClaimStatus, getDocuments, addDocument, getContacts, addContact, removeContact } from "../../../lib/store";
import { ClaimStatus } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "claims") return Response.json(getClaims());
  if (resource === "documents") return Response.json(getDocuments());
  if (resource === "contacts") return Response.json(getContacts());
  return Response.json(getPolicies());
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { resource, ...data } = body;
  if (resource === "claims") return Response.json(addClaim(data), { status: 201 });
  if (resource === "documents") return Response.json(addDocument(data), { status: 201 });
  if (resource === "contacts") return Response.json(addContact(data), { status: 201 });
  if (resource === "claimStatus") {
    const result = updateClaimStatus(data.id, data.status as ClaimStatus);
    if (!result) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(result);
  }
  return Response.json(addPolicy(data), { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const resource = url.searchParams.get("resource");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = resource === "contacts" ? removeContact(id) : removePolicy(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
