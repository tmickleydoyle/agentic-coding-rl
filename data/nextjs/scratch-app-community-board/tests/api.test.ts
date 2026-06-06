import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/posts/route";
import { __reset } from "../lib/store";

describe("API /api/posts", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all posts", async () => {
    const res = await GET(new Request("http://localhost/api/posts"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes seed post title", async () => {
    const res = await GET(new Request("http://localhost/api/posts"));
    const data = await res.json();
    const titles = data.map((p: { title: string }) => p.title);
    expect(titles).toContain("Park cleanup this Saturday");
  });

  it("POST adds a post", async () => {
    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: "New Event", author: "Eve", category: "News", content: "Come join us" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Event");
  });

  it("POST returns 400 if title missing", async () => {
    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      body: JSON.stringify({ author: "Eve" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
