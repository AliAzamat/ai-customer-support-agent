import OpenAI from "openai";
import { retrieve } from "../rag/retrieve";
import { buildMessages } from "./prompt";
import { AnswerSchema, Answer } from "./schema";
import { byId } from "../kb/store";

const openai = new OpenAI();

// One grounded turn: retrieve, prompt, call in JSON mode, validate, verify.
export async function answerQuestion(question: string): Promise<Answer> {
  const results = await retrieve(question);
  const messages = buildMessages(question, results);

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" }, // force syntactically valid JSON
    messages,
  });

  const raw = resp.choices[0].message.content ?? "{}";
  // 1) Parse + shape-check the model's JSON. Throws on a wrong shape.
  const parsed: Answer = AnswerSchema.parse(JSON.parse(raw));

  // 2) Drop any citation that doesn't map to a real article — the model
  //    cannot cite something that isn't in the knowledge base.
  parsed.citations = parsed.citations.filter((id) => byId(id) !== undefined);
  return parsed;
}
