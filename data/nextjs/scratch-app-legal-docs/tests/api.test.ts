import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/documents/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/documents", () => {
  it("returns all seed documents", async () => {
    const res = await GET(new Request("http://localhost/api/documents"));
    const data = await res.json();
    expect(data).toHaveLength(3);
  });

  it("returns documents with correct fields", async () => {
    const res = await GET(new Request("http://localhost/api/documents"));
    const data = await res.json();
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("title");
    expect(data[0]).toHaveProperty("category");
    expect(data[0]).toHaveProperty("status");
  });
});

describe("POST /api/documents", () => {
  it("creates a new document and returns 201", async () => {
    const req = new Request("http://localhost/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Contract", category: "Contract", status: "Draft" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const doc = await res.json();
    expect(doc.title).toBe("New Contract");
  });

  it("returns 400 for empty title", async () => {
    const req = new Request("http://localhost/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", category: "Contract", status: "Draft" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("increases total document count after POST", async () => {
    const req = new Request("http://localhost/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Another Doc", category: "NDA", status: "Active" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/documents"));
    const data = await res.json();
    expect(data).toHaveLength(4);
  });
});
