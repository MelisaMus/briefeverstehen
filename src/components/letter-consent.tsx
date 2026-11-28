import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Printer, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Bilingual, ResultCard } from "./result-card";
import { consentGerman, consentTranslations, consentPrintLabels, helperConsent, ownConsent } from "@/config/consent";
import type { LanguageCode } from "@/config/languages";

export type ConsentOwner = "own" | "helper" | "";
export function LetterConsent({ owner, accepted, disabled, language, onOwnerChange, onAcceptedChange }: {
  owner: ConsentOwner; accepted: boolean; disabled: boolean; language: LanguageCode | "de";
  onOwnerChange: (owner: ConsentOwner) => void; onAcceptedChange: (accepted: boolean) => void;
}) {
  const firstRadio = useRef<HTMLInputElement>(null);
  useEffect(() => { firstRadio.current?.focus(); }, []);
  const targetLanguage = language === "de" ? "en" : language;
  const target = language === "de" ? "" : consentTranslations[targetLanguage];
  const labels = consentPrintLabels[targetLanguage];
  return <section className="letter-consent" aria-label="Einwilligung vor dem Senden">
    <fieldset disabled={disabled}>
      <legend className="text-xl font-semibold">Wessen Brief ist das?</legend>
      <label className="consent-choice"><input ref={firstRadio} type="radio" name="letter-owner" value="own" checked={owner === "own"} onChange={() => onOwnerChange("own")}/><span>Mein eigener Brief</span></label>
      <label className="consent-choice"><input type="radio" name="letter-owner" value="helper" checked={owner === "helper"} onChange={() => onOwnerChange("helper")}/><span>Ich helfe einer anderen Person (z.B. als Fachkraft, Dolmetscherin, Angehörige)</span></label>
    </fieldset>
    {owner === "helper" && <>
      <ResultCard title="Einwilligung" icon={ShieldCheck} language={targetLanguage} germanText={consentGerman} translatedText={target} showTranslation={language !== "de"}>
        <Bilingual de={consentGerman} target={target} language={targetLanguage}/>
      </ResultCard>
      <Button className="mt-3" variant="outline" disabled={disabled} onClick={() => window.print()}><Printer/>Einwilligungstext drucken</Button>
      {createPortal(<section className="consent-print" aria-label="Einwilligung zum Ausdrucken">
        <h1>Postkompass – Einwilligung{target ? ` / ${labels.title}` : ""}</h1>
        <Bilingual de={consentGerman} target={target} language={targetLanguage}/>
        <p className="consent-signature">Datum{target ? ` / ${labels.date}` : ""}: __________________________________</p>
        <p className="consent-signature">Unterschrift{target ? ` / ${labels.signature}` : ""}: ______________________________</p>
      </section>, document.body)}
    </>}
    {owner && <>
      <label className="consent-choice consent-confirmation"><input type="checkbox" disabled={disabled} checked={accepted} onChange={(event) => onAcceptedChange(event.target.checked)}/><span>{owner === "own" ? ownConsent : helperConsent}</span></label>
      <a className="consent-privacy" href="/datenschutz" target="_blank" rel="noopener noreferrer">Mehr in der Datenschutzerklärung (neues Fenster).</a>
      {owner === "helper" && <p className="mt-2 text-sm text-muted-foreground">Beratungsstellen dokumentieren die Einwilligung bitte nach ihren eigenen Regeln.</p>}
    </>}
    <p className="mt-3 text-sm text-muted-foreground">Die Auswahl gilt nur für diesen Brief und wird nicht gespeichert.</p>
  </section>;
}