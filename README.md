# Brief verstehen

Eine mobile-first Web-App für Dolmetscher:innen und Sozialarbeiter:innen, die deutsche Behördenbriefe gemeinsam mit Familien mit geringen Deutschkenntnissen verstehen möchten.

Die App erklärt Briefe in Leichtem Deutsch und auf Wunsch in einer weiteren Sprache. Große Schrift, klare Symbole und zweisprachige Ergebniskarten unterstützen die gemeinsame Besprechung. Die Nutzung erfordert keinen Login.

**Web-App:** [briefeverstehen.lovable.app](https://briefeverstehen.lovable.app)

**Weiterentwicklung:** Das zugehörige Projekt im Lovable-Arbeitsbereich öffnen.

## Funktionen

- Brief fotografieren, Bilder oder PDF hochladen oder Brieftext einfügen; mehrere Seiten in der richtigen Reihenfolge verarbeiten.
- Ankunftsdatum und Zielsprache auswählen; alternativ nur Leichtes Deutsch anzeigen.
- Zuerst die deutsche Erklärung erhalten, anschließend die Übersetzung in einer getrennten KI-Anfrage.
- Absender, Briefart, Zusammenfassung, Aufgaben, Unterlagen, Fristen, Termine, Warnungen und Unsicherheiten anzeigen.
- „Briefdatum laut Brief“ prüfen und korrigieren. Relative Fristen werden neu berechnet; feste Datumsangaben bleiben unverändert.
- Aufgaben abhaken, Texte vorlesen lassen, Ergebnisse kopieren, als PDF über den Druckdialog sichern und Termine als Kalenderdatei (`.ics`) exportieren.
- Bei dringenden Themen oder Rechtsbehelfsfristen von weniger als 14 Tagen einen nicht wegklickbaren, zweisprachigen Hinweis anzeigen – mit passenden Beratungsstellen, Telefon-, E-Mail- und Kartenlinks. Der Hinweis erscheint auch im Kopiertext und PDF-Druck.

### Unterstützte Sprachen

Leichtes Deutsch sowie Rumänisch, Bulgarisch, Serbisch, Mazedonisch, Albanisch, Türkisch, Arabisch, Ukrainisch und Englisch. Für Arabisch wird die Schreibrichtung angepasst. Die verfügbaren Vorlesestimmen hängen vom Browser und Gerät ab.

## Datenschutz und Grenzen

**Wir speichern deine Briefe nicht.** Die App legt Briefe und Ergebnisse weder in einer Datenbank noch in Dateispeichern oder Browser-Persistenz ab. Ergebnisse bleiben ausschließlich im React-Sitzungszustand; beim Neuladen der Ergebnisseite erscheint ein leerer Zustand statt Beispieldaten.

Für die Analyse werden Brieftext und lokal vorbereitete Bilder vorübergehend an serverseitige Funktionen und den KI-Dienst übermittelt. Bilder werden vor dem Versand lokal verkleinert; PDFs werden im Browser seitenweise als Bilder aufbereitet. Die App protokolliert keine Briefinhalte und setzt für die KI-Antworten `Cache-Control: no-store`.

Vor dem Hochladen gilt: **Namen, Adressen und Aktenzeichen wenn möglich abdecken.** Ein eingebauter Schwärzen-Modus und ein Bild-Export sind derzeit nicht vorhanden. Kopierte, gedruckte oder heruntergeladene Ergebnisse liegen anschließend in der Verantwortung der nutzenden Person.

### Datenschutzfreigabe der KI

Beide KI-Funktionen bleiben gesperrt, solange die serverseitige Einstellung `AI_CONTENT_LOGGING_DISABLED_VERIFIED` nicht exakt `true` ist. Diese Freigabe darf erst gesetzt werden, wenn die Erfassung von KI-Anfrage- und Antwortinhalten am Gateway deaktiviert und mit erfundenen Testbriefen geprüft wurde. Eine Zusage zur fehlenden Speicherung beim Modellanbieter allein genügt nicht.

Bei einer neuen Einrichtung muss diese Prüfung erneut erfolgen. Private Schlüssel und Freigaben werden über **Project Settings → Secrets** verwaltet und gehören niemals in das Repository oder den Browsercode.

### Keine Rechtsberatung

**Erstellt mit KI. Fehler sind möglich. Wichtige Fristen bitte immer im Original prüfen.**

Die App erklärt Briefe. Sie ersetzt keine Rechtsberatung. Bei Widerspruch, Klage oder Aufenthaltsfragen ist eine Beratungsstelle zu kontaktieren. Die Erklärung sollte durch eine Fachkraft geprüft werden.

Die Fristberechnung orientiert sich am im Brief genannten Bezug. Für die Bekanntgabe bei Postversand sind standardmäßig 4 Tage nach dem Briefdatum konfiguriert. Relative Monats- und Jahresfristen berücksichtigen Monatsenden; relative Fristenden an Samstagen, Sonntagen und bundesweiten Feiertagen werden auf den nächsten Werktag verschoben. Fehlende oder unklare Angaben werden als unsicher gekennzeichnet. Regionale Feiertage und rechtliche Sonderfälle erfordern eine eigene Prüfung.

## Technik und Ablauf

- **Oberfläche:** React 19, TypeScript, Tailwind CSS 4 und gemeinsame UI-Komponenten.
- **Framework:** TanStack Start mit dateibasiertem TanStack Router und Vite.
- **Server:** TanStack-Serverfunktionen auf der von Lovable bereitgestellten Cloudflare-Worker-Laufzeit.
- **KI:** Lovable AI Gateway; Modell und Provider werden zentral konfiguriert.
- **Prüfung:** Zod für strukturierte KI-Ausgaben, Vitest und Testing Library für Tests.
- **Dokumente und Fristen:** PDF.js, date-fns und date-holidays.

Die Analyse und Übersetzung verwenden dasselbe validierte Briefschema. Ungültige JSON-Ausgaben werden einmal erneut angefordert. Die Übersetzung darf nur die vorgesehenen Übersetzungsfelder ändern; deutsche Texte und strukturierte Fakten werden auf Unverändertheit geprüft. Fristberechnung, Dringend-Hinweis und Exporte verwenden denselben aktuellen Sitzungszustand.

## Lokal entwickeln

Voraussetzungen: eine aktuelle Node.js-LTS-Version, Bun und Zugriff auf die benötigte Lovable-Konfiguration für echte KI-Anfragen. Ein frisch geklontes Repository enthält keine privaten Zugangsschlüssel.

Im Projektverzeichnis:

```sh
bun install --frozen-lockfile
bun run dev
```

Die lokale Adresse wird beim Start im Terminal ausgegeben. Ohne die erforderlichen serverseitigen Schlüssel und die geprüfte Datenschutzfreigabe ist keine echte KI-Analyse möglich. Zum Testen ausschließlich erfundene Briefe ohne personenbezogene Daten verwenden.

Weitere Befehle:

```sh
bun run test         # Alle Tests einmal ausführen
bun run test:watch   # Tests während der Entwicklung beobachten
bun run lint        # Code prüfen
bun run build       # Produktionsversion erstellen
bun run preview     # Erstellte Version lokal ansehen
```

Ein lokaler Entwicklungsserver verwendet nicht exakt dieselbe Laufzeit wie die veröffentlichte App. Serverseitiger Code muss daher auch mit der Worker-Laufzeit kompatibel sein. Änderungen im Repository veröffentlichen die App nicht automatisch; die Veröffentlichung erfolgt separat über Lovable.

## Zentrale Dateien

| Datei / Verzeichnis | Zweck |
| --- | --- |
| `src/routes/index.tsx` | Brief hinzufügen und Analyse starten |
| `src/routes/ergebnis.tsx` | Ergebnisse, Übersetzung, Datumskorrektur und Aktionen |
| `src/components/letter-session.tsx` | Flüchtiger Sitzungszustand ohne Persistenz |
| `src/config/languages.ts` | Unterstützte Sprachen und Vorlesecodes |
| `src/config/analysis.ts` | KI-Modell, Bekanntgabeparameter und technische Anfragegrenzen |
| `src/config/urgent-advice.ts` | Dringlichkeitsgrenze und geprüfte Hinweistexte |
| `src/config/beratungsstellen.json` | Beratungsstellen und Kontaktdaten |
| `src/lib/analyze-letter.functions.ts` | Analyse und Übersetzung mit Datenschutzfreigabe |
| `src/lib/letter-prompts.server.ts` | Analyse- und Übersetzungsregeln |
| `src/lib/letter-schema.ts` | Briefschema und Prüfung der Übersetzung |
| `src/lib/calculate-deadlines.ts` | Relative und feste Fristen |
| `src/lib/urgent-advice.ts` | Gemeinsame Logik für Dringend-Hinweis und Kontaktwahl |
| `src/lib/letter-exports.ts` | Kopiertext und Kalenderexport |
| `src/styles.css` | Gestaltung, Kontraste und Druckansicht |
| `src/test/` | Tests für Regeln, Berechnung und zentrale Abläufe |
| `AGENTS.md` | Verbindliche technische Projektregeln |

### Beratungsstellen pflegen

`src/config/beratungsstellen.json` enthält derzeit 10 Einträge aus Freiburg und Umgebung. Jeder Eintrag enthält `name`, `thema`, `adresse`, `telefon`, `oeffnungszeiten` und `link`; zusätzlich werden `email` und `hinweis` unterstützt.

Themen sind `abschiebung`, `ausreise`, `haft`, `gericht`, `inobhutnahme`, `raeumung` oder `sonstiges`. Deutsche Telefonnummern werden für anklickbare `tel:`-Links in internationales Format umgewandelt: Die führende Ortsnetz-Null wird durch die Landesvorwahl `+49` ersetzt. E-Mail-Adressen erscheinen als `mailto:`-Links, Hinweise als kleiner grauer Text. Kontaktdaten und Öffnungszeiten sollten regelmäßig auf Aktualität geprüft werden.
