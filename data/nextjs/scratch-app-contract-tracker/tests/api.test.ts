import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/contracts/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/contracts", () => {
  it("returns 3 seed contracts", async () => {
    const res = await GET(new Request("http://localhost/api/contracts"));
    const data = await res.json();
    expect(data).toHaveLength(3);
  });

  it("seed includes active contracts", async () => {
    const res = await GET(new Request("http://localhost/api/contracts"));
    const data = await res.json();
    const active = data.filter((c: { status: string }) => c.status === "Active");
    expect(active).toHaveLength(2);
  });
});

describe("POST /api/contracts", () => {
  it("creates contract with status 201", async () => {
    const req = new Request("http://localhost/api/contracts", {
      method: "POST",
      body: JSON.stringify({ title: "New Contract", party: "ACME", value: 1000, startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 for missing title", async () => {
    const req = new Request("http://localhost/api/contracts", {
      method: "POST",
      body: JSON.stringify({ title: "", party: "ACME", value: 1000, startDate: "", endDate: "", status: "Active" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for zero value", async () => {
    const req = new Request("http://localhost/api/contracts", {
      method: "POST",
      body: JSON.stringify({ title: "T", party: "P", value: 0, startDate: "", endDate: "", status: "Active" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("persists new contract in GET", async () => {
    const req = new Request("http://localhost/api/contracts", {
      method: "POST",
      body: JSON.stringify({ title: "New", party: "P", value: 500, startDate: "", endDate: "", status: "Pending" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/contracts"));
    const data = await res.json();
    expect(data).toHaveLength(4);
  });
});
