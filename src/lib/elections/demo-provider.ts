// Provedor SIMULADO: reaproveita os dados fictícios de election-demo.ts.
// Só existe o 1º turno de 2026 fictício; nenhum resultado de 2022 ou 2º turno é inventado.
import { candidates, getResults, TOTAL_VOTES } from "@/lib/election-demo";
import type { ElectionResultsProvider, GeoScope, PresidentialElection, ResultSnapshot } from "./types";
import { states } from "./geography";

export const DEMO_ELECTION: PresidentialElection = { office: "presidente", year: 2026, round: 1 };

const source = {
  kind: "simulated",
  label: "Dados fictícios — demonstração visual, não representam a apuração oficial",
} as const;

export function getDemoSnapshot(scope: GeoScope): ResultSnapshot {
  const region = scope.level === "region" ? scope.region : null;
  const state = scope.level === "state" ? scope.state : null;
  const r = getResults(
    state ? (states[state]?.region ?? null) : region,
    state,
  );
  return {
    election: DEMO_ELECTION,
    scope,
    source,
    candidates: candidates.map((c) => {
      const [partyName, number] = c.party.split(" · ");
      return { id: c.id, name: c.name, number: Number(number), party: { name: partyName } };
    }),
    results: r.candidates.map((c) => ({ candidateId: c.id, votes: c.votes, percent: c.percent })),
    progress: {
      totalVotes: scope.level === "country" ? TOTAL_VOTES : r.total,
      pollsCountedPercent: 87.42,
      // Horário ilustrativo (estático); não é uma atualização real.
      updatedAt: undefined,
    },
  };
}

export const demoProvider: ElectionResultsProvider = {
  source,
  listElections: async () => [DEMO_ELECTION],
  getSnapshot: async (election, scope) =>
    election.year === DEMO_ELECTION.year && election.round === DEMO_ELECTION.round
      ? getDemoSnapshot(scope)
      : null,
};
