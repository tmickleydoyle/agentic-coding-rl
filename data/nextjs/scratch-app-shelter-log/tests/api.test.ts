import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/residents/route";
import { __reset } from "../lib/store";

describe("API /api/residents", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all residents", async () => {
    const res = await GET(new Request("http://localhost/api/residents"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes James Doe", async () => {
    const res = await GET(new Request("http://localhost/api/residents"));
    const data = await res.json();
    const names = data.map((r: { name: string }) => r.name);
    expect(names).toContain("James Doe");
  });

  it("POST adds a resident", async () => {
    const req = new Request("http://localhost/api/residents", {
      method: "POST",
      body: JSON.stringify({ name: "Karen Hill", age: 52 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Karen Hill");
  });

  it("POST 400 without name", async () => {
    const req = new Request("http://localhost/api/residents", {
      method: "POST",
      body: JSON.stringify({ age: 30 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
