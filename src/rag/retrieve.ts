import { keywordSearch } from "./keyword";
import { semanticSearch } from "./embeddings";
import { Retrieved } from "../kb/types";

// HYBRID retrieval: union the keyword and semantic hits, keep the best score
// seen per article. Lexical catches exact terms; semantic catches paraphrases.
export async function retrieve(question: string, k = 3): Promise<Retrieved[]> {
  const lexical = keywordSearch(question, k);
  const semantic = await semanticSearch(question, k);
  const best = new Map<string, Retrieved>();
  for (const r of [...lexical, ...semantic]) {
    const prev = best.get(r.article.id);
    if (!prev || r.score > prev.score) best.set(r.article.id, r);
  }
  return [...best.values()].sort((x, y) => y.score - x.score).slice(0, k);
}
