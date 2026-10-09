export type Region = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
export const regions: Region[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
export const regionClass: Record<Region, string> = {
  Norte: "region-north",
  Nordeste: "region-northeast",
  "Centro-Oeste": "region-central",
  Sudeste: "region-southeast",
  Sul: "region-south",
};
export const stateInfo: Record<string, { name: string; region: Region; weight: number }> = {
  AC: { name: "Acre", region: "Norte", weight: 0.004 },
  AL: { name: "Alagoas", region: "Nordeste", weight: 0.016 },
  AP: { name: "Amapá", region: "Norte", weight: 0.004 },
  AM: { name: "Amazonas", region: "Norte", weight: 0.018 },
  BA: { name: "Bahia", region: "Nordeste", weight: 0.072 },
  CE: { name: "Ceará", region: "Nordeste", weight: 0.044 },
  DF: { name: "Distrito Federal", region: "Centro-Oeste", weight: 0.016 },
  ES: { name: "Espírito Santo", region: "Sudeste", weight: 0.02 },
  GO: { name: "Goiás", region: "Centro-Oeste", weight: 0.035 },
  MA: { name: "Maranhão", region: "Nordeste", weight: 0.034 },
  MT: { name: "Mato Grosso", region: "Centro-Oeste", weight: 0.017 },
  MS: { name: "Mato Grosso do Sul", region: "Centro-Oeste", weight: 0.014 },
  MG: { name: "Minas Gerais", region: "Sudeste", weight: 0.106 },
  PA: { name: "Pará", region: "Norte", weight: 0.039 },
  PB: { name: "Paraíba", region: "Nordeste", weight: 0.02 },
  PR: { name: "Paraná", region: "Sul", weight: 0.059 },
  PE: { name: "Pernambuco", region: "Nordeste", weight: 0.047 },
  PI: { name: "Piauí", region: "Nordeste", weight: 0.016 },
  RJ: { name: "Rio de Janeiro", region: "Sudeste", weight: 0.084 },
  RN: { name: "Rio Grande do Norte", region: "Nordeste", weight: 0.017 },
  RS: { name: "Rio Grande do Sul", region: "Sul", weight: 0.059 },
  RO: { name: "Rondônia", region: "Norte", weight: 0.008 },
  RR: { name: "Roraima", region: "Norte", weight: 0.003 },
  SC: { name: "Santa Catarina", region: "Sul", weight: 0.039 },
  SP: { name: "São Paulo", region: "Sudeste", weight: 0.201 },
  SE: { name: "Sergipe", region: "Nordeste", weight: 0.011 },
  TO: { name: "Tocantins", region: "Norte", weight: 0.008 },
};
export const TOTAL_VOTES = 98764320;
export const candidates = [
  {
    id: "helena",
    name: "Helena Costa",
    party: "Partido A · 10",
    percent: 46.82,
    className: "candidate-a",
    initials: "HC",
  },
  {
    id: "rafael",
    name: "Rafael Mendes",
    party: "Partido B · 20",
    percent: 41.35,
    className: "candidate-b",
    initials: "RM",
  },
  {
    id: "marina",
    name: "Marina Oliveira",
    party: "Partido C · 30",
    percent: 8.64,
    className: "candidate-c",
    initials: "MO",
  },
  {
    id: "pedro",
    name: "Pedro Santos",
    party: "Partido D · 40",
    percent: 3.19,
    className: "candidate-d",
    initials: "PS",
  },
];
export const regionalShares: Record<Region, number[]> = {
  Norte: [48.2, 39.5, 9.1, 3.2],
  Nordeste: [57.8, 31.4, 7.9, 2.9],
  "Centro-Oeste": [39.6, 48.2, 8.8, 3.4],
  Sudeste: [44.2, 43.6, 9, 3.2],
  Sul: [36.5, 51.9, 8.2, 3.4],
};
export const formatNumber = (value: number) => Math.round(value).toLocaleString("pt-BR");
export const formatPercent = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function getResults(region: Region | null, state: string | null) {
  const selected = state ? stateInfo[state] : undefined;
  const scope = selected?.region ?? region;
  const weight =
    selected?.weight ??
    (scope
      ? Object.values(stateInfo)
          .filter((s) => s.region === scope)
          .reduce((sum, s) => sum + s.weight, 0)
      : 1);
  const total = Math.round(TOTAL_VOTES * weight);
  const shares = scope ? regionalShares[scope] : candidates.map((c) => c.percent);
  return {
    total,
    label: selected?.name ?? region ?? "Brasil",
    candidates: candidates.map((c, i) => ({
      ...c,
      percent: shares[i] ?? c.percent,
      votes: Math.round((total * (shares[i] ?? c.percent)) / 100),
    })),
  };
}
