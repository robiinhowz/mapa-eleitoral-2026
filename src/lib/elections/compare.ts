// Comparações entre snapshots: diferença absoluta de votos e variação em p.p.
import type { ResultComparison, ResultSnapshot } from "./types";

export function compareSnapshots(
  before: ResultSnapshot,
  after: ResultSnapshot,
): ResultComparison {
  if (before.source.kind !== after.source.kind) {
    throw new Error("Não compare dados simulados com dados oficiais.");
  }
  const ids = new Set([
    ...before.results.map((r) => r.candidateId),
    ...after.results.map((r) => r.candidateId),
  ]);
  return {
    scope: after.scope,
    before: before.election,
    after: after.election,
    deltas: [...ids].map((id) => {
      const b = before.results.find((r) => r.candidateId === id);
      const a = after.results.find((r) => r.candidateId === id);
      return {
        candidateId: id,
        before: b,
        after: a,
        voteDiff: a && b ? a.votes - b.votes : undefined,
        percentPointDiff: a && b ? Math.round((a.percent - b.percent) * 100) / 100 : undefined,
      };
    }),
  };
}

/** Comparações previstas para o recurso Premium (ainda sem dados). */
export const plannedComparisons = [
  { before: { year: 2026, round: 1 }, after: { year: 2026, round: 2 } },
  { before: { year: 2022, round: 2 }, after: { year: 2026, round: 2 } },
] as const;
