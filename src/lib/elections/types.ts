// Tipos reutilizáveis para resultados eleitorais (simulados ou oficiais).

export type Region = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

/** Sigla da UF, ex.: "SP". */
export type StateCode = string;

export type ElectionYear = number;
export type Round = 1 | 2;

/** Origem dos dados. "simulated" nunca deve ser misturado com "official". */
export type DataSource =
  | { kind: "simulated"; label: string }
  | { kind: "official"; label: string; provider: string; url?: string };

export interface PresidentialElection {
  office: "presidente";
  year: ElectionYear;
  round: Round;
}

/** Abrangência geográfica do resultado. */
export type GeoScope =
  | { level: "country" }
  | { level: "region"; region: Region }
  | { level: "state"; state: StateCode };

export interface Party {
  name: string;
  acronym?: string;
}

export interface Candidate {
  id: string;
  name: string;
  /** Número de urna. */
  number: number;
  party: Party;
  photoUrl?: string;
}

export interface CandidateVotes {
  candidateId: string;
  votes: number;
  /** Percentual de votos válidos (0–100). */
  percent: number;
}

export interface CountingProgress {
  /** Total de votos contabilizados, quando disponível. */
  totalVotes?: number;
  /** Percentual de urnas apuradas (0–100), quando disponível. */
  pollsCountedPercent?: number;
  /** ISO 8601 da última atualização informada pela fonte. */
  updatedAt?: string;
}

export interface ResultSnapshot {
  election: PresidentialElection;
  scope: GeoScope;
  source: DataSource;
  candidates: Candidate[];
  results: CandidateVotes[];
  progress: CountingProgress;
}

/** Comparação de um candidato entre dois snapshots (mesma abrangência). */
export interface CandidateDelta {
  candidateId: string;
  before?: CandidateVotes;
  after?: CandidateVotes;
  /** Diferença absoluta de votos (after - before). */
  voteDiff?: number;
  /** Variação em pontos percentuais (after - before). */
  percentPointDiff?: number;
}

export interface ResultComparison {
  scope: GeoScope;
  before: PresidentialElection;
  after: PresidentialElection;
  deltas: CandidateDelta[];
}

/** Contrato que qualquer fonte (demo, API própria, Lovable Cloud) deve cumprir. */
export interface ElectionResultsProvider {
  readonly source: DataSource;
  listElections(): Promise<PresidentialElection[]>;
  getSnapshot(
    election: PresidentialElection,
    scope: GeoScope,
  ): Promise<ResultSnapshot | null>;
}
