import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/weights/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/weights", () => {
  it("returns seeded entries", async () => {
    const res = await GET(new Request("http://localhost/api/weights"));
    const data = await res.json();
    expect(data.entries.length).toBe(3);
  });

  it("includes stats", async () => {
    const res = await GET(new Request("http://localhost/api/weights"));
    const data = await res.json();
    expect(typeof data.stats.avg).toBe("number");
  });
});

describe("POST /api/weights", () => {
  it("creates entry", async () => {
    const req = new Request("http://localhost/api/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-01", weight: 78.5, unit: "kg", note: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.entry.weight).toBe(78.5);
  });

  it("returns 400 for invalid weight", async () => {
    const req = new Request("http://localhost/api/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-01", weight: 0, unit: "kg", note: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/weights", () => {
  it("deletes an entry", async () => {
    const res = await DELETE(new Request("http://localhost/api/weights?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing entry", async () => {
    const res = await DELETE(new Request("http://localhost/api/weights?id=9999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});
