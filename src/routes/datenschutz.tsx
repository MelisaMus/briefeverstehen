import { createFileRoute } from "@tanstack/react-router";
import { BriefShell } from "@/components/brief-shell";
import { BackHome } from "@/components/impressum-content";
import { legal } from "@/config/legal";
import { aiConfig } from "@/config/analysis";
import type { ReactNode } from "react";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({ meta: [
    { title: "Datenschutz | Postkompass" },
    { name: "description", content: "Datenschutzerklärung von Postkompass." },
    { property: "og:title", content: "Datenschutz – Postkompass" },
    { property: "og:description", content: "Informationen zum Datenschutz bei Postkompass." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Datenschutz,
});

function ContractReview({ children }: { children: ReactNode }) {
  return import.meta.env.DEV ? <span className="legal-review">{children} <small>Mit Vertrag/Anbieterliste abgleichen</small></span> : <>{children}</>;
}

function Datenschutz() {
  return <BriefShell steps={false}><main className="page-main legal-page">
    <BackHome/>
    <h1>Datenschutzerklärung</h1>
    <section><h2>1. Verantwortliche Stelle</h2>
      <address>{legal.anbieterName}<br/>{legal.strasse}<br/>{legal.plzOrt}<br/>E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a></address></section>
    <section><h2>2. Das Wichtigste in Kürze</h2>
      <p>Postkompass braucht kein Konto und kein Login. Postkompass speichert deine Briefe nicht. Es gibt keine Datenbank-Einträge, keine Datei-Ablage und keine Protokolle mit Briefinhalten. Ergebnisse bleiben nur im geöffneten Browserfenster und sind nach dem Schließen oder Neuladen weg. Auch deine Einwilligung wird nicht gespeichert.</p></section>
    <section><h2>3. Verarbeitung der Briefe mit Künstlicher Intelligenz</h2>
      <p>Behördenbriefe, etwa von der Krankenkasse, zum Aufenthalt oder zu Kindern, können besonders schützenswerte Daten enthalten, zum Beispiel Gesundheitsdaten (Art. 9 DSGVO). Deshalb ist das Schwärzen wichtig: Es wird nur gesendet, was zum Verstehen des Briefes nötig ist.</p>
      <p>Fotos und PDF-Dateien werden zuerst nur auf deinem Gerät geöffnet. Dort kannst du persönliche Daten wie Namen, Anschrift und Aktenzeichen schwärzen. Die Schwärzung wird fest ins Bild geschrieben. Erst nach deiner Prüfung werden nur diese neu erstellten Bilder und der von dir bearbeitete Text gesendet – nie die Originaldatei.</p>
      <p>Die Inhalte gehen an unseren Server und von dort über das KI-Gateway von Lovable an das KI-Modell „{aiConfig.model}“ des Anbieters OpenAI. Sie werden nur zur sofortigen Erstellung der Erklärung und Übersetzung verwendet. Die Speicherung von Anfrageinhalten im KI-Gateway ist abgeschaltet. Es werden nur Modelle genutzt, deren Anbieter Anfragen grundsätzlich nicht speichern und nicht zum Training verwenden. Ausnahme: Inhalte, die der Modellanbieter als missbräuchlich markiert oder aus rechtlichen Gründen sichern muss, können <ContractReview>bis zu 2 Jahre</ContractReview> aufbewahrt werden.</p>
      <p>Rechtsgrundlage ist deine ausdrückliche Einwilligung (Art. 6 Abs. 1 lit. a und Art. 9 Abs. 2 lit. a DSGVO), die du vor dem Senden durch Anhaken erteilst. Hilfst du einer anderen Person, bestätigst du, dass diese Person informiert ist und ausdrücklich eingewilligt hat. Die Einwilligung ist freiwillig. Du kannst sie jederzeit vor dem Senden zurückziehen, indem du abbrichst. Da Postkompass nichts speichert, ist die Verarbeitung mit der Anzeige der Erklärung abgeschlossen. Ergänzend: Art. 6 Abs. 1 lit. f DSGVO für den sicheren Betrieb.</p></section>
    <section><h2>4. Hosting und Dienstleister</h2>
      <p>Die App wird von Lovable (Lovable Labs Incorporated) betrieben. <ContractReview>Lovable ist unser Auftragsverarbeiter nach Art. 28 DSGVO</ContractReview>. Lovable setzt dafür weitere Unterauftragnehmer ein, unter anderem Cloudflare (Cloudflare, Inc.) für die Server-Laufzeit und OpenAI für das KI-Modell. Die aktuelle Liste steht unter <a href="https://trust.lovable.dev/subprocessors" rel="noopener noreferrer">trust.lovable.dev/subprocessors</a>.</p>
      <p>Beim Aufruf werden technisch notwendige Daten verarbeitet, etwa die IP-Adresse, Datum und Uhrzeit sowie die aufgerufene Seite, um die Seite auszuliefern und sicher zu betreiben (Art. 6 Abs. 1 lit. f DSGVO). Die Server-Protokolldaten werden ausschließlich zur Sicherstellung des Betriebs und zur Abwehr von Angriffen verarbeitet und in der Regel nach spätestens <ContractReview>7 bis 30 Tagen</ContractReview> automatisch gelöscht oder anonymisiert, sofern keine sicherheitsrelevanten Vorfälle eine längere Aufbewahrung erfordern.</p>
      <p>Dabei können Daten in Länder außerhalb der EU, insbesondere in die USA, übermittelt werden. Grundlage für die Datenübermittlung in die USA sind <ContractReview>das EU-US Data Privacy Framework (Art. 45 DSGVO) für die zertifizierten Dienstleister Cloudflare und OpenAI</ContractReview> sowie die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO) im Rahmen der Auftragsverarbeitung mit Lovable Labs Inc.</p>
      <p>Unser Hosting-Anbieter setzt ein unbedingt notwendiges Cookie. Es sorgt dafür, dass jede Seite, die du lädst, aus derselben Version der Website stammt. Es enthält keine Informationen über dich und läuft innerhalb von 7 Tagen ab.</p></section>
    <section><h2>5. Besucherstatistik</h2>
      <p>Wir nutzen die Besucherstatistik von Lovable. Sie verwendet keine Cookies, speichert nichts auf deinem Gerät, behält keine IP-Adressen und erkennt dich nicht. Lovable erhebt diese Daten für uns. <a href="https://lovable.dev/privacy" rel="noopener noreferrer">Die Datenschutzerklärung von Lovable</a> erklärt, wie Lovable damit umgeht.</p>
      <p>Erfasst werden: besuchte Seiten, woher Besucher kommen, Land, Browser, Betriebssystem und Gerätetyp, Verweildauer, Ladezeiten, Fehler sowie Klicks auf Schaltflächen und Links. Briefinhalte werden dabei nicht erfasst. Detaillierte Daten werden 90 Tage gespeichert, tägliche Zusammenfassungen ein Jahr.</p>
      <p>Wir erfassen Klicks und andere Aktionen bei allen Besuchern, außer dein Browser sendet ein „Global Privacy Control“-Signal. Grundlegende Besuchsstatistiken zählen wir bei allen Besuchern: besuchte Seiten, Verweildauer, Ladezeit und Fehler. Das geschieht ohne Cookies und erkennt dich nicht.</p>
      <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung und Fehlerbehebung der App).</p></section>
    <section><h2>6. Vorlesefunktion</h2>
      <p>Das Vorlesen nutzt die Sprachausgabe deines Browsers oder Betriebssystems. Postkompass sendet dafür nichts an einen eigenen Dienst. Je nach Gerät kann der Anbieter deines Browsers oder Betriebssystems eine Online-Stimme verwenden.</p></section>
    <section><h2>7. Kontakt per E-Mail</h2>
      <p>Wenn du uns schreibst, verwenden wir deine Angaben nur, um deine Anfrage zu beantworten, und löschen sie spätestens [3 Monate – bitte prüfen] nach Abschluss der Anfrage.</p></section>
    <section><h2>8. Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel beim Landesbeauftragten für den Datenschutz und die Informationsfreiheit Baden-Württemberg.</p>
      <p>Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Einer Verarbeitung auf Grundlage eines berechtigten Interesses kannst du widersprechen (Art. 21 DSGVO).</p></section>
    <section><h2>9. Nutzung durch Beratungsstellen</h2>
      <p>Nutzt eine Beratungsstelle Postkompass für ihre Klient:innen, ist sie für die Einholung und Dokumentation der Einwilligung verantwortlich. Für einen dauerhaften Einsatz schließen wir gern eine Vereinbarung zur Auftragsverarbeitung ab. Bitte sprechen Sie uns an.</p></section>
    <p className="legal-stand">Stand: {legal.stand}</p>
    <BackHome/>
  </main></BriefShell>;
}
