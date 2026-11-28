import { Link } from "@tanstack/react-router";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { placeholderFields, visiblePhone, type LegalConfig } from "@/config/legal";
import { internationalPhone } from "@/lib/urgent-advice";

export function BackHome() {
  return <Link to="/" className="legal-back"><ArrowLeft size={18}/> Zurück zur Startseite</Link>;
}

export function ImpressumContent({ config, dev = false }: { config: LegalConfig; dev?: boolean }) {
  const missing = placeholderFields(config);
  const phone = visiblePhone(config.telefon);
  return <main className="page-main legal-page">
    <BackHome/>
    {dev && missing.length > 0 && <div role="alert" className="legal-warning"><TriangleAlert size={20}/><span>Entwicklungshinweis: Im Impressum fehlen noch Angaben ({missing.join(", ")}). Bitte in src/config/legal.ts ergänzen.</span></div>}
    <h1>Impressum</h1>
    <section><h2>Angaben gemäß § 5 DDG</h2>
      <address>{config.anbieterName}<br/>{config.strasse}<br/>{config.plzOrt}</address></section>
    <section><h2>Kontakt</h2>
      <p>E-Mail: <a href={`mailto:${config.email}`}>{config.email}</a></p>
      {phone && <p>Telefon: <a href={`tel:${internationalPhone(phone) || phone.replace(/[^\d+]/g, "")}`}>{phone}</a></p>}</section>
    <section><h2>Hinweis zur Nutzung</h2>
      <p>Postkompass ist ein nicht-kommerzielles Projekt. Die App erklärt Behördenbriefe mit Hilfe von Künstlicher Intelligenz. Die Erklärungen können Fehler enthalten und ersetzen keine Rechtsberatung. Wichtige Fristen bitte immer im Original prüfen. Bei Widerspruch, Klage oder Aufenthaltsfragen wenden Sie sich an eine Beratungsstelle.</p></section>
    <section><h2>Externe Links</h2>
      <p>Die App enthält Links zu Websites von Beratungsstellen. Für deren Inhalte sind die jeweiligen Anbieter verantwortlich.</p></section>
    <section><h2>Quellcode</h2>
      <p>Der Quellcode ist unter der MIT-Lizenz veröffentlicht: <a href="https://github.com/MelisaMus/briefeverstehen" rel="noopener noreferrer">https://github.com/MelisaMus/briefeverstehen</a></p></section>
    <p className="legal-stand">Stand: {config.stand}</p>
    <BackHome/>
  </main>;
}
