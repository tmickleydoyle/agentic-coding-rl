import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getCampaigns, addCampaign, deleteCampaign, getSubscribers, addSubscriber, deactivateSubscriber, getTemplates, addTemplate, deleteTemplate } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Newsletter store", () => {
  it("returns 2 campaigns", () => { expect(getCampaigns().length).toBe(2); });
  it("adds campaign", () => {
    addCampaign({ subject: "Test", templateId: "", status: "draft", scheduledAt: "", sentCount: 0, openCount: 0, clickCount: 0 });
    expect(getCampaigns().length).toBe(3);
  });
  it("rejects campaign without subject", () => {
    const r = addCampaign({ subject: "", templateId: "", status: "draft", scheduledAt: "", sentCount: 0, openCount: 0, clickCount: 0 });
    expect("error" in r).toBe(true);
  });
  it("cannot delete sent campaign", () => {
    const r = deleteCampaign("c1");
    expect(r.error).toBeTruthy();
  });
  it("can delete draft campaign", () => {
    deleteCampaign("c2");
    expect(getCampaigns().length).toBe(1);
  });

  it("returns 3 subscribers", () => { expect(getSubscribers().length).toBe(3); });
  it("adds subscriber", () => {
    addSubscriber({ email: "dave@example.com", name: "Dave", tags: [], active: true });
    expect(getSubscribers().length).toBe(4);
  });
  it("rejects invalid email", () => {
    const r = addSubscriber({ email: "notanemail", name: "X", tags: [], active: true });
    expect("error" in r).toBe(true);
  });
  it("rejects duplicate email", () => {
    const r = addSubscriber({ email: "alice@example.com", name: "Alice2", tags: [], active: true });
    expect("error" in r).toBe(true);
  });
  it("deactivates subscriber", () => {
    deactivateSubscriber("s1");
    const s = getSubscribers().find((x) => x.id === "s1");
    expect(s?.active).toBe(false);
  });

  it("returns 2 templates", () => { expect(getTemplates().length).toBe(2); });
  it("cannot delete template in use by sent campaign", () => {
    const r = deleteTemplate("t2");
    expect(r.error).toBeTruthy();
  });
  it("adds template", () => {
    addTemplate({ name: "New", subject: "Hi", body: "Body" });
    expect(getTemplates().length).toBe(3);
  });
});
