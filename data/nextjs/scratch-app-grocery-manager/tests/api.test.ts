import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/items/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/items", () => {
  it("returns 5 seed items", async () => {
    const res = await GET(new Request("http://localhost/api/items"));
    const data = await res.json();
    expect(data.items.length).toBe(5);
  });
});

describe("POST /api/items", () => {
  it("creates item with status 201", async () => {
    const req = new Request("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ name: "Eggs", quantity: 12, unit: "count", category: "dairy" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Eggs");
    expect(data.checked).toBe(false);
  });

  it("increments total", async () => {
    const req = new Request("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ name: "Butter", quantity: 1, unit: "pack", category: "dairy" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/items"));
    const data = await res.json();
    expect(data.items.length).toBe(6);
  });
});
