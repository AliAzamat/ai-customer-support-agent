// An eval case is a question with an expected outcome we can check the agent
// against. This is the agent's regression test suite.
export interface EvalCase {
  id: string;
  question: string;
  expectCitation: string;   // the article id a correct answer should cite
  mustInclude: string[];    // substrings a correct answer must contain
  shouldRefuse?: boolean;   // true when the right answer is "I don't know"
}

export const CASES: EvalCase[] = [
  {
    id: "refund-basic",
    question: "How long do I have to get a refund?",
    expectCitation: "refund-window",
    mustInclude: ["30 days"],
  },
  {
    id: "shipping-basic",
    question: "When will my order ship?",
    expectCitation: "shipping-times",
    mustInclude: ["2 business days"],
  },
  {
    id: "out-of-scope",
    question: "What is the airspeed velocity of an unladen swallow?",
    expectCitation: "",
    mustInclude: [],
    shouldRefuse: true,
  },
];
