// Guardrails on the way IN: reject input that's empty, too long, or abusive
// before it ever reaches a paid model call.
const MAX_LEN = 500;

export class GuardrailError extends Error {}

export function checkQuestion(question: unknown): string {
  if (typeof question !== "string" || question.trim().length === 0) {
    throw new GuardrailError("question must be a non-empty string");
  }
  if (question.length > MAX_LEN) {
    // A 50k-character "question" is abuse or a bug, and it costs real tokens.
    throw new GuardrailError(`question exceeds ${MAX_LEN} characters`);
  }
  return question.trim();
}
