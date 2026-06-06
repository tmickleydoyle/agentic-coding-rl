import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH } from "../app/api/signoffs/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/signoffs", () => {
  it("returns 3 seed items", async () => {
    const res = await GET(new Request("http://localhost/api/signoffs"));
    const data = await res.json();
    expect(data).toHaveLength(3);
  });
});

describe("POST /api/signoffs", () => {
  it("creates item with 201 and Pending status", async () => {
    const req = new Request("http://localhost/api/signoffs", {
      method: "POST",
      body: JSON.stringify({ title: "New Report", signers: ["Manager", "Director"], dueDate: "2024-06-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.status).toBe("Pending");
  });

  it("returns 400 for empty title", async () => {
    const req = new Request("http://localhost/api/signoffs", {
      method: "POST",
      body: JSON.stringify({ title: "", signers: ["A"], dueDate: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty signers", async () => {
    const req = new Request("http://localhost/api/signoffs", {
      method: "POST",
      body: JSON.stringify({ title: "T", signers: [], dueDate: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/signoffs", () => {
  it("adds signer and updates status", async () => {
    const req = new Request("http://localhost/api/signoffs", {
      method: "PATCH",
      body: JSON.stringify({ id: "3", signer: "CISO" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.signed).toContain("CISO");
    expect(data.status).toBe("In Progress");
  });

  it("signing all signers sets status to Complete", async () => {
    const req1 = new Request("http://localhost/api/signoffs", {
      method: "PATCH",
      body: JSON.stringify({ id: "3", signer: "CISO" }),
    });
    await PATCH(req1);
    const req2 = new Request("http://localhost/api/signoffs", {
      method: "PATCH",
      body: JSON.stringify({ id: "3", signer: "CTO" }),
    });
    const res = await PATCH(req2);
    const data = await res.json();
    expect(data.status).toBe("Complete");
  });

  it("returns 404 for unknown id", async () => {
    const req = new Request("http://localhost/api/signoffs", {
      method: "PATCH",
      body: JSON.stringify({ id: "999", signer: "X" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(404);
  });
});
