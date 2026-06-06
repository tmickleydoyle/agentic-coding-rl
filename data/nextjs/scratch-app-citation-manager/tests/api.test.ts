import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PUT, DELETE } from "../app/api/citations/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("Citations API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/citations"));
    const d = await res.json();
    expect(d.citations).toEqual([]);
  });

  it("POST creates citation", async () => {
    const res = await POST(new Request("http://localhost/api/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "AI Study", authors: "Smith, J.", year: "2023", type: "article", url: "", collection: "AI", notes: "" }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.citation.title).toBe("AI Study");
    expect(d.citation.collection).toBe("AI");
  });

  it("POST rejects missing title", async () => {
    const res = await POST(new Request("http://localhost/api/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authors: "Smith" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes citation", async () => {
    await POST(new Request("http://localhost/api/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Del Me", authors: "", year: "", type: "other", url: "", collection: "", notes: "" }),
    }));
    await DELETE(new Request("http://localhost/api/citations?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/citations"));
    const d = await res.json();
    expect(d.citations).toHaveLength(0);
  });

  it("GET with search query filters", async () => {
    await POST(new Request("http://localhost/api/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Machine Learning", authors: "Doe", year: "2022", type: "book", url: "", collection: "", notes: "" }),
    }));
    await POST(new Request("http://localhost/api/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Deep Sea Biology", authors: "Jones", year: "2021", type: "article", url: "", collection: "", notes: "" }),
    }));
    const res = await GET(new Request("http://localhost/api/citations?q=machine"));
    const d = await res.json();
    expect(d.citations).toHaveLength(1);
    expect(d.citations[0].title).toBe("Machine Learning");
  });

  it("GET export apa generates formatted text", async () => {
    await POST(new Request("http://localhost/api/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "My Paper", authors: "Adams, B.", year: "2020", type: "article", url: "", collection: "", notes: "" }),
    }));
    const res = await GET(new Request("http://localhost/api/citations?export=apa"));
    const d = await res.json();
    expect(d.apa).toContain("Adams, B.");
    expect(d.apa).toContain("My Paper");
  });
});
