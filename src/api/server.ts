import express from "express";
import { answerQuestion } from "../agent/answer";
import { checkQuestion, GuardrailError } from "./guardrails";
import { enforceGrounding } from "./output_guard";
import { indexCorpus } from "../rag/embeddings";

export const app = express();
app.use(express.json({ limit: "16kb" })); // cap the raw body, too

app.post("/ask", async (req, res) => {
  try {
    const question = checkQuestion(req.body?.question); // input guardrail
    const answer = await answerQuestion(question);
    const safe = enforceGrounding(answer);             // output guardrail
    res.json(safe);
  } catch (err) {
    if (err instanceof GuardrailError) {
      // Bad input is the CLIENT's fault → 400 with a reason, not a 500.
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Embed the corpus once before serving traffic.
export async function start(port = 3000): Promise<void> {
  await indexCorpus();
  app.listen(port, () => console.log(`support agent on :${port}`));
}
