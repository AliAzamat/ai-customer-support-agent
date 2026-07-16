import OpenAI from "openai";
import { ARTICLES } from "../kb/store";
import { Article, Retrieved } from "../kb/types";

const openai = new OpenAI(); // reads OPENAI_API_KEY from the environment

// Turn text into a vector that captures MEANING, so similar ideas land near
// each other even when they share no words.
export async function embed(text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return resp.data[0].embedding;
}

// Cosine similarity: the angle between two vectors, in [-1, 1]. Closer to 1
// means more semantically similar.
export function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

// Embed the whole corpus ONCE at startup — embedding is a paid call, and the
// articles don't change between questions.
let corpus: { article: Article; vector: number[] }[] = [];
export async function indexCorpus(): Promise<void> {
  corpus = await Promise.all(
    ARTICLES.map(async (article) => ({
      article,
      vector: await embed(article.title + " " + article.body),
    })),
  );
}

// Semantic search: embed the question, rank articles by cosine similarity.
export async function semanticSearch(question: string, k = 3): Promise<Retrieved[]> {
  const q = await embed(question);
  return corpus
    .map(({ article, vector }) => ({ article, score: cosine(q, vector) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k);
}
