import { ARTICLES } from "../kb/store";
import { Retrieved } from "../kb/types";

// Break text into lowercase word tokens — the unit we match on.
function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

// Score one article against a question: how many query tokens it contains,
// with a tag hit weighted extra because a tag is a strong topic signal.
function scoreArticle(queryTokens: string[], a: { body: string; title: string; tags: string[] }): number {
  const haystack = new Set(tokenize(a.title + " " + a.body));
  const tagSet = new Set(a.tags.flatMap(tokenize));
  let score = 0;
  for (const t of queryTokens) {
    if (haystack.has(t)) score += 1;
    if (tagSet.has(t)) score += 2; // a tag match is worth more than a body word
  }
  return score;
}

// Return the top-k articles whose score clears a floor, best first.
export function keywordSearch(question: string, k = 3): Retrieved[] {
  const queryTokens = tokenize(question);
  return ARTICLES.map((article) => ({ article, score: scoreArticle(queryTokens, article) }))
    .filter((r) => r.score > 0) // a zero-overlap article is not evidence
    .sort((x, y) => y.score - x.score)
    .slice(0, k);
}
