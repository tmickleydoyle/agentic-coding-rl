import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getEvents, addEvent, getOverview, getFunnels, addFunnel, getFunnelStats, getSegments, addSegment, getSegmentCount } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Analytics store", () => {
  it("returns 10 seed events", () => { expect(getEvents().length).toBe(10); });
  it("filters events by name", () => { expect(getEvents("signup").length).toBe(2); });
  it("adds event", () => {
    addEvent({ name: "click", sessionId: "s99", properties: {}, timestamp: "2030-06-03T10:00" });
    expect(getEvents().length).toBe(11);
  });
  it("rejects event without name", () => {
    const r = addEvent({ name: "", sessionId: "s1", properties: {}, timestamp: "2030-06-01" });
    expect("error" in r).toBe(true);
  });
  it("rejects event without sessionId", () => {
    const r = addEvent({ name: "click", sessionId: "", properties: {}, timestamp: "2030-06-01" });
    expect("error" in r).toBe(true);
  });

  it("overview total is 10", () => { expect(getOverview().total).toBe(10); });
  it("overview unique sessions is 7", () => { expect(getOverview().uniqueSessions).toBe(7); });
  it("overview top3 includes page_view", () => { expect(getOverview().top3[0]).toBe("page_view"); });

  it("returns 1 funnel", () => { expect(getFunnels().length).toBe(1); });
  it("adds funnel", () => {
    addFunnel({ name: "Checkout", steps: ["page_view", "add_to_cart", "purchase"] });
    expect(getFunnels().length).toBe(2);
  });
  it("rejects funnel with < 2 steps", () => {
    const r = addFunnel({ name: "X", steps: ["page_view"] });
    expect("error" in r).toBe(true);
  });
  it("funnel stats for Signup Flow", () => {
    const stats = getFunnelStats("f1");
    if (!("error" in stats)) {
      expect(stats[0].step).toBe("page_view");
      expect(stats[0].count).toBe(7);
      expect(stats[1].step).toBe("signup");
      expect(stats[1].count).toBe(2);
    }
  });

  it("returns 1 segment", () => { expect(getSegments().length).toBe(1); });
  it("segment count for Buyers is 1", () => { expect(getSegmentCount("seg1")).toBe(1); });
  it("adds segment", () => {
    addSegment({ name: "Signers", eventName: "signup", minOccurrences: 1 });
    expect(getSegments().length).toBe(2);
  });
});
