import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/policies/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/policies", () => {
  it("returns 3 seed policies", async () => {
    const res = await GET(new Request("http://localhost/api/policies"));
    const data = await res.json();
    expect(data).toHaveLength(3);
  });
});

describe("POST /api/policies", () => {
  it("creates policy with 201", async () => {
    const req = new Request("http://localhost/api/policies", {
      method: "POST",
      body: JSON.stringify({ title: "New Policy", department: "Finance", version: "1.0", status: "Draft", owner: "", reviewDate: "", summary: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 for empty title", async () => {
    const req = new Request("http://localhost/api/policies", {
      method: "POST",
      body: JSON.stringify({ title: "", department: "IT", version: "1.0", status: "Draft", owner: "", reviewDate: "", summary: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty version", async () => {
    const req = new Request("http://localhost/api/policies", {
      method: "POST",
      body: JSON.stringify({ title: "T", department: "IT", version: "", status: "Draft", owner: "", reviewDate: "", summary: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("persists new policy", async () => {
    const req = new Request("http://localhost/api/policies", {
      method: "POST",
      body: JSON.stringify({ title: "Test", department: "Other", version: "0.1", status: "Draft", owner: "", reviewDate: "", summary: "" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/policies"));
    const data = await res.json();
    expect(data).toHaveLength(4);
  });
});
