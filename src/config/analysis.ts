export const aiConfig = {
  provider: "openai",
  model: "openai/gpt-6-astra",
} as const;

export const deadlineConfig = { postalNoticeDays: 4 };
export const imageConfig = { maxSide: 2000, jpegQuality: 0.85 };

// Technical request safeguards, not document-storage limits.
export const requestConfig = { maxPages: 40, maxEncodedCharacters: 24_000_000, maxTextCharacters: 100_000 };