import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/neighbors/route";
import { __reset } from "../lib/store";

describe("API /api/neighbors", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all residents", async () => {
    const res = await GET(new Request("http://localhost/api/neighbors"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes Alice Johnson", async () => {
    const res = await GET(new Request("http://localhost/api/neighbors"));
    const data = await res.json();
    const names = data.map((r: { name: string }) => r.name);
    expect(names).toContain("Alice Johnson");
  });

  it("POST adds a resident", async () => {
    const req = new Request("http://localhost/api/neighbors", {
      method: "POST",
      body: JSON.stringify({ name: "Eve Park", address: "20 Oak St" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Eve Park");
  });

  it("POST 400 without name", async () => {
    const req = new Request("http://localhost/api/neighbors", {
      method: "POST",
      body: JSON.stringify({ address: "20 Oak St" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
