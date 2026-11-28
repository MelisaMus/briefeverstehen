import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, ArrowUp, ArrowDown, CalendarDays, Camera, Check, CheckCheck, FileCheck2, FileText, HeartHandshake, Info, Languages, LoaderCircle, LockKeyhole, Mail, MessageCircle, ShieldCheck, Type, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { BriefShell } from "@/components/brief-shell";
import { LetterRedactor } from "@/components/letter-redactor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLanguage, languages, type LanguageCode } from "@/config/languages";
import { localDateInput } from "@/lib/deadlines";
import { analyzeLetter } from "@/lib/analyze-letter.functions";
import { useLetterSession } from "@/components/letter-session";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { requestConfig } from "@/config/analysis";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Brief hinzufügen | Brief verstehen" },
    { name: "description", content: "Behördenbrief fotografieren, hochladen oder als Text einfügen und mit KI in Leichtem Deutsch und deiner Sprache erklären lassen." },
    { property: "og:title", content: "Brief verstehen – Brief hinzufügen" },
    { property: "og:description", content: "Gemeinsam Klarheit finden: Behördenbriefe in Leichtem Deutsch und neun weiteren Sprachen." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function FilePreview({ file }: { file: File }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url ? <img src={url} alt="Vorschau des ausgewählten Briefes"/> : <FileText size={27}/>;
}

function Index() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeLetter);
  const { setSession } = useLetterSession();
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [textOpen, setTextOpen] = useState(false);
  const [text, setText] = useState("");
  const [arrival, setArrival] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("ro");
  const [translate, setTranslate] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [prepared, setPrepared] = useState<{ pages: string[]; text: string } | null>(null);
  useEffect(() => { setArrival(localDateInput(new Date())); setSession(null); }, [setSession]);

  async function submit() {
    if (busy || (!files.length && !text.trim())) return;
    if (!arrival) { setError("Bitte das Ankunftsdatum auswählen."); return; }
    setBusy(true); setError("");
    try {
      const { prepareLetter } = await import("@/lib/prepare-letter");
      const pages = await prepareLetter(files.map((item) => item.file), setProgress);
      setPrepared({ pages, text: text.trim() });
    } catch (failure) {
      setError(failure instanceof Error && /^(Das Bild|Die PDF|Der Brief ist zu groß|Bitte höchstens)/.test(failure.message) ? failure.message : "Die Anfrage konnte nicht abgeschlossen werden. Bitte erneut versuchen.");
    } finally { setBusy(false); setProgress(""); }
  }

  async function sendReviewed(pages: string[], cleanText: string) {
    const today = localDateInput(new Date());
    const response = await analyze({ data: { pages, text: cleanText, arrivalDate: arrival, today } });
    if (!response.ok) throw new Error(response.message);
    setText(""); setFiles([]);
    setSession({ letter: response.letter, arrivalDate: arrival, today });
    await navigate({ to: "/ergebnis", search: { sprache: translate ? language : "de" } });
  }

  function reorder(id: string, direction: -1 | 1) {
    setFiles((previous) => {
      const next = [...previous]; const index = next.findIndex((item) => item.id === id);
      const item = next[index]; const other = next[index + direction];
      if (!item || !other) return previous;
      next[index] = other; next[index + direction] = item; return next;
    });
  }

  function addFiles(list: FileList | File[]) {
    const selected = Array.from(list);
    const accepted = selected.filter((file) => file.type.startsWith("image/") || file.type === "application/pdf");
    if (accepted.length !== selected.length) toast.info("Bitte wähle Bilder oder PDF-Dateien aus.");
    setFiles((previous) => [...previous, ...accepted.map((file) => ({ id: crypto.randomUUID(), file }))]);
  }

  return <BriefShell>
    <main className="page-main fade-in">
      <div className="page-heading">
        <span className="eyebrow"><Mail size={14}/> Ein Brief. Ein nächster Schritt.</span>
        <h1>Was steht in deinem Brief?</h1>
        <p>Verständlich auf Deutsch. Und in deiner Sprache.</p>
      </div>
      <div className="upload-layout">
        <section className="upload-tool" aria-label="Brief hinzufügen">
          <div className="privacy-notice"><ShieldCheck size={21}/><div><strong>Persönliche Daten schützen</strong>Namen, Adressen und Aktenzeichen wenn möglich abdecken. Vor dem Senden kannst du den Brief hier schwärzen.</div></div>
          <div className={`drop-zone ${dragging ? "dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}>
            <div className="document-art" aria-hidden="true"><span className="art-circle"/><span className="art-paper"><Mail/><i/><i/><i/></span><span className="art-check"><Check size={17}/></span></div>
            <h2>Deinen Brief hinzufügen</h2>
            <p>Ein Foto oder eine Datei genügt.</p>
            <div className="upload-buttons">
              <Button disabled={busy} variant="action" size="touch" onClick={() => cameraRef.current?.click()}><Camera/> Brief fotografieren</Button>
              <Button disabled={busy} variant="upload" size="touch" onClick={() => uploadRef.current?.click()}><Upload/> Datei hochladen</Button>
            </div>
            <span className="file-types"><FileText size={13}/> Bilder oder PDF · auch mehrere Seiten</span>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden aria-label="Brief mit Kamera fotografieren" onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }}/>
            <input ref={uploadRef} type="file" accept="image/*,application/pdf" multiple hidden aria-label="Bilder oder PDF auswählen" onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }}/>
            {files.length > 0 && <div className="file-list" aria-live="polite">{files.map(({ id, file }, index) => <div className="file-row" key={id}><FilePreview file={file}/><div className="file-info"><strong>{index + 1}. {file.name}</strong><span>{Math.max(1, Math.round(file.size / 1024))} KB</span></div><div className="flex flex-wrap justify-end"><Button disabled={busy || index === 0} variant="ghost" size="icon" title="Nach oben" aria-label={`${file.name} nach oben`} onClick={() => reorder(id, -1)}><ArrowUp/></Button><Button disabled={busy || index === files.length - 1} variant="ghost" size="icon" title="Nach unten" aria-label={`${file.name} nach unten`} onClick={() => reorder(id, 1)}><ArrowDown/></Button><Button disabled={busy} variant="ghost" size="icon" title="Datei entfernen" aria-label={`${file.name} entfernen`} onClick={() => setFiles((previous) => previous.filter((item) => item.id !== id))}><X/></Button></div></div>)}</div>}
          </div>
          <div className="text-toggle"><Button variant="ghost" onClick={() => setTextOpen(!textOpen)} aria-expanded={textOpen} aria-controls="letter-text"><Type size={15}/>{textOpen ? "Textfeld schließen" : "Lieber Text einfügen"}</Button></div>
          {textOpen && <div className="text-entry" id="letter-text"><label className="field-label" htmlFor="text">Text aus dem Brief</label><Textarea disabled={busy} maxLength={requestConfig.maxTextCharacters} id="text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Den Text des Briefes hier einfügen …"/></div>}
          <div className="form-settings">
            <div><label className="field-label" htmlFor="arrival">Wann kam der Brief an?</label><div className="date-field"><CalendarDays size={19}/><Input id="arrival" type="date" value={arrival} onChange={(event) => setArrival(event.target.value)}/></div><p className="field-hint">Ankunftsdatum, nicht das Datum auf dem Brief.</p></div>
            <div><label className="field-label" htmlFor="language">In welcher Sprache?</label><Select value={translate ? language : "de"} onValueChange={(code) => { setTranslate(code !== "de"); if (code !== "de") setLanguage(getLanguage(code).code); }}><SelectTrigger disabled={busy} id="language" className="language-select" aria-label="Zielsprache"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="de">Nur Leichtes Deutsch</SelectItem>{languages.map((item) => <SelectItem key={item.code} value={item.code}>{item.label} · {item.native}</SelectItem>)}</SelectContent></Select><p className="field-hint">Leichtes Deutsch ist immer dabei.</p></div>
          </div>
          <Button disabled={busy || (!files.length && !text.trim())} variant="action" size="touch" className="preview-button" onClick={() => { void submit(); }}>{busy ? <LoaderCircle className="animate-spin"/> : <ShieldCheck/>}{busy ? "Brief wird vorbereitet …" : "Brief prüfen und schwärzen"}</Button>
          {busy && <p className="mt-3 text-sm text-primary" role="status">{progress}</p>}
          {error && <p role="alert" className="mt-3 text-sm leading-relaxed text-destructive">{error}</p>}
          <p className="demo-notice"><Info size={14}/><span>Der Brief wird zur KI-Verarbeitung gesendet. Wir speichern deine Briefe nicht.</span></p>
        </section>
        <aside className="upload-aside">
          <h2>Einfach. Schritt für Schritt.</h2>
          <div className="explanation-step"><span className="aside-icon"><Camera size={20}/></span><div><strong>1. Brief hinzufügen</strong><p>Fotografieren, hochladen<br/>oder Text einfügen.</p></div></div>
          <div className="explanation-step"><span className="aside-icon"><Languages size={20}/></span><div><strong>2. Sprache wählen</strong><p>Leichtes Deutsch und eine<br/>Sprache, die du verstehst.</p></div></div>
          <div className="explanation-step"><span className="aside-icon"><CheckCheck size={20}/></span><div><strong>3. Klarheit bekommen</strong><p>Was ist wichtig? Was ist zu tun?<br/>Und bis wann?</p></div></div>
          <div className="aside-divider"/>
          <div className="aside-bottom"><HeartHandshake size={27} strokeWidth={1.5}/><div><strong>Für den nächsten Schritt.</strong><p>Gemeinsam mit Dolmetscher:innen<br/>und Sozialarbeiter:innen.</p></div><div className="letter-categories"><span><Mail size={12}/> Jobcenter</span><span><Mail size={12}/> Schule</span><span><Mail size={12}/> Behörden</span></div></div>
        </aside>
      </div>
      <div className="trust-line"><span><LockKeyhole size={14}/> Wir speichern deine Briefe nicht</span><span><FileCheck2 size={14}/> Kein Konto nötig</span><span><MessageCircle size={14}/> 9 Zielsprachen</span></div>
    </main>
    {prepared && <LetterRedactor pages={prepared.pages} text={prepared.text} onCancel={() => setPrepared(null)} onSend={sendReviewed}/>}
  </BriefShell>;
}
