// Ponto único de acesso aos resultados. Para usar a fonte oficial,
// troque `activeProvider` por um provedor que implemente ElectionResultsProvider.
import type { CandidateResult } from "@/components/election/candidate-card";
import { candidates as demoCandidates } from "@/lib/election-demo";
import { demoProvider, getDemoSnapshot } from "./demo-provider";
import { scopeLabel } from "./geography";
import type { GeoScope } from "./types";

export * from "./types";
export * from "./geography";
export * from "./compare";

export const activeProvider = demoProvider;

/** Modelo pronto para a tela (cards e painel). */
export function getResultsView(scope: GeoScope) {
  const snap = getDemoSnapshot(scope);
  const candidates: CandidateResult[] = snap.results.map((r) => {
    const c = snap.candidates.find((x) => x.id === r.candidateId);
    const style = demoCandidates.find((x) => x.id === r.candidateId);
    return {
      id: r.candidateId,
      name: c?.name ?? r.candidateId,
      party: c ? `${c.party.name} · ${c.number}` : "",
      votes: r.votes,
      percent: r.percent,
      className: style?.className ?? "candidate-d",
      initials: style?.initials ?? "",
    };
  });
  return {
    label: scopeLabel(scope),
    total: snap.progress.totalVotes ?? 0,
    isSimulated: snap.source.kind === "simulated",
    candidates,
  };
}
