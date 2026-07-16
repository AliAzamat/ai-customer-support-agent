import { Article } from "./types";

// The knowledge base is DATA, not prompt text. Editing support policy means
// editing this store — never the model's instructions.
export const ARTICLES: Article[] = [
  {
    id: "refund-window",
    title: "Refund window",
    body: "Refunds are issued within 30 days of purchase to the original payment method.",
    tags: ["refund", "returns", "money"],
  },
  {
    id: "shipping-times",
    title: "Shipping times",
    body: "Orders ship within 2 business days. Tracking is emailed when the order dispatches.",
    tags: ["shipping", "delivery", "tracking"],
  },
  {
    id: "plan-tiers",
    title: "Plan tiers",
    body: "Plans are Free, Pro at 20 dollars per month, and Enterprise via sales.",
    tags: ["pricing", "plans", "billing"],
  },
];

// Look an article up by its citation id — used to verify a citation is real.
export function byId(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}
