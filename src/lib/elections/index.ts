// Ponto único de acesso aos resultados.
// A fonte é escolhida por VITE_ELECTION_SOURCE: "official" (padrão, TSE) ou "demo" (fictícios).
// Nunca há fallback automático de uma fonte para a outra.
import type { CandidateResult } from "@/components/election/candidate-card";
import { candidates as demoCandidates } from "@/lib/election-demo";
import { demoProvider, DEMO_ELECTION } from "./demo-provider";
import { scopeLabel } from "./geography";
import { tseProvider, TSE_ELECTIONS } from "./tse-provider";
import type { ElectionResultsProvider, GeoScope, PresidentialElection, ResultSnapshot } from "./types";

export * from "./types";
export * from "./geography";
export * from "./compare";
export { TseUnavailableError } from "./tse-provider";

export type SourceKey = "official" | "demo";

export function resolveSourceKey(value: string | undefined): SourceKey {
  return value === "demo" ? "demo" : "official";
}

export const activeSourceKey: SourceKey = resolveSourceKey(
  import.meta.env.VITE_ELECTION_SOURCE as string | undefined,
);

export const providers: Record<SourceKey, ElectionResultsProvider> = {
  official: tseProvider,
  demo: demoProvider,
};
export const activeProvider = providers[activeSourceKey];

export const availableElections: Record<SourceKey, PresidentialElection[]> = {
  official: TSE_ELECTIONS,
  demo: [DEMO_ELECTION],
};

const candidateClasses = ["candidate-a", "candidate-b", "candidate-c", "candidate-d"];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")).toUpperCase();
}

export interface ResultsView {
  label: string;
  total: number;
  isSimulated: boolean;
  pollsCountedPercent?: number;
  updatedAt?: string;
  sourceLabel: string;
  sourceUrl?: string;
  candidates: CandidateResult[];
}

/** Modelo pronto para a tela (cards e painel), a partir de qualquer snapshot. */
export function toResultsView(snap: ResultSnapshot): ResultsView {
  const isSimulated = snap.source.kind === "simulated";
  const sorted = [...snap.results].sort((a, b) => b.votes - a.votes);
  const candidates: CandidateResult[] = sorted.map((r, i) => {
    const c = snap.candidates.find((x) => x.id === r.candidateId);
    const demo = isSimulated ? demoCandidates.find((x) => x.id === r.candidateId) : undefined;
    const name = c?.name ?? r.candidateId;
    const party = c?.party.acronym ?? c?.party.name ?? "";
    return {
      id: r.candidateId,
      name,
      party: c ? `${party} · ${c.number}` : "",
      votes: r.votes,
      percent: r.percent,
      className: demo?.className ?? candidateClasses[Math.min(i, 3)]!,
      initials: demo?.initials ?? initials(name),
    };
  });
  return {
    label: scopeLabel(snap.scope),
    total: snap.progress.totalVotes ?? 0,
    isSimulated,
    pollsCountedPercent: snap.progress.pollsCountedPercent,
    updatedAt: snap.progress.updatedAt,
    sourceLabel: snap.source.label,
    sourceUrl: snap.source.kind === "official" ? snap.source.url : undefined,
    candidates,
  };
}

export async function getResultsView(
  election: PresidentialElection,
  scope: GeoScope,
  provider: ElectionResultsProvider = activeProvider,
): Promise<ResultsView | null> {
  const snap = await provider.getSnapshot(election, scope);
  return snap ? toResultsView(snap) : null;
}
