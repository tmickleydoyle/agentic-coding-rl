import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/inventory/route";
import { __reset } from "../lib/store";

describe("API /api/inventory", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all items", async () => {
    const res = await GET(new Request("http://localhost/api/inventory"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes Canned Beans", async () => {
    const res = await GET(new Request("http://localhost/api/inventory"));
    const data = await res.json();
    const names = data.map((i: { name: string }) => i.name);
    expect(names).toContain("Canned Beans");
  });

  it("POST adds an item", async () => {
    const req = new Request("http://localhost/api/inventory", {
      method: "POST",
      body: JSON.stringify({ name: "Pasta", category: "Dry", quantity: 30, unit: "boxes", expiry: "2026-01-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Pasta");
  });

  it("POST 400 without name", async () => {
    const req = new Request("http://localhost/api/inventory", {
      method: "POST",
      body: JSON.stringify({ quantity: 10 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
