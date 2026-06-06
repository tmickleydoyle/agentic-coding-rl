import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/requests/route";
import { __reset } from "../lib/store";

describe("API /api/requests", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all requests", async () => {
    const res = await GET(new Request("http://localhost/api/requests"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes seed request", async () => {
    const res = await GET(new Request("http://localhost/api/requests"));
    const data = await res.json();
    const titles = data.map((r: { title: string }) => r.title);
    expect(titles).toContain("Need groceries delivered");
  });

  it("POST adds a request", async () => {
    const req = new Request("http://localhost/api/requests", {
      method: "POST",
      body: JSON.stringify({ title: "Help moving boxes", category: "Other", requester: "Hank" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Help moving boxes");
  });

  it("POST 400 without title", async () => {
    const req = new Request("http://localhost/api/requests", {
      method: "POST",
      body: JSON.stringify({ requester: "Hank" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
