// Geografia oficial (IBGE): nomes e regiões das UFs. Independe da fonte de resultados.
import type { GeoScope, Region, StateCode } from "./types";

export const regions: Region[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

export const regionClass: Record<Region, string> = {
  Norte: "region-north",
  Nordeste: "region-northeast",
  "Centro-Oeste": "region-central",
  Sudeste: "region-southeast",
  Sul: "region-south",
};

export const states: Record<StateCode, { name: string; region: Region }> = {
  AC: { name: "Acre", region: "Norte" },
  AL: { name: "Alagoas", region: "Nordeste" },
  AP: { name: "Amapá", region: "Norte" },
  AM: { name: "Amazonas", region: "Norte" },
  BA: { name: "Bahia", region: "Nordeste" },
  CE: { name: "Ceará", region: "Nordeste" },
  DF: { name: "Distrito Federal", region: "Centro-Oeste" },
  ES: { name: "Espírito Santo", region: "Sudeste" },
  GO: { name: "Goiás", region: "Centro-Oeste" },
  MA: { name: "Maranhão", region: "Nordeste" },
  MT: { name: "Mato Grosso", region: "Centro-Oeste" },
  MS: { name: "Mato Grosso do Sul", region: "Centro-Oeste" },
  MG: { name: "Minas Gerais", region: "Sudeste" },
  PA: { name: "Pará", region: "Norte" },
  PB: { name: "Paraíba", region: "Nordeste" },
  PR: { name: "Paraná", region: "Sul" },
  PE: { name: "Pernambuco", region: "Nordeste" },
  PI: { name: "Piauí", region: "Nordeste" },
  RJ: { name: "Rio de Janeiro", region: "Sudeste" },
  RN: { name: "Rio Grande do Norte", region: "Nordeste" },
  RS: { name: "Rio Grande do Sul", region: "Sul" },
  RO: { name: "Rondônia", region: "Norte" },
  RR: { name: "Roraima", region: "Norte" },
  SC: { name: "Santa Catarina", region: "Sul" },
  SP: { name: "São Paulo", region: "Sudeste" },
  SE: { name: "Sergipe", region: "Nordeste" },
  TO: { name: "Tocantins", region: "Norte" },
};

export function toScope(region: Region | null, state: StateCode | null): GeoScope {
  if (state) return { level: "state", state };
  if (region) return { level: "region", region };
  return { level: "country" };
}

export function scopeLabel(scope: GeoScope): string {
  if (scope.level === "state") return states[scope.state]?.name ?? scope.state;
  if (scope.level === "region") return scope.region;
  return "Brasil";
}
