import { CASES, EvalCase } from "./cases";
import { answerQuestion } from "../agent/answer";
import { byId } from "../kb/store";
import { judge } from "./judge";

export interface CaseResult {
  id: string;
  passed: boolean;
  reasons: string[];
}

// Score one case with cheap deterministic checks FIRST, then the LLM judge.
export async function runCase(c: EvalCase): Promise<CaseResult> {
  const reasons: string[] = [];
  const answer = await answerQuestion(c.question);

  if (c.shouldRefuse) {
    if (!answer.refused) reasons.push("expected a refusal but got an answer");
    return { id: c.id, passed: reasons.length === 0, reasons };
  }

  if (answer.refused) reasons.push("agent refused a question it should answer");
  if (!answer.citations.includes(c.expectCitation))
    reasons.push(`missing expected citation ${c.expectCitation}`);
  for (const sub of c.mustInclude)
    if (!answer.answer.includes(sub)) reasons.push(`answer missing "${sub}"`);

  // Only pay for the judge once the cheap checks pass.
  if (reasons.length === 0) {
    const reference = byId(c.expectCitation)?.body ?? "";
    const verdict = await judge(reference, answer.answer);
    if (!verdict.faithful) reasons.push(`judge: ${verdict.reason}`);
  }
  return { id: c.id, passed: reasons.length === 0, reasons };
}

export async function runSuite(): Promise<CaseResult[]> {
  return Promise.all(CASES.map(runCase));
}
