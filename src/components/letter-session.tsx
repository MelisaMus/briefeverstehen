import { createContext, useContext, useState, type ReactNode } from "react";
import type { Letter } from "@/lib/letter-schema";

export type LetterSessionData = { letter: Letter; arrivalDate: string; today: string };
const SessionContext = createContext<{ session: LetterSessionData | null; setSession: (value: LetterSessionData | null) => void } | null>(null);

export function LetterSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LetterSessionData | null>(null);
  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}

export function useLetterSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("Letter session provider missing");
  return value;
}