import { describe, expect, it, vi } from "vitest";
import { allReviewed, paintRedactions, redactionBetween, redactPage } from "@/lib/redact-letter";

describe("Lokale Schwärzung", () => {
  it("schwärzt auch rückwärts gezogene Bereiche innerhalb der Seite", () => {
    expect(redactionBetween({ x: 0.8, y: 0.6 }, { x: -0.1, y: 0.2 })).toEqual({ x: 0, y: 0.2, width: 0.8, height: 0.39999999999999997 });
  });
  it("ersetzt die ausgewählten Pixel vollständig durch undurchsichtiges Schwarz", () => {
    const context = { fillRect: vi.fn(), globalAlpha: 0.2, globalCompositeOperation: "multiply", fillStyle: "" };
    paintRedactions(context as unknown as CanvasRenderingContext2D, 1000, 2000, [{ x: 0.1, y: 0.2, width: 0.3, height: 0.1 }]);
    expect(context.globalAlpha).toBe(1);
    expect(context.globalCompositeOperation).toBe("source-over");
    expect(context.fillStyle).toBe("#000000");
    expect(context.fillRect).toHaveBeenCalledWith(97, 397, 306, 207);
  });
  it("erlaubt Senden erst nach Prüfung aller Seiten und des eingefügten Textes", () => {
    expect(allReviewed(2, [0], false, false)).toBe(false);
    expect(allReviewed(2, [0, 1], true, false)).toBe(false);
    expect(allReviewed(2, [0, 1], true, true)).toBe(true);
    expect(allReviewed(0, [], true, true)).toBe(true);
    expect(allReviewed(0, [], false, true)).toBe(false);
  });
  it("liefert nur das neu kodierte Bild statt der Originaldaten", async () => {
    const image = { width: 100, height: 200, close: vi.fn() };
    const context = { drawImage: vi.fn(), fillRect: vi.fn() };
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const encode = vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,REDACTED");
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(image));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ blob: async () => new Blob() }));
    try {
      expect(await redactPage("data:image/jpeg;base64,ORIGINAL", [{ x: 0, y: 0, width: 1, height: 1 }])).toBe("data:image/jpeg;base64,REDACTED");
      expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 200);
      expect(encode).toHaveBeenCalledWith("image/jpeg", 0.85);
      expect(image.close).toHaveBeenCalledOnce();
    } finally { getContext.mockRestore(); encode.mockRestore(); vi.unstubAllGlobals(); }
  });
});