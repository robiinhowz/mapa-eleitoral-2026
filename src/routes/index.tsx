import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowDown,
  CheckCheck,
  Clock3,
  Info,
  Loader2,
  RefreshCw,
  Vote,
  Globe2,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/election/page-shell";
import { BrazilMap } from "@/components/election/brazil-map";
import { CandidateCard } from "@/components/election/candidate-card";
import { RegionFilter } from "@/components/election/region-filter";
import { PremiumRegionCard } from "@/components/election/premium-region-card";
import { formatNumber, formatPercent } from "@/lib/election-demo";
import {
  activeSourceKey,
  availableElections,
  getResultsView,
  scopeLabel,
  states,
  toScope,
  TseUnavailableError,
  type Region,
  type Round,
} from "@/lib/elections";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa Eleitoral — Eleições presidenciais 2026" },
      {
        name: "description",
        content:
          "Explore os resultados presidenciais de 2026 por estado e região, a partir dos arquivos públicos do TSE. Projeto independente.",
      },
      { property: "og:title", content: "Mapa Eleitoral — Eleições 2026" },
      {
        property: "og:description",
        content: "Mapa interativo do Brasil com os resultados presidenciais de 2026 por estado e região.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function formatUpdated(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Index() {
  const [region, setRegion] = useState<Region | null>(null);
  const [state, setState] = useState<string | null>(null);
  const elections = availableElections[activeSourceKey];
  const [round, setRound] = useState<Round>(elections[0]!.round);
  const election = elections.find((e) => e.round === round) ?? elections[0]!;
  const scope = toScope(region, state);
  const simulated = activeSourceKey === "demo";
  const query = useQuery({
    queryKey: ["results", activeSourceKey, election.year, election.round, scope],
    queryFn: () => getResultsView(election, scope),
    retry: 1,
    staleTime: 60_000,
  });
  const result = query.data ?? null;
  const label = scopeLabel(scope);

  function selectRegion(r: Region | null) {
    setRegion(r);
    setState(null);
  }
  function selectState(code: string | null) {
    setState(code);
    if (code) {
      const info = states[code];
      if (info) setRegion(info.region);
    }
  }
  const dash = <span aria-label="indisponível">—</span>;

  return (
    <PageShell simulated={simulated}>
      <div className="page-title-row">
        <div>
          <div className="eyebrow">
            <span /> ELEIÇÕES PRESIDENCIAIS 2026
          </div>
          <h1>Cada voto. Um retrato do Brasil.</h1>
          <p>Um panorama da votação, do país ao seu estado.</p>
        </div>
        <div className="election-badge">
          <Vote size={18} />
          <span>
            Presidente da República
            <small>
              {round}º turno · {simulated ? "cenário demonstrativo" : "fonte: TSE"}
            </small>
          </span>
        </div>
      </div>
      {elections.length > 1 && (
        <div className="region-filter" role="group" aria-label="Selecionar turno">
          {elections.map((e) => (
            <Button
              key={e.round}
              variant="ghost"
              className={`region-option ${round === e.round ? "active" : ""}`}
              aria-pressed={round === e.round}
              onClick={() => setRound(e.round)}
            >
              {e.round}º turno
            </Button>
          ))}
        </div>
      )}
      <section className="stats-band" aria-label="Resumo da apuração" aria-busy={query.isFetching}>
        <div className="stat-block">
          <span className="stat-icon">
            <CheckCheck />
          </span>
          <div>
            <p>
              Seções totalizadas
              {simulated && <span className="illustrative-label">ILUSTRATIVO</span>}
            </p>
            <strong>
              {result?.pollsCountedPercent !== undefined ? (
                <>
                  {formatPercent(result.pollsCountedPercent)}
                  <span>%</span>
                </>
              ) : simulated ? (
                <>
                  87,42<span>%</span>
                </>
              ) : (
                dash
              )}
            </strong>
            <div className="stat-progress">
              <i
                style={{
                  width: `${result?.pollsCountedPercent ?? (simulated ? 87.42 : 0)}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="stat-block">
          <span className="stat-icon">
            <Vote />
          </span>
          <div>
            <p>Votos válidos</p>
            <strong>{result ? formatNumber(result.total) : dash}</strong>
            <small>
              {label} · {simulated ? "dados fictícios" : "TSE"}
            </small>
          </div>
        </div>
        <div className="stat-block">
          <span className="stat-icon">
            <Clock3 />
          </span>
          <div>
            <p>{simulated ? "Horário ilustrativo" : "Totalização informada pelo TSE"}</p>
            <strong>
              {simulated ? (
                <>
                  20:45<span className="time-zone"> BRT</span>
                </>
              ) : result?.updatedAt ? (
                <>
                  {formatUpdated(result.updatedAt)}
                  <span className="time-zone"> BRT</span>
                </>
              ) : (
                dash
              )}
            </strong>
            <small>
              {simulated
                ? "Exemplo estático · sem atualização automática"
                : "Consulta feita ao abrir a página"}
            </small>
          </div>
        </div>
      </section>
      <div className="explore-heading">
        <h2>
          <Globe2 size={18} />
          Explore os resultados
        </h2>
        <span>
          Brasil <ChevronRight size={13} />
          {state ? label : (region ?? "Todas as regiões")}
        </span>
      </div>
      <RegionFilter value={region} onChange={selectRegion} />
      <div className="results-grid">
        <section className="map-section">
          <div className="section-heading">
            <div>
              <h2>O Brasil nas urnas</h2>
              <p>Um país, cinco regiões, milhões de escolhas.</p>
            </div>
            <label className="state-select-label">
              <span className="sr-only">Selecionar estado</span>
              <select
                aria-label="Selecionar estado"
                value={state ?? ""}
                onChange={(e) => selectState(e.target.value || null)}
              >
                <option value="">Todos os estados</option>
                {Object.entries(states)
                  .filter(([, s]) => !region || s.region === region)
                  .sort((a, b) => a[1].name.localeCompare(b[1].name, "pt-BR"))
                  .map(([code, s]) => (
                    <option key={code} value={code}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <BrazilMap region={region} state={state} onSelect={selectState} />
          <div className="map-note">
            <Info size={14} />
            <span>As cores identificam regiões, não candidatos ou vencedores.</span>
          </div>
        </section>
        <section className="candidates-section" aria-live="polite">
          <div className="section-heading">
            <div>
              <h2>
                Candidatos{" "}
                {result && <span className="count-badge">{result.candidates.length}</span>}
              </h2>
              <p>
                {label} · {simulated ? "votos válidos fictícios" : "votos válidos · TSE"}
              </p>
            </div>
            <span className="candidate-sort">
              <ArrowDown size={13} />
              Mais votados
            </span>
          </div>
          {query.isPending ? (
            <div className="results-state" role="status">
              <Loader2 className="spin" size={22} />
              <p>Carregando resultados {simulated ? "de demonstração" : "do TSE"}…</p>
            </div>
          ) : query.isError ? (
            <div className="results-state results-error" role="alert">
              <AlertTriangle size={22} />
              <p>
                {query.error instanceof TseUnavailableError
                  ? query.error.message
                  : "Não foi possível carregar os resultados."}{" "}
                Nenhum número foi exibido no lugar.
              </p>
              <Button variant="outline" size="sm" onClick={() => query.refetch()}>
                <RefreshCw /> Tentar novamente
              </Button>
            </div>
          ) : !result ? (
            <div className="results-state" role="status">
              <Inbox size={22} />
              <p>
                O TSE ainda não publicou resultados do {round}º turno para {label}.
              </p>
            </div>
          ) : (
            <div className="candidate-list">
              {result.candidates.map((c, i) => (
                <CandidateCard key={c.id} candidate={c} rank={i + 1} />
              ))}
            </div>
          )}
          <p className="candidate-disclaimer">
            {simulated
              ? "Nomes, partidos e retratos são fictícios."
              : "Dados lidos dos arquivos públicos do TSE. Confira sempre em resultados.tse.jus.br."}
          </p>
        </section>
      </div>
      <div className="lower-grid">
        <PremiumRegionCard />
        <aside className="advert-area" aria-label="Espaço reservado para publicidade">
          <span>PUBLICIDADE</span>
          <div>
            <span className="advert-mark">+</span>
            <p>
              Espaço reservado
              <br />
              para anúncios
            </p>
            <small>Sem interferir na sua leitura.</small>
          </div>
          <span>FORMATO DISCRETO</span>
        </aside>
      </div>
    </PageShell>
  );
}
