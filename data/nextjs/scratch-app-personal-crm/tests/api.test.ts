import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/contacts/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/contacts", () => {
  it("returns all contacts", async () => {
    const res = await GET(new Request("http://localhost/api/contacts"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("returned contacts have no notes array embedded", async () => {
    const res = await GET(new Request("http://localhost/api/contacts"));
    const data = await res.json();
    expect(data[0].notes).toBeUndefined();
  });
});

describe("POST /api/contacts", () => {
  it("creates a new contact", async () => {
    const req = new Request("http://localhost/api/contacts", {
      method: "POST",
      body: JSON.stringify({ name: "Eve Test", company: "TestCo", email: "eve@test.com" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Eve Test");
  });

  it("returns 400 when missing fields", async () => {
    const req = new Request("http://localhost/api/contacts", {
      method: "POST",
      body: JSON.stringify({ name: "No Email" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
