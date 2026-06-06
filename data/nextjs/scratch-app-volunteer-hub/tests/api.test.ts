import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/volunteers/route";
import { __reset } from "../lib/store";

describe("API /api/volunteers", () => {
  beforeEach(() => { __reset(); });

  it("GET returns all volunteers", async () => {
    const res = await GET(new Request("http://localhost/api/volunteers"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("GET includes seed volunteer names", async () => {
    const res = await GET(new Request("http://localhost/api/volunteers"));
    const data = await res.json();
    const names = data.map((v: { name: string }) => v.name);
    expect(names).toContain("Alice Chen");
  });

  it("POST adds a volunteer", async () => {
    const req = new Request("http://localhost/api/volunteers", {
      method: "POST",
      body: JSON.stringify({ name: "Dana Lee", skills: ["admin"], status: "Active" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Dana Lee");
  });

  it("POST returns 400 if name missing", async () => {
    const req = new Request("http://localhost/api/volunteers", {
      method: "POST",
      body: JSON.stringify({ skills: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
