import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/books/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Books API", () => {
  it("GET returns books list", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("POST adds a book", async () => {
    const req = new Request("http://localhost/api/books", {
      method: "POST",
      body: JSON.stringify({ title: "Test Book", author: "Author", genre: "Fiction", pages: 300 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Test Book");
    expect(data.status).toBe("want-to-read");
  });

  it("PATCH updates book status", async () => {
    const req = new Request("http://localhost/api/books", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", status: "reading" }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.status).toBe("reading");
  });

  it("PATCH returns 404 for unknown id", async () => {
    const req = new Request("http://localhost/api/books", {
      method: "PATCH",
      body: JSON.stringify({ id: "999", status: "read" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(404);
  });

  it("DELETE removes a book", async () => {
    const req = new Request("http://localhost/api/books", {
      method: "DELETE",
      body: JSON.stringify({ id: "1" }),
    });
    const res = await DELETE(req);
    const data = await res.json();
    expect(data.success).toBe(true);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((b: { id: string }) => b.id === "1")).toBeUndefined();
  });
});
