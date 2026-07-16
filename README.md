# AI Customer Support Agent

A customer-support agent with a typed knowledge base into a deployable, guardrailed service. Modeled knowledge base, built keyword + embedding retrieval (RAG), wrote a grounding prompt that forces citations, parse and validate structured JSON output, wrapped it all in an Express API with input and refusal guardrails, wrote an evaluation harness with an LLM judge, added automated hallucination checks that gate every change, and shipped the whole thing with Docker. TypeScript end to end with OpenAI, Express, RAG, and evals.

## Stack
- TypeScript
- OpenAI
- Express
- RAG
- Evals
