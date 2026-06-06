import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/campaigns/route";
import { __reset } from "../lib/store";

describe("API /api/campaigns", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all campaigns", async () => {
    const res = await GET(new Request("http://localhost/api/campaigns"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes Winter Shelter Fund", async () => {
    const res = await GET(new Request("http://localhost/api/campaigns"));
    const data = await res.json();
    const names = data.map((c: { name: string }) => c.name);
    expect(names).toContain("Winter Shelter Fund");
  });

  it("POST creates campaign", async () => {
    const req = new Request("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify({ name: "Holiday Toy Drive", goal: 500, endDate: "2024-12-24" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Holiday Toy Drive");
  });

  it("POST 400 without name", async () => {
    const req = new Request("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify({ goal: 500 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
