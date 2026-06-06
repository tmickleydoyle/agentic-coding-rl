import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PUT, DELETE } from "../app/api/notes/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("Notes API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/notes"));
    const d = await res.json();
    expect(d.notes).toEqual([]);
  });

  it("POST creates a note", async () => {
    const res = await POST(new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", content: "Content", tags: ["a"], sourceUrl: "http://x.com" }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.note.title).toBe("Test");
    expect(d.note.tags).toEqual(["a"]);
  });

  it("POST rejects missing title", async () => {
    const res = await POST(new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "x" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes a note", async () => {
    await POST(new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Del", content: "", tags: [], sourceUrl: "" }),
    }));
    const res = await DELETE(new Request("http://localhost/api/notes?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
    const g = await GET(new Request("http://localhost/api/notes"));
    const d = await g.json();
    expect(d.notes).toHaveLength(0);
  });

  it("GET with search query filters notes", async () => {
    await POST(new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Climate change", content: "", tags: [], sourceUrl: "" }),
    }));
    await POST(new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Quantum computing", content: "", tags: [], sourceUrl: "" }),
    }));
    const res = await GET(new Request("http://localhost/api/notes?q=climate"));
    const d = await res.json();
    expect(d.notes).toHaveLength(1);
    expect(d.notes[0].title).toBe("Climate change");
  });
});
