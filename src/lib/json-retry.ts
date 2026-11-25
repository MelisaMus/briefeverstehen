export async function requestValidJson<T>(request: () => Promise<string>, validate: (value: unknown) => T): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    // Transport/provider failures are not replayed by this application.
    const text = await request();
    try { return validate(JSON.parse(text)); } catch {
      if (attempt === 1) throw new Error("invalid_letter_json");
    }
  }
  throw new Error("invalid_letter_json");
}