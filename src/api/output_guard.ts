import { Answer } from "../agent/schema";

// Guardrails on the way OUT: even a well-formed answer must be GROUNDED.
// An answer that claims facts but cites nothing is exactly a hallucination.
export function enforceGrounding(answer: Answer): Answer {
  if (answer.refused) return answer; // an honest refusal is already fine

  if (answer.citations.length === 0) {
    // Asserted something with zero citations → downgrade to a refusal.
    return {
      answer:
        "I don't have enough information in my knowledge base to answer that.",
      citations: [],
      refused: true,
    };
  }
  return answer;
}
