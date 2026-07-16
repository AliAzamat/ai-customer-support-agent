import { runSuite, CaseResult } from "./run";

// A hallucination here = a non-refused answer that failed faithfulness or
// cited the wrong source. We measure it and gate on it.
export interface Report {
  total: number;
  passed: number;
  passRate: number;
  failures: CaseResult[];
}

export function summarize(results: CaseResult[]): Report {
  const passed = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed,
    passRate: results.length ? passed / results.length : 0,
    failures: results.filter((r) => !r.passed),
  };
}

// The GATE: run the suite, demand a minimum pass rate, exit non-zero on a
// regression so CI fails the build and the change never ships.
const MIN_PASS_RATE = 1.0; // a support agent must pass every grounding case

export async function gate(): Promise<void> {
  const report = summarize(await runSuite());
  console.log(`evals: ${report.passed}/${report.total} (${(report.passRate * 100).toFixed(0)}%)`);
  for (const f of report.failures) console.error(`  FAIL ${f.id}: ${f.reasons.join("; ")}`);

  if (report.passRate < MIN_PASS_RATE) {
    console.error(`BLOCKED: pass rate ${report.passRate} below ${MIN_PASS_RATE}`);
    process.exit(1); // non-zero exit fails CI
  }
  console.log("PASSED: safe to ship");
}

if (require.main === module) gate();
