import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH } from "../app/api/requests/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/requests", () => {
  it("returns 3 seed requests", async () => {
    const res = await GET(new Request("http://localhost/api/requests"));
    const data = await res.json();
    expect(data).toHaveLength(3);
  });
});

describe("POST /api/requests", () => {
  it("creates request with 201 and Pending status", async () => {
    const req = new Request("http://localhost/api/requests", {
      method: "POST",
      body: JSON.stringify({ title: "New", submitter: "user@x.com", type: "Other", amount: 100 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.status).toBe("Pending");
  });

  it("returns 400 for empty title", async () => {
    const req = new Request("http://localhost/api/requests", {
      method: "POST",
      body: JSON.stringify({ title: "", submitter: "u@x.com", type: "Other", amount: 100 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/requests", () => {
  it("approves a pending request", async () => {
    const req = new Request("http://localhost/api/requests", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", status: "Approved", comment: "Looks good" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("Approved");
    expect(data.comment).toBe("Looks good");
  });

  it("returns 404 for unknown id", async () => {
    const req = new Request("http://localhost/api/requests", {
      method: "PATCH",
      body: JSON.stringify({ id: "999", status: "Rejected", comment: "" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(404);
  });
});
