import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LetterRedactor } from "@/components/letter-redactor";

afterEach(cleanup);

describe("Text vor der KI-Anfrage bereinigen", () => {
  it("sendet nur den bearbeiteten Text nach ausdrücklicher Prüfung", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    render(<LetterRedactor pages={[]} text="Name: Fiktive Person. Bitte Unterlagen bringen." onCancel={vi.fn()} onSend={send}/>);
    const button = screen.getByRole("button", { name: "Geprüften Brief senden" });
    expect(button).toBeDisabled();
    expect(send).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Text ohne persönliche Daten"), { target: { value: "Bitte Unterlagen bringen." } });
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    expect(button).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Text ohne persönliche Daten"), { target: { value: "Bitte die Unterlagen bringen." } });
    expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    fireEvent.click(button);
    await waitFor(() => expect(send).toHaveBeenCalledWith([], "Bitte die Unterlagen bringen."));
    expect(send).toHaveBeenCalledTimes(1);
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
    expect(screen.getByRole("button", { name: "Geprüften Brief senden" })).toBeDisabled();
  });
  it("erklärt die Prüfung für eingefügten Text und verschwindet nach der Prüfung", () => {
    render(<LetterRedactor pages={[]} text="Name: Fiktive Person." onCancel={vi.fn()} onSend={vi.fn()}/>);
    expect(screen.getByText(/Namen, Anschrift und Aktenzeichen aus dem Text löschen/)).toBeInTheDocument();
    expect(screen.getByText(/Bitte erst den Text prüfen/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Text geprüft" }));
    expect(screen.queryByText(/Bitte erst den Text prüfen/)).not.toBeInTheDocument();
  });
});