# Brief verstehen

**Behördenbriefe in Leichtem Deutsch und in der Sprache der Familie – mit Fristen und To-dos auf einen Blick.**

🔗 Web-App: [briefeverstehen.lovable.app](https://briefeverstehen.lovable.app)

> *English summary below.*

---

## Worum geht es?

Viele Familien, die wenig Deutsch sprechen, bekommen Briefe von Jobcenter, Ausländerbehörde, Schule oder Krankenkasse – und verstehen nicht, was darin steht, was sie tun müssen und bis wann. Oft verstreichen Fristen, obwohl Hilfe möglich gewesen wäre.

**Brief verstehen** ist aus der Praxis einer Dolmetscherin entstanden, die regelmäßig für Roma-Familien übersetzt. Die mobile-first Web-App unterstützt Fachkräfte – Sozialarbeit, Rechts- und Migrationsberatung, Dolmetschen, Familienhilfe – dabei, Behördenbriefe gemeinsam mit Familien zu verstehen. Große Schrift, klare Symbole und zweisprachige Ergebniskarten unterstützen die gemeinsame Besprechung. Die Nutzung erfordert keinen Login.

## Funktionen

- Brief fotografieren, Bilder oder PDF hochladen oder Brieftext einfügen; mehrere Seiten in der richtigen Reihenfolge verarbeiten.
- Ankunftsdatum und Zielsprache auswählen; alternativ nur Leichtes Deutsch anzeigen.
- Zuerst die deutsche Erklärung erhalten, anschließend die Übersetzung in einer getrennten KI-Anfrage.
- Absender, Briefart, Zusammenfassung, Aufgaben, Unterlagen, Fristen, Termine, Warnungen und Unsicherheiten anzeigen.
- „Briefdatum laut Brief“ prüfen und korrigieren. Relative Fristen werden neu berechnet; feste Datumsangaben bleiben unverändert.
- Aufgaben abhaken, Texte vorlesen lassen, Ergebnisse kopieren, als PDF über den Druckdialog sichern und Termine als Kalenderdatei (`.ics`) exportieren.
- Bei dringenden Themen (Aufenthalt, Gericht, Haft, Wohnung, Kindeswohl) oder Rechtsbehelfsfristen von weniger als 14 Tagen einen nicht wegklickbaren, zweisprachigen Hinweis anzeigen – mit passenden Beratungsstellen, Telefon-, E-Mail- und Kartenlinks. Der Hinweis erscheint auch im Kopiertext und PDF-Druck.

### Unterstützte Sprachen

Leichtes Deutsch sowie Rumänisch, Bulgarisch, Serbisch, Mazedonisch, Albanisch, Türkisch, Arabisch, Ukrainisch und Englisch. Für Arabisch wird die Schreibrichtung angepasst. Die verfügbaren Vorlesestimmen hängen vom Browser und Gerät ab. Die Sprachliste ist in `src/config/languages.ts` konfigurierbar.

## Grundsätze

- **Die KI erklärt, der Code rechnet.** Das Sprachmodell liest den Brief und beschreibt Fristen. Die Fristdaten selbst werden im Code berechnet – nicht von der KI geschätzt.
- **Erst Deutsch, dann Übersetzung.** Die Übersetzung darf nur die vorgesehenen Übersetzungsfelder ändern; deutsche Texte und strukturierte Fakten (Daten, Beträge, Aktenzeichen) werden auf Unverändertheit geprüft.
- **Nachprüfbar.** Jede Frist zeigt das wörtliche Zitat aus dem Brief. Unsicherheiten werden angezeigt statt verschwiegen.
- **Datensparsam.** Keine Speicherung von Briefen, kein Konto, keine Protokolle mit Briefinhalten.

## Datenschutz

**Wir speichern deine Briefe nicht.** Die App legt Briefe und Ergebnisse weder in einer Datenbank noch in Dateispeichern oder Browser-Persistenz ab. Ergebnisse bleiben ausschließlich im React-Sitzungszustand; beim Neuladen der Ergebnisseite erscheint ein leerer Zustand statt Beispieldaten.

Für die Analyse werden Brieftext und lokal vorbereitete Bilder vorübergehend an serverseitige Funktionen und den KI-Dienst übermittelt. Bilder werden vor dem Versand lokal verkleinert; PDFs werden im Browser seitenweise als Bilder aufbereitet. Die App protokolliert keine Briefinhalte und setzt für die KI-Antworten `Cache-Control: no-store`.

Vor dem Hochladen gilt: **Namen, Adressen und Aktenzeichen wenn möglich abdecken.** Ein eingebauter Schwärzen-Modus und ein Bild-Export sind derzeit nicht vorhanden. Kopierte, gedruckte oder heruntergeladene Ergebnisse liegen anschließend in der Verantwortung der nutzenden Person.

### Datenschutzfreigabe der KI

Beide KI-Funktionen bleiben gesperrt, solange die serverseitige Einstellung `AI_CONTENT_LOGGING_DISABLED_VERIFIED` nicht exakt `true` ist. Diese Freigabe darf erst gesetzt werden, wenn die Erfassung von KI-Anfrage- und Antwortinhalten am Gateway deaktiviert und mit erfundenen Testbriefen geprüft wurde. Eine Zusage zur fehlenden Speicherung beim Modellanbieter allein genügt nicht.

Bei einer neuen Einrichtung muss diese Prüfung erneut erfolgen. Private Schlüssel und Freigaben werden über **Project Settings → Secrets** verwaltet und gehören niemals in das Repository oder den Browsercode.

## ⚠️ Was die App nicht ist

**Erstellt mit KI. Fehler sind möglich. Wichtige Fristen bitte immer im Original prüfen.**

- **Keine Rechtsberatung.** Die App erklärt, was im Brief steht. Sie bewertet nicht, ob eine Behörde recht hat. Bei Widerspruch, Klage oder Aufenthaltsfragen ist eine Beratungsstelle zu kontaktieren.
- **Kein Ersatz** für Dolmetschen oder die fachliche Einschätzung einer Beratungsstelle. Die Erklärung sollte durch eine Fachkraft geprüft werden.

### Fristberechnung

Die Fristberechnung orientiert sich am im Brief genannten Bezug. Für die Bekanntgabe bei Postversand sind standardmäßig 4 Tage nach dem Briefdatum konfiguriert (`src/config/analysis.ts`). Relative Monats- und Jahresfristen berücksichtigen Monatsenden; relative Fristenden an Samstagen, Sonntagen und bundesweiten Feiertagen werden auf den nächsten Werktag verschoben. Fehlende oder unklare Angaben werden als unsicher gekennzeichnet. Regionale Feiertage und rechtliche Sonderfälle erfordern eine eigene Prüfung.

## Für die eigene Stadt einrichten

Die Beratungsstellen für den Dringend-Hinweis stehen in `src/config/beratungsstellen.json`. Das Projekt enthält derzeit 10 Einträge aus **Freiburg im Breisgau**. Für eine andere Stadt die Datei mit eigenen Stellen füllen:

```json
{
  "name": "Name der Beratungsstelle",
  "thema": ["abschiebung", "ausreise"],
  "adresse": "Straße Nr., PLZ Ort",
  "telefon": "0761 123456",
  "email": "kontakt@beispiel.de",
  "oeffnungszeiten": "Mo–Do 9–16 Uhr",
  "link": "https://www.beispiel.de",
  "hinweis": "Kostenlos und vertraulich."
}
```

- Pflichtfelder: `name`, `thema`, `adresse`, `telefon`, `oeffnungszeiten`, `link`; optional: `email`, `hinweis`.
- Mögliche Themen: `abschiebung`, `ausreise`, `haft`, `gericht`, `inobhutnahme`, `raeumung`, `sonstiges`.
- Deutsche Telefonnummern werden für anklickbare `tel:`-Links automatisch ins internationale Format (`+49 …`) umgewandelt. E-Mail-Adressen erscheinen als `mailto:`-Links, Hinweise als kleiner grauer Text.

Bitte nur geprüfte Kontaktdaten eintragen und regelmäßig aktualisieren – eine falsche Telefonnummer ist im Ernstfall schlimmer als keine.

## Technik

- **Oberfläche:** React 19, TypeScript, Tailwind CSS 4 und gemeinsame UI-Komponenten
- **Framework:** TanStack Start mit dateibasiertem TanStack Router und Vite
- **Server:** TanStack-Serverfunktionen auf der von Lovable bereitgestellten Cloudflare-Worker-Laufzeit
- **KI:** Lovable AI Gateway; Modell und Provider werden zentral konfiguriert
- **Prüfung:** Zod für strukturierte KI-Ausgaben, Vitest und Testing Library für Tests
- **Dokumente und Fristen:** PDF.js, date-fns und date-holidays

Analyse und Übersetzung verwenden dasselbe validierte Briefschema. Ungültige JSON-Ausgaben werden einmal erneut angefordert. Fristberechnung, Dringend-Hinweis und Exporte verwenden denselben aktuellen Sitzungszustand.

Gebaut mit [Lovable](https://lovable.dev). Änderungen im Repository veröffentlichen die App nicht automatisch; die Veröffentlichung erfolgt separat über Lovable.

## Lokal entwickeln

Voraussetzungen: eine aktuelle Node.js-LTS-Version, Bun und Zugriff auf die benötigte Lovable-Konfiguration für echte KI-Anfragen. Ein frisch geklontes Repository enthält keine privaten Zugangsschlüssel.

```sh
bun install --frozen-lockfile
bun run dev
```

Die lokale Adresse wird beim Start im Terminal ausgegeben. Ohne die erforderlichen serverseitigen Schlüssel und die geprüfte Datenschutzfreigabe ist keine echte KI-Analyse möglich.

**Wichtig:** Niemals API-Schlüssel oder echte Briefe in dieses Repository einchecken – auch nicht geschwärzt. Zum Testen ausschließlich erfundene Briefe ohne personenbezogene Daten verwenden.

Weitere Befehle:

```sh
bun run test         # Alle Tests einmal ausführen
bun run test:watch   # Tests während der Entwicklung beobachten
bun run lint         # Code prüfen
bun run build        # Produktionsversion erstellen
bun run preview      # Erstellte Version lokal ansehen
```

Ein lokaler Entwicklungsserver verwendet nicht exakt dieselbe Laufzeit wie die veröffentlichte App. Serverseitiger Code muss daher auch mit der Worker-Laufzeit kompatibel sein.

### Zentrale Dateien

| Datei / Verzeichnis | Zweck |
| --- | --- |
| `src/routes/index.tsx` | Brief hinzufügen und Analyse starten |
| `src/routes/ergebnis.tsx` | Ergebnisse, Übersetzung, Datumskorrektur und Aktionen |
| `src/components/letter-session.tsx` | Flüchtiger Sitzungszustand ohne Persistenz |
| `src/config/languages.ts` | Unterstützte Sprachen und Vorlesecodes |
| `src/config/analysis.ts` | KI-Modell, Bekanntgabeparameter und technische Anfragegrenzen |
| `src/config/urgent-advice.ts` | Dringlichkeitsgrenze und geprüfte Hinweistexte |
| `src/config/beratungsstellen.json` | Beratungsstellen und Kontaktdaten |
| `src/config/legal.ts` | Impressum-Angaben (Anbieter, Anschrift, Kontakt, Stand) |
| `src/lib/analyze-letter.functions.ts` | Analyse und Übersetzung mit Datenschutzfreigabe |
| `src/lib/letter-prompts.server.ts` | Analyse- und Übersetzungsregeln |
| `src/lib/letter-schema.ts` | Briefschema und Prüfung der Übersetzung |
| `src/lib/calculate-deadlines.ts` | Relative und feste Fristen |
| `src/lib/urgent-advice.ts` | Gemeinsame Logik für Dringend-Hinweis und Kontaktwahl |
| `src/lib/letter-exports.ts` | Kopiertext und Kalenderexport |
| `src/styles.css` | Gestaltung, Kontraste und Druckansicht |
| `src/test/` | Tests für Regeln, Berechnung und zentrale Abläufe |
| `AGENTS.md` | Verbindliche technische Projektregeln |

## Eigener Betrieb und Verantwortung

Wer dieses Projekt kopiert und selbst betreibt, ist für den eigenen Einsatz verantwortlich – insbesondere für Datenschutz (DSGVO, Auftragsverarbeitung mit dem KI-Anbieter, die oben beschriebene Datenschutzfreigabe), die Richtigkeit der Beratungsstellen und die Hinweise an die Nutzer:innen.

## Mitmachen

Rückmeldungen aus der Praxis sind besonders willkommen:

- Briefarten, die schlecht erkannt werden
- Übersetzungen, die für Muttersprachler:innen unnatürlich klingen
- Beratungsstellen für weitere Städte

Gerne als [Issue](../../issues) oder per E-Mail.

## Kontakt

Melisa Mustafovic-Brüstle · [melisamustafovic@gmail.com](mailto:melisamustafovic@gmail.com)

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE). Der Code darf frei genutzt, verändert und weitergegeben werden – auch für eigene Städte und Träger –, solange der Lizenzhinweis erhalten bleibt. Die Software wird ohne Gewährleistung bereitgestellt.

---

## English summary

**Brief verstehen** ("Understand your letter") is a mobile-first web app that helps social workers, legal and migration counsellors, and interpreters explain German official letters to families with limited German. It was created by an interpreter who regularly works with Roma families.

Photograph, upload or paste a letter, and the app returns a structured explanation in **Easy German** plus an optional **second language** (Romanian, Bulgarian, Serbian, Macedonian, Albanian, Turkish, Arabic, Ukrainian, English): sender, summary, tasks, required documents, appointments, warnings, uncertainties and **deadlines**.

Key design choices: the AI explains, but **deadlines are calculated in code**, not estimated by the model; every deadline shows the **verbatim quote** from the letter; translations are checked so that dates, amounts and facts stay unchanged; **no letters are stored**, and the AI features stay locked until gateway content logging has been verified as disabled; an **urgent notice** links to local counselling services when residence, court, housing or child welfare is at stake. Counselling services are configured in `src/config/beratungsstellen.json` (included: Freiburg im Breisgau), so the app can be adapted to any city.

Built with Lovable (React 19, TanStack Start, Tailwind CSS 4, Cloudflare Workers, Lovable AI Gateway).

**This is not legal advice.** AI output can be wrong – always verify deadlines against the original letter.
