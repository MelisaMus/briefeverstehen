import { useState } from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BriefDateField } from "@/components/brief-date-field";

afterEach(cleanup);

function ExampleDate() {
  const [date, setDate] = useState("2026-11-23");
  return <BriefDateField value={date} original="2026-11-23" onChange={setDate}/>;
}

describe("Briefdatum korrigieren", () => {
  it("übernimmt das Briefdatum und erlaubt eine Korrektur unabhängig vom Ankunftsdatum", () => {
    render(<ExampleDate/>);
    const input = screen.getByLabelText("Briefdatum laut Brief:");
    expect(input).toHaveValue("2026-11-23");
    fireEvent.change(input, { target: { value: "2026-11-20" } });
    expect(input).toHaveValue("2026-11-20");
  });
  it("ersetzt ein vorhandenes Briefdatum nicht durch eine leere Eingabe", () => {
    render(<ExampleDate/>);
    const input = screen.getByLabelText("Briefdatum laut Brief:");
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("2026-11-23");
  });
});