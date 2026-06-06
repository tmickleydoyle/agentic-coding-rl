import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/moods/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/moods", () => {
  it("returns seeded logs", async () => {
    const res = await GET(new Request("http://localhost/api/moods"));
    const data = await res.json();
    expect(Array.isArray(data.logs)).toBe(true);
    expect(data.logs.length).toBe(3);
  });

  it("includes average mood", async () => {
    const res = await GET(new Request("http://localhost/api/moods"));
    const data = await res.json();
    expect(typeof data.average).toBe("number");
  });
});

describe("POST /api/moods", () => {
  it("creates a new mood log", async () => {
    const req = new Request("http://localhost/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-01-20", level: 4, note: "Feeling good", activities: ["walk"] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.log.level).toBe(4);
  });

  it("returns 400 if note missing", async () => {
    const req = new Request("http://localhost/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-01-20", level: 3, activities: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/moods", () => {
  it("deletes existing log", async () => {
    const res = await DELETE(new Request("http://localhost/api/moods?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing log", async () => {
    const res = await DELETE(new Request("http://localhost/api/moods?id=9999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});
