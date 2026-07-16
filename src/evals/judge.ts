import OpenAI from "openai";

const openai = new OpenAI();

// LLM-as-judge: ask a model whether the answer is faithful to the reference.
// Deterministic checks catch the obvious; the judge catches the subtle.
const JUDGE_SYSTEM = `You grade a support agent's answer.
Given the reference facts and the answer, decide if the answer is fully
supported by the reference and makes no unsupported claims.
Respond JSON: {"faithful": boolean, "reason": string}.`;

export async function judge(reference: string, answer: string): Promise<{ faithful: boolean; reason: string }> {
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: JUDGE_SYSTEM },
      { role: "user", content: `REFERENCE:\n${reference}\n\nANSWER:\n${answer}` },
    ],
  });
  return JSON.parse(resp.choices[0].message.content ?? "{}");
}
