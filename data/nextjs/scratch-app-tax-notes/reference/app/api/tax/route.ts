import { getDocuments, addDocument, deleteDocument, getDeductions, addDeduction, deleteDeduction, getTaxNotes, addTaxNote, deleteTaxNote } from "../../../lib/store";
import { TaxDocument, Deduction, TaxNote } from "../../../lib/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  if (type === "deductions") return Response.json({ data: getDeductions() });
  if (type === "notes") return Response.json({ data: getTaxNotes() });
  return Response.json({ data: getDocuments() });
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const body = await request.json();
  if (type === "deduction") { addDeduction(body as Deduction); return Response.json({ success: true, data: body }, { status: 201 }); }
  if (type === "note") { addTaxNote(body as TaxNote); return Response.json({ success: true, data: body }, { status: 201 }); }
  addDocument(body as TaxDocument);
  return Response.json({ success: true, data: body }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  if (type === "deduction") deleteDeduction(id);
  else if (type === "note") deleteTaxNote(id);
  else deleteDocument(id);
  return Response.json({ success: true });
}
