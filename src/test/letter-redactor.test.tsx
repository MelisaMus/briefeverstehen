import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LetterRedactor } from "@/components/letter-redactor";
import { helperConsent, ownConsent, consentTranslations } from "@/config/consent";

afterEach(cleanup);

describe("Text vor der KI-Anfrage bereinigen", () => {
  it("sendet nur den bearbeiteten Text nach ausdrücklicher Prüfung", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    render(<LetterRedactor pages={[]} text="Name: Fiktive Person. Bitte Unterlagen bringen." onCancel={vi.fn()} onSend={send}/>);
    const button = screen.getByRole("button", { name: "An die KI senden" });
    expect(button).toBeDisabled();
    expect(send).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Text ohne persönliche Daten"), { target: { value: "Bitte Unterlagen bringen." } });
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: "Mein eigener Brief" }));
    expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: ownConsent }));
    expect(button).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Text ohne persönliche Daten"), { target: { value: "Bitte die Unterlagen bringen." } });
    expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    fireEvent.click(button);
    await waitFor(() => expect(send).toHaveBeenCalledWith([], "Bitte die Unterlagen bringen."));
    expect(send).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
  });
  it("sendet beim Abbrechen keinen Text", () => {
    const send = vi.fn(); const cancel = vi.fn();
    render(<LetterRedactor pages={[]} text="Fiktiver Brief" onCancel={cancel} onSend={send}/>);
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(cancel).toHaveBeenCalledOnce();
    expect(send).not.toHaveBeenCalled();
  });
  it("erklärt, wie geschwärzt wird und dass erst geprüft werden muss", () => {
    render(<LetterRedactor pages={["data:image/png;base64,iVBORw0KGgo="]} text="" onCancel={vi.fn()} onSend={vi.fn()}/>);
    expect(screen.getByText(/Mit dem Finger oder der Maus ein Rechteck über die Stelle ziehen/)).toBeInTheDocument();
    expect(screen.getByText(/Bitte erst jede Seite prüfen/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "An die KI senden" })).toBeDisabled();
  });
  it("verlangt beim Wechsel zur Hilfe eine neue passende Zustimmung", () => {
    render(<LetterRedactor pages={[]} text="Fiktiver Brief" language="ro" onCancel={vi.fn()} onSend={vi.fn()}/>);
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    fireEvent.click(screen.getByRole("radio", { name: "Mein eigener Brief" }));
    fireEvent.click(screen.getByRole("checkbox", { name: ownConsent }));
    const button = screen.getByRole("button", { name: "An die KI senden" });
    expect(button).toBeEnabled();
    fireEvent.click(screen.getByRole("radio", { name: /Ich helfe einer anderen Person/ }));
    expect(button).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: helperConsent })).not.toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: helperConsent }));
    expect(button).toBeEnabled();
    fireEvent.click(screen.getByRole("checkbox", { name: helperConsent }));
    expect(button).toBeDisabled();
  });
  it("zeigt bei Hilfe den vorbereiteten Text auf Deutsch und in der gewählten Zielsprache", () => {
    render(<LetterRedactor pages={[]} text="Fiktiver Brief" language="ro" onCancel={vi.fn()} onSend={vi.fn()}/>);
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    fireEvent.click(screen.getByRole("radio", { name: /Ich helfe einer anderen Person/ }));
    const notice = screen.getByRole("region", { name: "Einwilligung vor dem Senden" });
    expect(notice).toHaveTextContent("Wir möchten deinen Brief mit einem Computer-Programm erklären lassen.");
    expect(notice).toHaveTextContent(consentTranslations.ro);
  });
  it("stellt nach erfolgreichem Senden und erneuter Prüfansicht keine Einwilligung wieder her", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const first = render(<LetterRedactor pages={[]} text="Fiktiver Brief" onCancel={vi.fn()} onSend={send}/>);
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    fireEvent.click(screen.getByRole("radio", { name: "Mein eigener Brief" }));
    fireEvent.click(screen.getByRole("checkbox", { name: ownConsent }));
    fireEvent.click(screen.getByRole("button", { name: "An die KI senden" }));
    await waitFor(() => expect(send).toHaveBeenCalledOnce());
    await waitFor(() => expect(screen.getByRole("button", { name: "An die KI senden" })).toBeDisabled());
    first.unmount();
    render(<LetterRedactor pages={[]} text="Nächster Brief" onCancel={vi.fn()} onSend={send}/>);
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    expect(screen.getByRole("radio", { name: "Mein eigener Brief" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: /Ich helfe einer anderen Person/ })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "An die KI senden" })).toBeDisabled();
  });
  it("erklärt die Prüfung für eingefügten Text und verschwindet nach der Prüfung", () => {
    render(<LetterRedactor pages={[]} text="Name: Fiktive Person." onCancel={vi.fn()} onSend={vi.fn()}/>);
    expect(screen.getByText(/Namen, Anschrift und Aktenzeichen aus dem Text löschen/)).toBeInTheDocument();
    expect(screen.getByText(/Bitte erst den Text prüfen/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    expect(screen.queryByText(/Bitte erst den Text prüfen/)).not.toBeInTheDocument();
  });
});