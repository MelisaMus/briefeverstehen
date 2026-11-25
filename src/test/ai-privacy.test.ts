import { describe, expect, it } from "vitest";
import { hasNoContentLogging } from "@/lib/ai-privacy.server";

describe("Datenschutz-Freigabe", () => {
  it("sperrt KI-Anfragen ohne bestätigte Deaktivierung der Inhaltsprotokolle", () => {
    expect(hasNoContentLogging(undefined)).toBe(false);
    expect(hasNoContentLogging("false")).toBe(false);
  });
  it("erlaubt KI-Anfragen nur mit ausdrücklicher bestätigter Freigabe", () => {
    expect(hasNoContentLogging("true")).toBe(true);
  });
});