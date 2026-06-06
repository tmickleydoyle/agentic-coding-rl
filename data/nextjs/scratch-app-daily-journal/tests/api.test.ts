import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/entries/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/entries", () => {
  it("returns seeded entries", async () => {
    const req = new Request("http://localhost/api/entries");
    const res = await GET(req);
    const data = await res.json();
    expect(Array.isArray(data.entries)).toBe(true);
    expect(data.entries.length).toBe(2);
  });

  it("searches entries by title", async () => {
    const req = new Request("http://localhost/api/entries?search=great");
    const res = await GET(req);
    const data = await res.json();
    expect(data.entries.length).toBeGreaterThan(0);
    expect(data.entries[0].title).toContain("great");
  });

  it("returns empty array for no match", async () => {
    const req = new Request("http://localhost/api/entries?search=zzznomatch");
    const res = await GET(req);
    const data = await res.json();
    expect(data.entries.length).toBe(0);
  });
});

describe("POST /api/entries", () => {
  it("creates a new entry", async () => {
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Entry",
        body: "This is a test.",
        mood: "good",
        tags: ["test"],
        date: "2024-02-01",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.entry.title).toBe("Test Entry");
  });

  it("returns 400 if title missing", async () => {
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "No title", mood: "good", tags: [], date: "2024-02-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/entries", () => {
  it("deletes an existing entry", async () => {
    const req = new Request("http://localhost/api/entries?id=1", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing entry", async () => {
    const req = new Request("http://localhost/api/entries?id=9999", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });
});
