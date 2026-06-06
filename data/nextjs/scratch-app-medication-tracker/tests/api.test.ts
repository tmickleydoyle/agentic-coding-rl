import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/medications/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/medications", () => {
  it("returns seeded medications", async () => {
    const res = await GET(new Request("http://localhost/api/medications"));
    const data = await res.json();
    expect(data.medications.length).toBe(2);
  });

  it("returns dose logs", async () => {
    const res = await GET(new Request("http://localhost/api/medications"));
    const data = await res.json();
    expect(Array.isArray(data.logs)).toBe(true);
  });
});

describe("POST /api/medications", () => {
  it("creates a medication", async () => {
    const req = new Request("http://localhost/api/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Aspirin", dosage: "81mg", frequency: "daily", instructions: "With water" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.medication.name).toBe("Aspirin");
  });

  it("returns 400 if name missing", async () => {
    const req = new Request("http://localhost/api/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dosage: "10mg", frequency: "daily", instructions: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/medications", () => {
  it("toggles medication active state", async () => {
    const res = await PATCH(new Request("http://localhost/api/medications?id=1", { method: "PATCH" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.medication.active).toBe(false);
  });
});

describe("DELETE /api/medications", () => {
  it("deletes a medication", async () => {
    const res = await DELETE(new Request("http://localhost/api/medications?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing medication", async () => {
    const res = await DELETE(new Request("http://localhost/api/medications?id=9999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});
