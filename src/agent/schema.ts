import { z } from "zod";

// The SHAPE we demand back. The model is non-deterministic, so its output is
// untrusted until it passes this schema.
export const AnswerSchema = z.object({
  answer: z.string().min(1),
  citations: z.array(z.string()),
  refused: z.boolean(),
});

export type Answer = z.infer<typeof AnswerSchema>;
