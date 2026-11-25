export const privacyBlockedMessage = "Die KI-Analyse ist zum Schutz deiner Daten noch gesperrt. Die Speicherung von KI-Anfrageinhalten muss zuerst deaktiviert und geprüft werden. Dein Brief wurde nicht an die KI gesendet.";

export function hasNoContentLogging(verified: string | undefined): boolean {
  return verified === "true";
}