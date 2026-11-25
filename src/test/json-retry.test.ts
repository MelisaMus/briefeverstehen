import { describe, expect, it, vi } from "vitest";
import { requestValidJson } from "@/lib/json-retry";
import { z } from "zod";

describe("JSON-Prüfung", () => {
  it("fragt bei ungültigem JSON genau einmal erneut an", async () => {
    const request = vi.fn().mockResolvedValueOnce("kein JSON").mockResolvedValueOnce('{"ok":true}');
    const result = await requestValidJson(request, (value) => z.object({ ok: z.boolean() }).parse(value));
    expect(result).toEqual({ ok: true });
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("bricht nach zwei ungültigen Antworten ab", async () => {
    const request = vi.fn().mockResolvedValue("{}");
    await expect(requestValidJson(request, (value) => z.object({ ok: z.boolean() }).parse(value))).rejects.toThrow("invalid_letter_json");
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("wiederholt Transportfehler nicht automatisch", async () => {
    const request = vi.fn().mockRejectedValue(new Error("Network failed"));
    await expect(requestValidJson(request, (value) => value)).rejects.toThrow("Network failed");
    expect(request).toHaveBeenCalledTimes(1);
  });
});