import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CalendarDays, Clock3, Copy, Download, FileText, Info, ListChecks, Mail, MapPin, MessageCircle, Printer, Send, ShieldCheck, TriangleAlert, Euro, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { BriefShell } from "@/components/brief-shell";
import { BriefDateField } from "@/components/brief-date-field";
import { Bilingual, ResultCard } from "@/components/result-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLanguage, languages } from "@/config/languages";
import { deadlineLabels } from "@/config/deadline-labels";
import { useLetterSession } from "@/components/letter-session";
import { translateLetter } from "@/lib/analyze-letter.functions";
import { calculateDeadline } from "@/lib/calculate-deadlines";
import { daysUntil, deadlineTone, formatDate } from "@/lib/deadlines";
import type { Letter } from "@/lib/letter-schema";
import { buildExportText, buildCalendar, downloadFile } from "@/lib/letter-exports";
import { UrgentAdviceNotice } from "@/components/urgent-advice-notice";
import { urgentAdvice } from "@/lib/urgent-advice";

export const Route = createFileRoute("/ergebnis")({
  validateSearch: (search: Record<string, unknown>) => ({ sprache: search["sprache"] === "de" ? "de" as const : getLanguage(search["sprache"]).code }),
  head: () => ({ meta: [
    { title: "Dein Brief, verständlich erklärt | Brief verstehen" },
    { name: "description", content: "Dein Behördenbrief in Leichtem Deutsch und deiner Sprache: Zusammenfassung, Aufgaben, Fristen und Termine. Erstellt mit KI, keine Rechtsberatung." },
    { property: "og:title", content: "Brief verstehen – Dein Brief, verständlich erklärt" },
    { property: "og:description", content: "Zweisprachige Erklärung mit Aufgaben, Unterlagen und überprüfbaren Fristen. Wir speichern deine Briefe nicht." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Results,
});

function Results() {
  const { session } = useLetterSession();
  return <BriefShell result>{session ? <LetterResults letter={session.letter} arrivalDate={session.arrivalDate} today={session.today}/> : <main className="page-main"><div className="page-heading"><Mail className="mx-auto mb-5 text-primary" size={42}/><h1>Noch kein Brief vorhanden.</h1><p>Briefe und Ergebnisse werden nicht gespeichert.<br/>Bitte füge deinen Brief erneut hinzu.</p><Button asChild variant="action" size="touch" className="mt-6"><Link to="/">Brief hinzufügen</Link></Button></div></main>}</BriefShell>;
}

function LetterResults({ letter, arrivalDate, today }: { letter: Letter; arrivalDate: string; today: string }) {
  const { sprache } = Route.useSearch();
  const navigate = useNavigate();
  const translate = useServerFn(translateLetter);
  const language = getLanguage(sprache).code;
  const showTranslation = sprache !== "de";
  const [briefDate, setBriefDate] = useState(letter.briefdatum ?? "");
  const [checked, setChecked] = useState<number[]>([]);
  const [target, setTarget] = useState<{ language: string; letter: Letter } | null>(null);
  const [translating, setTranslating] = useState(showTranslation);
  const [translationError, setTranslationError] = useState("");
  const [retry, setRetry] = useState(0);
  const requestRef = useRef<{ key: string; promise: ReturnType<typeof translate> } | null>(null);
  useEffect(() => {
    if (!showTranslation) { setTranslating(false); setTranslationError(""); return; }
    let active = true;
    setTranslating(true); setTranslationError("");
    const key = `${language}:${retry}`;
    // Reuse the in-flight request across effect replay; never bill a duplicate on StrictMode mount.
    if (requestRef.current?.key !== key) requestRef.current = { key, promise: translate({ data: { letter, language } }) };
    const pending = requestRef.current.promise;
    void pending.then((response) => {
      if (!active) return;
      if (response.ok) setTarget({ language, letter: response.letter });
      else setTranslationError(response.message);
    }).catch(() => { if (active) setTranslationError("Die Übersetzung konnte nicht geladen werden. Die deutsche Erklärung bleibt verfügbar."); }).finally(() => { if (active) setTranslating(false); });
    return () => { active = false; };
  }, [language, showTranslation, retry, letter, translate]);
  const translated = showTranslation && target?.language === language ? target.letter : null;
  const deadlines = letter.fristen.map((deadline) => calculateDeadline(deadline, { letterDate: briefDate || null, arrivalDate, delivery: letter.zustellart }));
  const card = { language, translating: showTranslation && translating, showTranslation };
  const bilingual = (de: string, ziel = "") => <Bilingual de={de} target={showTranslation ? ziel : ""} language={language}/>;
  const advice = urgentAdvice(letter, deadlines, today);
  const text = buildExportText(letter, translated, briefDate, deadlines, today);
  const uncertainty = !briefDate || deadlines.some((deadline) => deadline.uncertain);
  const symbols = { dokument: FileText, senden: Send, termin: CalendarDays, euro: Euro, telefon: Phone, pruefen: Search };
  const dateText = briefDate ? formatDate(briefDate) : "nicht erkannt";
  const labels = deadlineLabels[language];

  return <main className="page-main result-main fade-in">
    {advice && <UrgentAdviceNotice german={advice.german} target={translated?.dringend_hinweis_ziel ?? ""} services={advice.services} {...card}/>}
    <div className="result-topbar"><Link to="/"><ArrowLeft size={17}/> Neuer Brief</Link><Select value={sprache} onValueChange={(code) => { void navigate({ to: "/ergebnis", search: { sprache: code === "de" ? "de" : getLanguage(code).code }, replace: true }); }}><SelectTrigger className="language-select" aria-label="Zielsprache"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="de">Nur Leichtes Deutsch</SelectItem>{languages.map((item) => <SelectItem key={item.code} value={item.code}>{item.label} · {item.native}</SelectItem>)}</SelectContent></Select></div>
    <div className="page-heading result-heading"><span className="eyebrow"><Mail size={15}/> Gemeinsam Klarheit finden</span><h1>Dein Brief, einfach erklärt.</h1><p>Das ist wichtig. Das sind deine nächsten Schritte.</p></div>
    <div className="result-date-band"><BriefDateField value={briefDate} original={letter.briefdatum ?? ""} onChange={setBriefDate}/><p className="text-sm text-muted-foreground mt-2">Ankunftsdatum: {formatDate(arrivalDate)}</p></div>
    {letter.lesbarkeit === "schlecht" && <div className="reading-warning" role="status"><Info size={20}/><p>Teile des Briefes waren schwer lesbar. Bitte prüfen.</p></div>}
    {uncertainty && <div className="reading-warning" role="status"><TriangleAlert size={20}/><div><strong>Frist bitte selbst prüfen</strong><p>{!briefDate ? "Das Briefdatum fehlt. Für relative Fristen wird vorläufig das Ankunftsdatum verwendet." : "Zustellart oder Fristbezug sind nicht eindeutig. Bitte im Original prüfen."}</p></div></div>}
    {translationError && <div className="example-banner" role="alert"><Info size={19}/><div>{translationError}<Button variant="link" onClick={() => setRetry((value) => value + 1)}>Übersetzung erneut versuchen</Button></div></div>}
    <div className="results-grid">
      <div className="results-column">
        <ResultCard {...card} title="Von wem?" icon={Mail} germanText={`${letter.absender}. ${letter.briefart}. Briefdatum laut Brief: ${dateText}`} translatedText={`${translated?.absender_ziel ?? ""}. ${translated?.briefart_ziel ?? ""}`}>
          <div className="sender-name">{letter.absender || "Absender nicht erkannt"}</div>
          {bilingual(letter.briefart || "Art des Briefes nicht erkannt", translated?.briefart_ziel)}
          {translated?.absender_ziel && <p className="mt-3 text-base text-muted-foreground" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>{translated.absender_ziel}</p>}
          <div className="sender-meta"><span>{letter.aktenzeichen_vorhanden ? "Aktenzeichen vorhanden" : "Kein Aktenzeichen erkannt"}</span></div>
        </ResultCard>
        <ResultCard {...card} title="Worum geht es?" icon={MessageCircle} germanText={letter.zusammenfassung_de} translatedText={translated?.zusammenfassung_ziel ?? ""}>{bilingual(letter.zusammenfassung_de, translated?.zusammenfassung_ziel)}</ResultCard>
        <ResultCard {...card} title="Was musst du tun?" icon={ListChecks} germanText={letter.todos.map((item) => item.text_de).join(" ")} translatedText={translated?.todos.map((item) => item.text_ziel).join(" ") ?? ""}>
          {letter.todos.length ? <div className="todo-list">{letter.todos.map((todo, index) => {
            const Symbol = symbols[todo.symbol]; const deadline = deadlines.find((item) => item.id === todo.frist_id);
            return <div className={`todo ${checked.includes(index) ? "done" : ""}`} key={index}><Checkbox id={`task-${index}`} className="todo-checkbox" checked={checked.includes(index)} onCheckedChange={(value) => setChecked((previous) => value ? [...previous, index] : previous.filter((item) => item !== index))} aria-label={todo.text_de}/><label htmlFor={`task-${index}`}><div className="bilingual"><p><Symbol size={17} className="todo-symbol"/>{todo.text_de}</p>{translated?.todos[index]?.text_ziel && <p className="translation" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>{translated.todos[index]?.text_ziel}</p>}</div>{deadline && <span className="todo-deadline"><Clock3 size={12}/>{deadline.date ? `bis ${formatDate(deadline.date)}` : "Frist bitte selbst prüfen"}</span>}</label></div>;
          })}</div> : <p className="text-muted-foreground">Keine Aufgaben im Brief erkannt.</p>}
        </ResultCard>
        <ResultCard {...card} title="Was brauchst du?" icon={FileText} germanText={letter.unterlagen.map((item) => item.de).join(". ")} translatedText={translated?.unterlagen.map((item) => item.ziel).join(". ") ?? ""}>
          {letter.unterlagen.length ? <div className="document-list">{letter.unterlagen.map((item, index) => <div className="document-item" key={index}><FileText size={19}/>{bilingual(item.de, translated?.unterlagen[index]?.ziel)}</div>)}</div> : <p className="text-muted-foreground">Keine Unterlagen im Brief genannt.</p>}
        </ResultCard>
      </div>
      <div className="results-column">
        {deadlines.length ? deadlines.map((deadline) => {
          const tone = deadline.uncertain || !deadline.date ? "soon" : deadlineTone(daysUntil(deadline.date, new Date(`${today}T12:00:00`)));
          const targetDeadline = deadline.date ? `${labels.latest}: ${deadline.date}. ${deadline.recommendation ? `${labels.recommendation}: ${deadline.recommendation}.` : ""} ${deadline.uncertain ? labels.check : ""}` : labels.check;
          return <ResultCard {...card} key={deadline.id} title="Bis wann?" icon={Clock3} className={`deadline-card ${tone}`} germanText={deadline.date ? `Spätestens: ${formatDate(deadline.date)}. Empfehlung: bis ${deadline.recommendation ? formatDate(deadline.recommendation) : "nicht bestimmbar"} erledigen.` : "Frist bitte selbst prüfen"} translatedText={targetDeadline}>
            <div className="deadline-label">Spätestens:</div><div className="deadline-date">{deadline.date ? formatDate(deadline.date) : "Nicht sicher bestimmbar"}</div>
            {deadline.recommendation && <div className="deadline-recommendation">Empfehlung: bis <strong>{formatDate(deadline.recommendation)}</strong> erledigen.</div>}
            {deadline.uncertain && <p className="deadline-label">Frist bitte selbst prüfen</p>}
            {deadline.date && <p className="deadline-label">{daysUntil(deadline.date, new Date(`${today}T12:00:00`)) < 0 ? "Frist bereits abgelaufen" : `Noch ${daysUntil(deadline.date, new Date(`${today}T12:00:00`))} Tage`}</p>}
            {showTranslation && <p className="translation mt-3 text-base leading-relaxed" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>{targetDeadline}</p>}
            <details className="deadline-quote"><summary>So steht es im Brief</summary><blockquote className="mt-2">„{deadline.quote}“</blockquote></details>
          </ResultCard>;
        }) : <ResultCard {...card} title="Bis wann?" icon={Clock3} germanText="Keine Frist im Brief erkannt." translatedText=""><p className="text-muted-foreground">Keine Frist im Brief erkannt.</p></ResultCard>}
        <ResultCard {...card} title="Termine" icon={CalendarDays} germanText={letter.termine.map((item) => `${item.datum ? formatDate(item.datum) : "Datum unklar"}. ${item.uhrzeit ?? ""}. ${item.ort}. ${item.zweck_de}`).join(" ")} translatedText={translated?.termine.map((item) => `${item.datum ?? ""} ${item.uhrzeit ?? ""} ${item.ort} ${item.zweck_ziel}`).join(" ") ?? ""}>
          {letter.termine.length ? <div className="document-list">{letter.termine.map((item, index) => <div key={index}><div className="appointment-meta"><p><CalendarDays size={18}/><strong>{item.datum ? formatDate(item.datum) : "Datum nicht erkannt"}</strong></p>{item.uhrzeit && <p><Clock3 size={18}/>{item.uhrzeit} Uhr</p>}{item.ort && <p><MapPin size={18}/>{item.ort}</p>}</div>{bilingual(item.zweck_de, translated?.termine[index]?.zweck_ziel)}</div>)}</div> : <p className="text-muted-foreground">Keine Termine im Brief genannt.</p>}
        </ResultCard>
        <ResultCard {...card} title="Wichtig / Achtung" icon={TriangleAlert} germanText={[...letter.warnungen.map((item) => item.de), ...letter.unsicherheiten].join(" ")} translatedText={[...translated?.warnungen.map((item) => item.ziel) ?? [], ...translated?.unsicherheiten_ziel ?? []].join(" ")}>
          <div className="document-list">{letter.warnungen.map((item, index) => <div key={`warning-${index}`}>{bilingual(item.de, translated?.warnungen[index]?.ziel)}</div>)}{letter.rechtsbehelf_vorhanden && <p>Der Brief enthält Hinweise zu Widerspruch oder Klage. Bitte mit einer Beratungsstelle prüfen.</p>}{letter.unsicherheiten.map((item, index) => <div key={`uncertain-${index}`}>{bilingual(item, translated?.unsicherheiten_ziel[index])}</div>)}{!letter.warnungen.length && !letter.unsicherheiten.length && !letter.rechtsbehelf_vorhanden && <p className="text-muted-foreground">Keine besonderen Hinweise erkannt. Bitte trotzdem den Originalbrief prüfen.</p>}</div>
        </ResultCard>
      </div>
    </div>
    <div className="result-actions"><Button variant="action" size="touch" disabled={!deadlines.some((item) => item.date) && !letter.termine.some((item) => item.datum)} onClick={() => { downloadFile(buildCalendar(letter, deadlines), "text/calendar;charset=utf-8", "brief-verstehen.ics"); toast.success("Kalenderdatei gespeichert. Bitte die Termine im Original prüfen."); }}><Download/> Fristen in Kalender (.ics)</Button><Button variant="upload" size="touch" onClick={() => window.print()}><Printer/> Als PDF speichern</Button><Button variant="upload" size="touch" onClick={async () => { try { await navigator.clipboard.writeText(text); toast.success("Erklärung kopiert."); } catch { toast.error("Kopieren ist in diesem Browser nicht verfügbar."); } }}><Copy/> Kopieren</Button></div>
    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Erstellt mit KI. Fehler sind möglich. Wichtige Fristen bitte immer im Original prüfen.</p>
    <div className="legal-notice"><ShieldCheck size={21}/><p><strong>Diese App erklärt Briefe. Sie ersetzt keine Rechtsberatung.</strong><br/>Bei Widerspruch, Klage oder Aufenthaltsfragen: Beratungsstelle kontaktieren.</p></div>
  </main>;
}
