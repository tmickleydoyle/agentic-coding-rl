import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/tutors/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Tutors API", () => {
  it("GET returns tutors", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3);
  });

  it("POST creates tutor", async () => {
    const req = new Request("http://localhost/api/tutors", {
      method: "POST",
      body: JSON.stringify({ name: "New Tutor", subjects: ["Art"], hourlyRate: 40, bio: "Artist" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("New Tutor");
  });

  it("POST rejects empty subjects", async () => {
    const req = new Request("http://localhost/api/tutors", {
      method: "POST",
      body: JSON.stringify({ name: "No Subject", subjects: [], hourlyRate: 40 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("POST rejects missing name", async () => {
    const req = new Request("http://localhost/api/tutors", {
      method: "POST",
      body: JSON.stringify({ subjects: ["Math"], hourlyRate: 50 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("POST rejects negative hourlyRate", async () => {
    const req = new Request("http://localhost/api/tutors", {
      method: "POST",
      body: JSON.stringify({ name: "Bad Rate", subjects: ["Math"], hourlyRate: -10 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
