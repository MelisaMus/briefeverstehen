import { imageConfig, requestConfig } from "@/config/analysis";

export function imageDimensions(width: number, height: number): { width: number; height: number } {
  const factor = Math.min(1, imageConfig.maxSide / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * factor)), height: Math.max(1, Math.round(height * factor)) };
}

async function imageToJpeg(file: File): Promise<string> {
  const image = await createImageBitmap(file);
  try {
    const dimensions = imageDimensions(image.width, image.height);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width; canvas.height = dimensions.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Das Bild konnte nicht vorbereitet werden.");
    context.fillStyle = "white"; // JPEG transparency flattening, not UI styling.
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", imageConfig.jpegQuality);
  } finally { image.close(); }
}

export async function prepareLetter(files: File[], onProgress: (message: string) => void): Promise<string[]> {
  const pages: string[] = [];
  for (const [index, file] of files.entries()) {
    onProgress(`Datei ${index + 1} von ${files.length} wird vorbereitet …`);
    if (file.type === "application/pdf") {
      const pdfjs = await import("pdfjs-dist");
      const { default: workerUrl } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      try {
        const pdf = await task.promise;
        if (pages.length + pdf.numPages > requestConfig.maxPages) throw new Error(`Bitte höchstens ${requestConfig.maxPages} Seiten pro Brief auswählen.`);
        for (let number = 1; number <= pdf.numPages; number++) {
          onProgress(`PDF-Seite ${number} von ${pdf.numPages} wird vorbereitet …`);
          const page = await pdf.getPage(number);
          const original = page.getViewport({ scale: 1 });
          const scale = imageConfig.maxSide / Math.max(original.width, original.height);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width); canvas.height = Math.floor(viewport.height);
          await page.render({ canvas, viewport }).promise;
          pages.push(canvas.toDataURL("image/jpeg", imageConfig.jpegQuality));
          page.cleanup();
        }
      } catch (error) {
        if (error instanceof Error && error.message.startsWith("Bitte höchstens")) throw error;
        throw new Error("Die PDF konnte nicht geöffnet werden. Bitte eine ungeschützte PDF oder Fotos der Seiten auswählen.");
      } finally { await task.destroy(); }
    } else {
      try { pages.push(await imageToJpeg(file)); } catch { throw new Error("Das Bild konnte nicht geöffnet werden. Bitte ein JPG- oder PNG-Foto auswählen."); }
    }
    if (pages.length > requestConfig.maxPages) throw new Error(`Bitte höchstens ${requestConfig.maxPages} Seiten pro Brief auswählen.`);
    if (pages.reduce((total, page) => total + page.length, 0) > requestConfig.maxEncodedCharacters) throw new Error("Der Brief ist zu groß. Bitte kleinere Dateien auswählen.");
  }
  return pages;
}