import { describe, expect, it } from "vitest";
import entries from "@/config/beratungsstellen.json";
import { internationalPhone, matchingAdviceServices } from "@/lib/urgent-advice";

describe("Importierte Beratungsstellen", () => {
  it("übernimmt alle zehn Einträge ohne Platzhalter", () => {
    expect(entries).toHaveLength(10);
    expect(matchingAdviceServices("sonstiges", true)).toHaveLength(10);
    expect(entries.every(entry => entry.email && entry.hinweis)).toBe(true);
  });
  it.each([
    ["0761 2088408", "+497612088408"],
    ["0175 9037476", "+491759037476"],
    ["0761 7903-2115", "+4976179032115"],
    ["0761 891538", "+49761891538"],
    ["0761 590361-17", "+4976159036117"],
    ["0761 214176-94", "+4976121417694"],
    ["0711 5532834", "+497115532834"],
    ["0761 205-0", "+497612050"],
    ["0761 202700", "+49761202700"],
    ["0761 201-8601", "+497612018601"],
  ])("wandelt %s für den Telefonlink um", (number, international) => {
    expect(entries.some(entry => entry.telefon === number)).toBe(true);
    expect(internationalPhone(number)).toBe(international);
  });
  it("zeigt bei Räumung nur die zwei zugeordneten Stellen", () => {
    expect(matchingAdviceServices("raeumung", false).map(entry => entry.name)).toEqual([
      "Amtsgericht Freiburg – Rechtsantragstelle (Beratungshilfe)", "Mieterverein Regio Freiburg e.V.",
    ]);
  });
});