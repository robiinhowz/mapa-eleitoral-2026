// Provedor OFICIAL: lê os arquivos públicos de divulgação do TSE (resultados.tse.jus.br).
// Caminho confirmado no catálogo oficial (comum/config/ele-c.json, tipo "e"):
//   <base>/oficial/<ciclo>/<cd_eleicao>/dados/<uf>/<uf>-c<cargo>-e<cd_eleicao>-u.json
// Códigos 2026 (catálogo oficial): presidente 1º turno = 6257, 2º turno = 6258, cargo 0001.
// Nunca recorre a dados fictícios: em falha, lança erro para a tela informar.
import { regions, states } from "./geography";
import type {
  Candidate,
  CandidateVotes,
  ElectionResultsProvider,
  GeoScope,
  PresidentialElection,
  ResultSnapshot,
} from "./types";

export const TSE_BASE = "https://resultados.tse.jus.br/oficial";

const ELECTION_CODES: Record<number, Partial<Record<1 | 2, number>>> = {
  2026: { 1: 6257, 2: 6258 },
};

export const TSE_ELECTIONS: PresidentialElection[] = [
  { office: "presidente", year: 2026, round: 1 },
  { office: "presidente", year: 2026, round: 2 },
];

const source = {
  kind: "official",
  label: "Resultados oficiais divulgados pelo TSE",
  provider: "Tribunal Superior Eleitoral",
  url: "https://resultados.tse.jus.br/",
} as const;

export class TseUnavailableError extends Error {}

export function tseResultUrl(election: PresidentialElection, uf: string): string {
  const code = ELECTION_CODES[election.year]?.[election.round];
  if (!code) throw new TseUnavailableError("Eleição sem código oficial conhecido.");
  const u = uf.toLowerCase();
  const e = String(code).padStart(6, "0");
  return `${TSE_BASE}/ele${election.year}/${code}/dados/${u}/${u}-c0001-e${e}-u.json`;
}

/* ---------- formato bruto (somente campos usados) ---------- */
type RawCand = { n: string; sqcand: string; nm: string; nmu?: string; vap: string; pvapn?: string };
type RawPar = { sg: string; nm: string; cand?: RawCand[] };
export type RawTseFile = {
  dg?: string;
  hg?: string;
  dt?: string;
  ht?: string;
  tf?: string;
  carg?: { agr?: { par?: RawPar[] }[] }[];
  s?: { ts?: string; st?: string; pst?: string };
  v?: { vv?: string };
};

const num = (s: string | undefined) => {
  const n = Number(String(s ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/** "15/10/2026" + "09:38:12" (horário de Brasília) → ISO 8601. */
export function tseDateToIso(d?: string, h?: string): string | undefined {
  const m = d?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m || !h || !/^\d{2}:\d{2}:\d{2}$/.test(h)) return undefined;
  return `${m[3]}-${m[2]}-${m[1]}T${h}-03:00`;
}

export interface ParsedTse {
  candidates: Candidate[];
  results: CandidateVotes[];
  validVotes: number;
  sections: number;
  sectionsCounted: number;
  updatedAt?: string;
  final: boolean;
}

export function parseTseFile(raw: RawTseFile): ParsedTse {
  const candidates: Candidate[] = [];
  const results: CandidateVotes[] = [];
  for (const agr of raw.carg?.[0]?.agr ?? []) {
    for (const par of agr.par ?? []) {
      for (const c of par.cand ?? []) {
        candidates.push({
          id: c.sqcand,
          name: c.nmu || c.nm,
          number: num(c.n),
          party: { name: par.nm, acronym: par.sg },
        });
        results.push({ candidateId: c.sqcand, votes: num(c.vap), percent: num(c.pvapn) });
      }
    }
  }
  return {
    candidates,
    results,
    validVotes: num(raw.v?.vv),
    sections: num(raw.s?.ts),
    sectionsCounted: num(raw.s?.st),
    // dt/ht = momento da totalização; vazio quando nada foi totalizado.
    updatedAt: tseDateToIso(raw.dt, raw.ht),
    final: raw.tf === "s",
  };
}

/** Junta arquivos de várias UFs (abrangência por região). Percentual recalculado sobre os válidos somados. */
export function mergeParsed(list: ParsedTse[]): ParsedTse {
  const votes = new Map<string, number>();
  const cands = new Map<string, Candidate>();
  for (const p of list) {
    p.candidates.forEach((c) => cands.set(c.id, c));
    p.results.forEach((r) => votes.set(r.candidateId, (votes.get(r.candidateId) ?? 0) + r.votes));
  }
  const validVotes = list.reduce((s, p) => s + p.validVotes, 0);
  const dates = list.map((p) => p.updatedAt).filter(Boolean) as string[];
  return {
    candidates: [...cands.values()],
    results: [...votes].map(([candidateId, v]) => ({
      candidateId,
      votes: v,
      percent: validVotes ? (v / validVotes) * 100 : 0,
    })),
    validVotes,
    sections: list.reduce((s, p) => s + p.sections, 0),
    sectionsCounted: list.reduce((s, p) => s + p.sectionsCounted, 0),
    updatedAt: dates.length === list.length ? dates.sort().at(-1) : undefined,
    final: list.every((p) => p.final),
  };
}

async function fetchUf(election: PresidentialElection, uf: string, signal?: AbortSignal) {
  let res: Response;
  try {
    res = await fetch(tseResultUrl(election, uf), { signal, cache: "no-store" });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new TseUnavailableError("Não foi possível acessar o site de resultados do TSE.");
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new TseUnavailableError(`O TSE respondeu com erro (${res.status}).`);
  return parseTseFile((await res.json()) as RawTseFile);
}

export async function getTseSnapshot(
  election: PresidentialElection,
  scope: GeoScope,
  signal?: AbortSignal,
): Promise<ResultSnapshot | null> {
  const ufs =
    scope.level === "country"
      ? ["br"]
      : scope.level === "state"
        ? [scope.state]
        : Object.keys(states).filter((k) => states[k]?.region === scope.region);
  if (scope.level === "region" && !regions.includes(scope.region)) return null;
  const parsed = await Promise.all(ufs.map((uf) => fetchUf(election, uf, signal)));
  if (parsed.some((p) => p === null)) return null;
  const p = parsed.length === 1 ? parsed[0]! : mergeParsed(parsed as ParsedTse[]);
  // Arquivo publicado, mas sem nenhuma seção totalizada: não há resultado a mostrar.
  if (p.sectionsCounted === 0 || p.results.every((r) => r.votes === 0)) return null;
  return {
    election,
    scope,
    source,
    candidates: p.candidates,
    results: p.results,
    progress: {
      totalVotes: p.validVotes,
      pollsCountedPercent: p.sections ? (p.sectionsCounted / p.sections) * 100 : undefined,
      updatedAt: p.updatedAt,
    },
  };
}

export const tseProvider: ElectionResultsProvider = {
  source,
  listElections: async () => TSE_ELECTIONS,
  getSnapshot: (election, scope) => getTseSnapshot(election, scope),
};
