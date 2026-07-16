# AI Customer Support Agent

Grow a customer-support agent from a typed knowledge base into a deployable, guardrailed service. You will model the knowledge base, build keyword + embedding retrieval (RAG), write a grounding prompt that forces citations, parse and validate structured JSON output, wrap it all in an Express API with input and refusal guardrails, write an evaluation harness with an LLM judge, add automated hallucination checks that gate every change, and ship the whole thing with Docker. TypeScript end to end with OpenAI, Express, RAG, and evals.

Built step-by-step with [KhwajaLabs Build](https://khwajalabs.com).

## Stack
- TypeScript
- OpenAI
- Express
- RAG
- Evals
