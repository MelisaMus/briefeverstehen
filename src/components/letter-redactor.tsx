import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, ShieldCheck, SquareDashed, Undo2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { allReviewed, paintRedactions, redactPage, redactionBetween, type Point, type Redaction } from "@/lib/redact-letter";
import { requestConfig } from "@/config/analysis";

type Props = { pages: string[]; text: string; onCancel: () => void; onSend: (pages: string[], text: string) => Promise<void> };

export function LetterRedactor({ pages, text, onCancel, onSend }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [masks, setMasks] = useState<Record<number, Redaction[]>>({});
  const [reviewed, setReviewed] = useState<number[]>([]);
  const [cleanText, setCleanText] = useState(text);
  const [textReviewed, setTextReviewed] = useState(false);
  const [draft, setDraft] = useState<Redaction | null>(null);
  const [readySource, setReadySource] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [numeric, setNumeric] = useState({ x: 10, y: 10, width: 40, height: 10 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmap = useRef<ImageBitmap | null>(null);
  const start = useRef<Point | null>(null);
  const sending = useRef(false);
  const source = pages[pageIndex];
  const onText = !source;
  const currentMasks = masks[pageIndex];
  const ready = !!source && readySource === source;
  const canSend = allReviewed(pages.length, reviewed, !!text.trim(), textReviewed) && (pages.length > 0 || !!cleanText.trim());

  useEffect(() => {
    if (!source) return;
    let active = true;
    let loaded: ImageBitmap | null = null;
    setReadySource(""); setDraft(null); start.current = null;
    void fetch(source).then((response) => response.blob()).then((blob) => createImageBitmap(blob)).then((image) => {
      loaded = image;
      if (!active) { image.close(); return; }
      bitmap.current = image;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = image.width; canvas.height = image.height;
      setReadySource(source);
    }).catch(() => { if (active) setError("Die Vorschau konnte nicht geöffnet werden. Es wurde nichts gesendet."); });
    return () => { active = false; loaded?.close(); bitmap.current = null; };
  }, [source]);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    const image = bitmap.current;
    if (!context || !image || !ready) return;
    context.drawImage(image, 0, 0);
    paintRedactions(context, image.width, image.height, [...(currentMasks ?? []), ...(draft ? [draft] : [])]);
  }, [ready, currentMasks, draft]);

  function point(event: PointerEvent<HTMLCanvasElement>): Point {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height };
  }
  function updateMasks(next: Redaction[]) {
    setMasks((previous) => ({ ...previous, [pageIndex]: next }));
    setReviewed((previous) => previous.filter((index) => index !== pageIndex));
  }
  function finish(event: PointerEvent<HTMLCanvasElement>) {
    const origin = start.current;
    start.current = null; setDraft(null);
    if (!origin || !ready || busy) return;
    const rectangle = redactionBetween(origin, point(event));
    if (rectangle.width > 0.002 && rectangle.height > 0.002) updateMasks([...(currentMasks ?? []), rectangle]);
  }
  function markReviewed() {
    if (onText) setTextReviewed(true);
    else setReviewed((previous) => [...new Set([...previous, pageIndex])]);
    if (pageIndex < pages.length - 1 || (source && text.trim())) setPageIndex(pageIndex + 1);
  }
  async function send() {
    if (!canSend || sending.current || start.current) return;
    sending.current = true; setBusy(true); setError("");
    try {
      const sanitized: string[] = [];
      for (const [index, page] of pages.entries()) sanitized.push(await redactPage(page, masks[index] ?? []));
      if (sanitized.reduce((sum, page) => sum + page.length, 0) > requestConfig.maxEncodedCharacters) throw new Error("Der Brief ist zu groß. Bitte weniger Seiten auswählen.");
      await onSend(sanitized, cleanText.trim());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Der Brief konnte nicht gesendet werden. Bitte erneut versuchen.");
    } finally { sending.current = false; setBusy(false); }
  }

  return <Dialog open onOpenChange={(open) => { if (!open && !busy) onCancel(); }}>
    <DialogContent className="redactor-dialog" onInteractOutside={(event) => event.preventDefault()} onEscapeKeyDown={(event) => { if (busy) event.preventDefault(); }}>
      <header className="redactor-header">
        <DialogTitle className="flex items-center gap-2 text-xl"><ShieldCheck/> Persönliche Daten schwärzen</DialogTitle>
        <DialogDescription className="mt-2 text-base">Noch nichts gesendet. Keine automatische Erkennung. Bitte alle Seiten prüfen.</DialogDescription>
      </header>
      <div className="redactor-body">
        <div className="redactor-toolbar">
          <Button variant="ghost" size="icon" title="Vorherige Seite" aria-label="Vorherige Seite" disabled={busy || pageIndex === 0} onClick={() => setPageIndex(pageIndex - 1)}><ArrowLeft/></Button>
          <strong aria-live="polite">{onText ? "Eingefügter Text" : `Seite ${pageIndex + 1} von ${pages.length}`}</strong>
          <Button variant="ghost" size="icon" title="Nächste Seite" aria-label="Nächste Seite" disabled={busy || pageIndex >= pages.length - (text.trim() ? 0 : 1)} onClick={() => setPageIndex(pageIndex + 1)}><ArrowRight/></Button>
          {!onText && <>
            <Button variant="ghost" size="icon" title="Letzte Schwärzung zurücknehmen" aria-label="Letzte Schwärzung zurücknehmen" disabled={busy || !currentMasks?.length} onClick={() => updateMasks((currentMasks ?? []).slice(0, -1))}><Undo2/></Button>
            <Button variant="ghost" size="icon" title="Schwärzungen dieser Seite löschen" aria-label="Schwärzungen dieser Seite löschen" disabled={busy || !currentMasks?.length} onClick={() => updateMasks([])}><Trash2/></Button>
          </>}
        </div>
        {onText ? <><p className="redactor-note">Namen, Anschrift und Aktenzeichen aus dem Text löschen. Briefdatum, Fristen und Inhalt lesbar lassen.</p><label htmlFor="clean-letter-text" className="field-label">Text ohne persönliche Daten</label><Textarea id="clean-letter-text" className="min-h-64" disabled={busy} maxLength={requestConfig.maxTextCharacters} value={cleanText} onChange={(event) => { setCleanText(event.target.value); setTextReviewed(false); }}/></> : <>
          <p className="redactor-howto"><SquareDashed size={17}/> Mit dem Finger oder der Maus ein Rechteck über die Stelle ziehen.</p>
          <p className="redactor-note">Namen, Anschrift, Aktenzeichen und Unterschriften abdecken. Briefdatum, Fristen und Inhalt lesbar lassen.</p>
          <p className="redactor-note">Der schwarze Bereich wird vor dem Senden fest ins Bild geschrieben.</p>
          <div className="redactor-page">
            {!ready && <p role="status">Seite wird geöffnet …</p>}
            {ready && !currentMasks?.length && <p className="redactor-hint"><SquareDashed size={15}/> Hier ein Rechteck ziehen</p>}
            <canvas ref={canvasRef} aria-label="Briefseite zum Schwärzen" className="redactor-canvas" onPointerDown={(event) => {
              if (!ready || busy || event.button !== 0 || !event.isPrimary) return;
              event.currentTarget.setPointerCapture(event.pointerId); start.current = point(event);
              setReviewed((previous) => previous.filter((index) => index !== pageIndex));
            }} onPointerMove={(event) => { if (start.current) setDraft(redactionBetween(start.current, point(event))); }} onPointerUp={finish} onPointerCancel={() => { start.current = null; setDraft(null); }}/>
          </div>
          <details className="mt-3"><summary className="cursor-pointer text-primary">Bereich mit Zahlen festlegen</summary>
            <div className="redactor-numbers">{(["x", "y", "width", "height"] as const).map((key) => <label key={key}>{({ x: "Links (%)", y: "Oben (%)", width: "Breite (%)", height: "Höhe (%)" })[key]}<Input type="number" min={0} max={100} disabled={busy} value={numeric[key]} onChange={(event) => setNumeric((previous) => ({ ...previous, [key]: Math.max(0, Math.min(100, Number(event.target.value))) }))}/></label>)}</div>
            <Button className="mt-2" variant="soft" disabled={!ready || busy || numeric.width <= 0 || numeric.height <= 0} onClick={() => updateMasks([...(currentMasks ?? []), redactionBetween({ x: numeric.x / 100, y: numeric.y / 100 }, { x: (numeric.x + numeric.width) / 100, y: (numeric.y + numeric.height) / 100 })])}>Bereich schwärzen</Button>
          </details>
        </>}
        {error && <p role="alert" className="mt-3 text-destructive">{error}</p>}
      </div>
      <footer className="redactor-footer">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" disabled={busy} onClick={onCancel}>Abbrechen</Button>
          <Button variant="soft" disabled={busy || (!onText && !ready)} onClick={markReviewed}><Check/>{onText ? "Text geprüft" : "Seite geprüft"}</Button>
          <span className="text-sm text-muted-foreground" aria-live="polite">{reviewed.length} / {pages.length} Seiten geprüft{text.trim() ? ` · Text ${textReviewed ? "geprüft" : "offen"}` : ""}</span>
        </div>
        {!canSend && !busy && <p className="redactor-review-hint">{onText ? "Bitte erst den Text prüfen – dann kannst du senden." : "Bitte erst jede Seite prüfen – dann kannst du senden."}</p>}
        <Button variant="action" size="touch" className="w-full" disabled={!canSend || busy} onClick={() => { void send(); }}>{busy ? <LoaderCircle className="animate-spin"/> : <ShieldCheck/>}{busy ? "Brief wird verarbeitet …" : "Geprüften Brief senden"}</Button>
      </footer>
    </DialogContent>
  </Dialog>;
}