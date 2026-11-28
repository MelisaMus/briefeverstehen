import { imageConfig } from "@/config/analysis";

export type Point = { x: number; y: number };
export type Redaction = Point & { width: number; height: number };
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function redactionBetween(start: Point, end: Point): Redaction {
  const left = Math.min(clamp(start.x), clamp(end.x));
  const top = Math.min(clamp(start.y), clamp(end.y));
  return { x: left, y: top, width: Math.max(clamp(start.x), clamp(end.x)) - left, height: Math.max(clamp(start.y), clamp(end.y)) - top };
}

export function paintRedactions(context: CanvasRenderingContext2D, width: number, height: number, rectangles: Redaction[]) {
  // Document pixels, not UI styling: solid opaque black, never a removable overlay.
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#000000";
  for (const rect of rectangles) {
    if (rect.width <= 0 || rect.height <= 0) continue;
    // Include a small safety margin and whole pixels before JPEG encoding.
    const x = Math.max(0, Math.floor(rect.x * width) - 3);
    const y = Math.max(0, Math.floor(rect.y * height) - 3);
    const right = Math.min(width, Math.ceil((rect.x + rect.width) * width) + 3);
    const bottom = Math.min(height, Math.ceil((rect.y + rect.height) * height) + 3);
    context.fillRect(x, y, right - x, bottom - y);
  }
}

export async function redactPage(source: string, rectangles: Redaction[]): Promise<string> {
  const image = await createImageBitmap(await (await fetch(source)).blob());
  try {
    const canvas = document.createElement("canvas");
    canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Die Schwärzung konnte nicht erstellt werden. Es wurde nichts gesendet.");
    context.drawImage(image, 0, 0);
    paintRedactions(context, canvas.width, canvas.height, rectangles);
    // Re-encode every page: no original file, PDF text layer or metadata is forwarded.
    return canvas.toDataURL("image/jpeg", imageConfig.jpegQuality);
  } finally { image.close(); }
}

export function allReviewed(pageCount: number, reviewed: number[], hasText: boolean, textReviewed: boolean): boolean {
  return (pageCount > 0 || hasText) && Array.from({ length: pageCount }, (_, index) => index).every((index) => reviewed.includes(index)) && (!hasText || textReviewed);
}