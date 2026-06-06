import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/events/route";
import { __reset } from "../lib/store";

describe("API /api/events", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all events", async () => {
    const res = await GET(new Request("http://localhost/api/events"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes Summer Festival", async () => {
    const res = await GET(new Request("http://localhost/api/events"));
    const data = await res.json();
    const titles = data.map((e: { title: string }) => e.title);
    expect(titles).toContain("Summer Festival");
  });

  it("POST creates event", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ title: "Art Fair", date: "2024-09-01", category: "Festival", organizer: "Arts Council", capacity: 80 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Art Fair");
  });

  it("POST returns 400 without title", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ capacity: 50 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
