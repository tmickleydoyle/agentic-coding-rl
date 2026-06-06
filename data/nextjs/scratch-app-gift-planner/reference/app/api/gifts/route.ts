import { getRecipients, addRecipient, removeRecipient, getOccasions, addOccasion, removeOccasion, getGifts, addGift, removeGift, updateGiftStatus } from "../../../lib/store";
import { GiftStatus } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  if (resource === "occasions") return Response.json(getOccasions());
  if (resource === "recipients") return Response.json(getRecipients());
  return Response.json(getGifts());
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { resource, ...data } = body;
  if (resource === "occasions") return Response.json(addOccasion(data), { status: 201 });
  if (resource === "recipients") return Response.json(addRecipient(data), { status: 201 });
  if (resource === "giftStatus") {
    const result = updateGiftStatus(data.id, data.status as GiftStatus);
    if (!result) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(result);
  }
  return Response.json(addGift(data), { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const resource = url.searchParams.get("resource");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  let ok: boolean;
  if (resource === "occasions") ok = removeOccasion(id);
  else if (resource === "recipients") ok = removeRecipient(id);
  else ok = removeGift(id);
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ success: true });
}
