import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/pantry/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/pantry", () => {
  it("returns 5 seed items", async () => {
    const res = await GET(new Request("http://localhost/api/pantry"));
    const data = await res.json();
    expect(data.items.length).toBe(5);
  });
});

describe("POST /api/pantry", () => {
  it("creates item", async () => {
    const req = new Request("http://localhost/api/pantry", {
      method: "POST",
      body: JSON.stringify({ name: "Quinoa", quantity: 3, unit: "cups", category: "grain", threshold: 1, expiresAt: "2026-01-01T00:00:00.000Z" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Quinoa");
  });

  it("increments total", async () => {
    const req = new Request("http://localhost/api/pantry", {
      method: "POST",
      body: JSON.stringify({ name: "Flour", quantity: 2, unit: "lbs", category: "grain", threshold: 1, expiresAt: "2026-01-01T00:00:00.000Z" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/pantry"));
    const data = await res.json();
    expect(data.items.length).toBe(6);
  });
});
