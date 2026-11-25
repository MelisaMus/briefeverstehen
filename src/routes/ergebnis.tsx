import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCheck, Clock3, Copy, Download, FileText, Info, ListChecks, Mail, MapPin, MessageCircle, Printer, Send, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { BriefShell } from "@/components/brief-shell";
import { BriefDateField } from "@/components/brief-date-field";
import { Bilingual, ResultCard } from "@/components/result-card";
import { LanguagePicker } from "@/components/language-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getLanguage } from "@/config/languages";
import { example, german, translations } from "@/config/example";
import { daysUntil, deadlineTone, formatDate, recommendedDate } from "@/lib/deadlines";

export const Route = createFileRoute("/ergebnis")({
  validateSearch: (search: Record<string, unknown>) => ({ sprache: getLanguage(search["sprache"]).code }),
  head: () => ({ meta: [
    { title: "Dein Brief, verständlich erklärt | Brief verstehen" },
    { name: "description", content: "Ein Beispielbrief vom Jobcenter: verständliche Zusammenfassung, Aufgaben, Fristen und Termine in Leichtem Deutsch und deiner Sprache." },
    { property: "og:title", content: "Brief verstehen – Dein Brief, verständlich erklärt" },
    { property: "og:description", content: "Zweisprachige Beispiel-Ergebnisse mit Aufgaben, Unterlagen und Fristen. Keine Rechtsberatung." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Results,
});

function downloadFile(contents: string, type: string, name: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Results() {
  const { sprache: language } = Route.useSearch();
  const navigate = useNavigate();
  const translated = translations[language];
  const [checked, setChecked] = useState<number[]>([]);
  const [briefDate, setBriefDate] = useState(example.date);
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => setRemaining(daysUntil(example.deadline, new Date())), []);
  const tone = remaining === null ? "soon" : deadlineTone(remaining);
  const cardProps = { language };
  const bilingual = (de: string, target: string) => <Bilingual de={de} target={target} language={language}/>;
  const exportText = ["BEISPIEL – Brief verstehen", "Von wem? Jobcenter", `Briefdatum laut Brief: ${formatDate(briefDate)}${briefDate !== example.date ? " (von dir korrigiert)" : ""}`, german.summary, translated.summary,
    "Was musst du tun?", ...german.tasks.flatMap((task, index) => [task, translated.tasks[index] ?? ""]),
    `Spätestens: ${formatDate(example.deadline)}`, `Empfehlung: bis ${formatDate(recommendedDate(example.deadline))} erledigen`, translated.deadline,
    "Was brauchst du?", ...german.documents.flatMap((doc, index) => [doc, translated.documents[index] ?? ""]),
    `Termin: ${formatDate(example.appointment)}, ${example.time} Uhr, ${example.location}`, german.appointment, translated.appointment,
    "Wichtig / Achtung", german.warning, translated.warning,
    "Diese App erklärt Briefe. Sie ersetzt keine Rechtsberatung. Bei Widerspruch, Klage oder Aufenthaltsfragen: Beratungsstelle kontaktieren."].join("\n\n");

  const exportCalendar = () => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const stamp = (date: string) => date.replaceAll("-", "");
    const contents = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Brief verstehen//Beispiel//DE", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:beispiel-frist-20261202@brief-verstehen", `DTSTAMP:${timestamp}`, `DTSTART;VALUE=DATE:${stamp(example.deadline)}`,
      "SUMMARY:BEISPIEL – Unterlagen an das Jobcenter schicken", "DESCRIPTION:Beispieldaten. Keine echte Frist aus deinem Brief.", "END:VEVENT", "BEGIN:VEVENT",
      "UID:beispiel-termin-20261208@brief-verstehen", `DTSTAMP:${timestamp}`, `DTSTART:${stamp(example.appointment)}T100000`,
      "SUMMARY:BEISPIEL – Gespräch beim Jobcenter", `LOCATION:${example.location.replaceAll(",", "\\,")}`,
      "DESCRIPTION:Beispieldaten. Kein echter Termin aus deinem Brief.", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
    downloadFile(contents, "text/calendar;charset=utf-8", "brief-verstehen-beispiel.ics");
    toast.success("Beispiel-Frist und Beispiel-Termin als Kalenderdatei gespeichert.");
  };

  return <BriefShell result>
    <main className="page-main result-main fade-in">
      <div className="result-topbar"><Link to="/"><ArrowLeft size={17}/> Neuer Brief</Link><LanguagePicker value={language} onChange={(code) => { void navigate({ to: "/ergebnis", search: { sprache: code }, replace: true }); }}/></div>
      <div className="page-heading result-heading"><span className="eyebrow"><CheckCheck size={15}/> Gemeinsam Klarheit finden</span><h1>Dein Brief, einfach erklärt.</h1><p>Das ist wichtig. Das sind deine nächsten Schritte.</p></div>
      <div className="example-banner"><Info size={19}/><div><strong>Beispielbrief vom Jobcenter.</strong> Alle Angaben sind Beispieldaten – keine Analyse deines Briefes. Deutsch + {getLanguage(language).label}.</div></div>
      <div className="results-grid">
        <div className="results-column">
          <ResultCard {...cardProps} title="Von wem?" icon={Mail} germanText={`${example.sender}. ${example.category}. ${german.sender} Briefdatum laut Brief: ${formatDate(briefDate)}.`} translatedText={translated.sender}>
            <div className="sender-name">Jobcenter</div>
            {bilingual("Bitte um Unterlagen", translated.sender)}
            <BriefDateField value={briefDate} original={example.date} onChange={setBriefDate}/>
            <div className="sender-meta"><span>Aktenzeichen vorhanden</span></div>
          </ResultCard>
          <ResultCard {...cardProps} title="Worum geht es?" icon={MessageCircle} germanText={german.summary} translatedText={translated.summary}>{bilingual(german.summary, translated.summary)}</ResultCard>
          <ResultCard {...cardProps} title="Was musst du tun?" icon={ListChecks} germanText={german.tasks.join(" ")} translatedText={translated.tasks.join(" ")}>
            <div className="todo-list">{german.tasks.map((task, index) => {
              const done = checked.includes(index);
              const Symbol = index === 2 ? Send : FileText;
              return <div className={`todo ${done ? "done" : ""}`} key={task}><Checkbox id={`task-${index}`} className="todo-checkbox" checked={done} onCheckedChange={(value) => setChecked((previous) => value ? [...previous, index] : previous.filter((item) => item !== index))} aria-label={task}/><label htmlFor={`task-${index}`}><div className="bilingual"><p><Symbol size={17} className="todo-symbol"/>{task}</p><p className="translation" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>{translated.tasks[index]}</p></div><span className="todo-deadline"><Clock3 size={12}/> bis 2. Dezember 2026</span></label></div>;
            })}</div>
          </ResultCard>
          <ResultCard {...cardProps} title="Was brauchst du?" icon={FileText} germanText={german.documents.join(". ")} translatedText={translated.documents.join(". ")}>
            <div className="document-list">{german.documents.map((document, index) => <div className="document-item" key={document}><FileText size={19}/>{bilingual(document, translated.documents[index] ?? "")}</div>)}</div>
          </ResultCard>
        </div>
        <div className="results-column">
          <ResultCard {...cardProps} title="Bis wann?" icon={Clock3} className={`deadline-card ${tone}`} germanText={`${german.deadline} Empfehlung: bis ${formatDate(recommendedDate(example.deadline))} erledigen.`} translatedText={translated.deadline}>
            <div className="deadline-label">Spätestens:</div><div className="deadline-date">{formatDate(example.deadline)}</div>
            <div className="deadline-recommendation">Empfehlung: bis <strong>{formatDate(recommendedDate(example.deadline))}</strong> erledigen.</div>
            {remaining !== null && <p className="deadline-label">{remaining < 0 ? "Frist bereits abgelaufen" : remaining === 0 ? "Die Frist endet heute" : `Noch ${remaining} ${remaining === 1 ? "Tag" : "Tage"}`}</p>}
            {bilingual(german.deadline, translated.deadline)}
            <p className="deadline-quote">Im Beispielbrief steht: „Bitte reichen Sie die Unterlagen bis zum 02.12.2026 ein.“</p>
          </ResultCard>
          <ResultCard {...cardProps} title="Termine" icon={CalendarDays} germanText={`${formatDate(example.appointment)}, ${example.time} Uhr. ${example.location}. ${german.appointment}`} translatedText={`${formatDate(example.appointment)}. ${example.time}. ${example.location}. ${translated.appointment}`}>
            <div className="appointment-meta"><p><CalendarDays size={18}/><strong>{formatDate(example.appointment)}</strong></p><p><Clock3 size={18}/>10:00 Uhr</p><p><MapPin size={18}/>{example.location}</p></div>
            {bilingual(german.appointment, translated.appointment)}
          </ResultCard>
          <ResultCard {...cardProps} title="Wichtig / Achtung" icon={TriangleAlert} germanText={german.warning} translatedText={translated.warning}>{bilingual(german.warning, translated.warning)}</ResultCard>
        </div>
      </div>
      <div className="result-actions"><Button variant="action" size="touch" onClick={exportCalendar}><Download/> Fristen in Kalender (.ics)</Button><Button variant="upload" size="touch" onClick={() => window.print()}><Printer/> Als PDF speichern</Button><Button variant="upload" size="touch" onClick={async () => { try { await navigator.clipboard.writeText(exportText); toast.success("Beispiel-Ergebnis kopiert."); } catch { toast.error("Kopieren ist in diesem Browser nicht verfügbar."); } }}><Copy/> Kopieren</Button></div>
      <div className="legal-notice"><ShieldCheck size={21}/><p><strong>Diese App erklärt Briefe. Sie ersetzt keine Rechtsberatung.</strong><br/>Bei Widerspruch, Klage oder Aufenthaltsfragen: Beratungsstelle kontaktieren.</p></div>
    </main>
  </BriefShell>;
}