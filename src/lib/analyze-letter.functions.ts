import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isoDate, letterSchema, type Letter } from "./letter-schema";
import { requestConfig } from "@/config/analysis";
import { languages } from "@/config/languages";

export type LetterResponse = { ok: true; letter: Letter } | { ok: false; message: string };
const languageSchema = z.string().refine((code) => languages.some((language) => language.code === code));
const inputSchema = z.object({
  pages: z.array(z.string().regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/).max(requestConfig.maxEncodedCharacters)).max(requestConfig.maxPages),
  text: z.string().max(requestConfig.maxTextCharacters), arrivalDate: isoDate, today: isoDate,
}).refine((value) => value.pages.length > 0 || value.text.trim().length > 0).refine((value) => value.pages.reduce((total, page) => total + page.length, 0) <= requestConfig.maxEncodedCharacters);

export const analyzeLetter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.safeParse(input))
  .handler(async ({ data }): Promise<LetterResponse> => {
    const { setResponseHeader } = await import("@tanstack/react-start/server");
    setResponseHeader("Cache-Control", "no-store");
    const { hasNoContentLogging, privacyBlockedMessage } = await import("./ai-privacy.server");
    if (!hasNoContentLogging(process.env['AI_CONTENT_LOGGING_DISABLED_VERIFIED'])) return { ok: false, message: privacyBlockedMessage };
    if (!data.success) return { ok: false, message: "Bitte einen Brief und ein gültiges Ankunftsdatum auswählen." };
    try {
      const { analyze } = await import("./letter-ai.server");
      return { ok: true, letter: await analyze(data.data) };
    } catch (error) {
      const { safeAiError } = await import("./letter-ai.server");
      return { ok: false, message: safeAiError(error, false) };
    }
  });

export const translateLetter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ letter: letterSchema, language: languageSchema }).safeParse(input))
  .handler(async ({ data }): Promise<LetterResponse> => {
    const { setResponseHeader } = await import("@tanstack/react-start/server");
    setResponseHeader("Cache-Control", "no-store");
    const { hasNoContentLogging, privacyBlockedMessage } = await import("./ai-privacy.server");
    if (!hasNoContentLogging(process.env['AI_CONTENT_LOGGING_DISABLED_VERIFIED'])) return { ok: false, message: privacyBlockedMessage };
    if (!data.success) return { ok: false, message: "Die Übersetzung konnte nicht gestartet werden." };
    try {
      const { translate } = await import("./letter-ai.server");
      return { ok: true, letter: await translate(data.data.letter, data.data.language) };
    } catch (error) {
      const { safeAiError } = await import("./letter-ai.server");
      return { ok: false, message: safeAiError(error, true) };
    }
  });