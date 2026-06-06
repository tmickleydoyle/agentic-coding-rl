import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE, PUT } from "../app/api/allergies/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/allergies", () => {
  it("returns seeded allergies", async () => {
    const res = await GET(new Request("http://localhost/api/allergies"));
    const data = await res.json();
    expect(data.allergies.length).toBe(3);
  });

  it("returns reactions", async () => {
    const res = await GET(new Request("http://localhost/api/allergies"));
    const data = await res.json();
    expect(data.reactions.length).toBe(1);
  });

  it("returns trigger counts", async () => {
    const res = await GET(new Request("http://localhost/api/allergies"));
    const data = await res.json();
    expect(typeof data.triggers).toBe("object");
  });
});

describe("POST /api/allergies", () => {
  it("creates an allergy", async () => {
    const req = new Request("http://localhost/api/allergies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Shellfish", type: "food", severity: "severe", symptoms: ["hives"], notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.allergy.name).toBe("Shellfish");
  });

  it("returns 400 if name missing", async () => {
    const req = new Request("http://localhost/api/allergies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "food", severity: "mild", symptoms: [], notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/allergies", () => {
  it("deletes an allergy", async () => {
    const res = await DELETE(new Request("http://localhost/api/allergies?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing allergy", async () => {
    const res = await DELETE(new Request("http://localhost/api/allergies?id=9999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/allergies (log reaction)", () => {
  it("logs a reaction", async () => {
    const req = new Request("http://localhost/api/allergies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allergyId: "1", date: "2024-02-01", symptoms: ["hives"], severity: "mild", treatment: "Antihistamine" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(201);
  });

  it("returns 404 for unknown allergyId", async () => {
    const req = new Request("http://localhost/api/allergies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allergyId: "9999", date: "2024-02-01", symptoms: [], severity: "mild", treatment: "" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(404);
  });
});
