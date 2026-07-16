// An Article is one citable unit of truth. Everything the agent says must
// trace back to one of these — the id is what an answer cites.
export interface Article {
  id: string;            // stable citation handle, e.g. "refund-window"
  title: string;
  body: string;
  tags: string[];        // coarse topic labels for cheap keyword retrieval
}

// A retrieval result pairs an article with the score that surfaced it,
// so callers can rank, threshold, and explain why it was chosen.
export interface Retrieved {
  article: Article;
  score: number;
}
