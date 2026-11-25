export const adviceReasons = ["abschiebung", "ausreise", "haft", "gericht", "inobhutnahme", "raeumung", "sonstiges"] as const;
export type AdviceReason = (typeof adviceReasons)[number];
export const adviceThresholdDays = 14;
export const adviceTitle = "Bitte schnell Hilfe holen";
export const adviceBringLetter = "Nimm diesen Brief mit.";
export const adviceFallback = "Frag deine Dolmetscherin oder Sozialarbeiterin nach einer Beratungsstelle.";
const residence = "In diesem Brief geht es um deinen Aufenthalt in Deutschland. Das ist sehr wichtig. Geh bitte schnell zu einer Beratungsstelle.";
const court = "Dieser Brief ist von einem Gericht oder geht um ein Gericht. Geh bitte schnell zu einer Beratungsstelle oder zu einem Anwalt.";
export const adviceTexts: Record<AdviceReason, string> = {
  abschiebung: residence, ausreise: residence, haft: court, gericht: court,
  inobhutnahme: "In diesem Brief geht es um dein Kind. Das ist sehr wichtig. Geh bitte schnell zu einer Beratungsstelle.",
  raeumung: "In diesem Brief geht es um deine Wohnung. Das ist sehr wichtig. Geh bitte schnell zu einer Beratungsstelle.",
  sonstiges: "Du hast nur noch wenig Zeit, um etwas zu tun. Geh bitte schnell zu einer Beratungsstelle.",
};