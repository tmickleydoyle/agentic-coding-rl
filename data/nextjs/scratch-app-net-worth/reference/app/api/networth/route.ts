import { getAssets, addAsset, deleteAsset, getLiabilities, addLiability, deleteLiability, getSnapshots, addSnapshot } from "../../../lib/store";
import { Asset, Liability, Snapshot } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  if (type === "liabilities") return Response.json({ data: getLiabilities() });
  if (type === "snapshots") return Response.json({ data: getSnapshots() });
  return Response.json({ data: getAssets() });
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const body = await request.json();
  if (type === "liability") { addLiability(body as Liability); return Response.json({ success: true, data: body }, { status: 201 }); }
  if (type === "snapshot") { addSnapshot(body as Snapshot); return Response.json({ success: true, data: body }, { status: 201 }); }
  addAsset(body as Asset);
  return Response.json({ success: true, data: body }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  if (type === "liability") deleteLiability(id);
  else deleteAsset(id);
  return Response.json({ success: true });
}
