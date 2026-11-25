import { describe, expect, it } from "vitest";
import { imageDimensions } from "@/lib/prepare-letter";
import { imageConfig } from "@/config/analysis";

describe("Bildvorbereitung", () => {
  it("beschränkt die lange Seite auf maximal 2000 Pixel", () => {
    expect(imageDimensions(4000, 3000)).toEqual({ width: 2000, height: 1500 });
    expect(imageDimensions(3000, 4000)).toEqual({ width: 1500, height: 2000 });
  });
  it("verwendet JPEG mit 85 Prozent Qualität", () => { expect(imageConfig.jpegQuality).toBe(0.85); });
});