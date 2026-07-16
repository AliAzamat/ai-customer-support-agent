import { Retrieved } from "../kb/types";

// The system message is the agent's CONSTITUTION: answer ONLY from provided
// context, cite the ids you used, and refuse when the context can't answer.
export const SYSTEM_PROMPT = `You are a customer-support agent.
Rules:
- Answer ONLY using the provided context articles. Never use outside knowledge.
- Every claim must be supported by a context article.
- Return JSON: {"answer": string, "citations": string[], "refused": boolean}.
- "citations" lists the ids of the articles you used.
- If the context does not contain the answer, set "refused" to true, give a
  short apology in "answer", and return an empty "citations" array.`;

// Render retrieved articles into a context block. The id is shown so the model
// can cite it and so we can later verify the citation is real.
export function renderContext(results: Retrieved[]): string {
  if (results.length === 0) return "CONTEXT: (none)";
  const blocks = results.map(
    (r) => `[${r.article.id}] ${r.article.title}\n${r.article.body}`,
  );
  return "CONTEXT:\n" + blocks.join("\n\n");
}

// Assemble the full message list: the constitution, the context, the question.
export function buildMessages(question: string, results: Retrieved[]) {
  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "user" as const, content: `${renderContext(results)}\n\nQUESTION: ${question}` },
  ];
}
