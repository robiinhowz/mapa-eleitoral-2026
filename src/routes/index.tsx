import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, CheckCheck, Clock3, Info, Vote, Globe2, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/election/page-shell";
import { BrazilMap } from "@/components/election/brazil-map";
import { CandidateCard } from "@/components/election/candidate-card";
import { RegionFilter } from "@/components/election/region-filter";
import { PremiumRegionCard } from "@/components/election/premium-region-card";
import { formatNumber, stateInfo } from "@/lib/election-demo";
import { getResultsView, toScope, type Region } from "@/lib/elections";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa Eleitoral — Eleições presidenciais 2026" },
      {
        name: "description",
        content:
          "Explore uma demonstração independente dos resultados presidenciais de 2026 por estado e região. Todos os dados são fictícios.",
      },
      { property: "og:title", content: "Mapa Eleitoral — Eleições 2026" },
      {
        property: "og:description",
        content:
          "Mapa interativo do Brasil e comparações regionais em uma demonstração visual com dados fictícios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
function Index() {
  const [region, setRegion] = useState<Region | null>(null);
  const [state, setState] = useState<string | null>(null);
  const result = getResultsView(toScope(region, state));
  function selectRegion(r: Region | null) {
    setRegion(r);
    setState(null);
  }
  function selectState(code: string | null) {
    setState(code);
    if (code) {
      const info = stateInfo[code];
      if (info) setRegion(info.region);
    }
  }
  return (
    <PageShell>
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
            Presidente da República<small>1º turno · cenário demonstrativo</small>
          </span>
        </div>
      </div>
      <section className="stats-band" aria-label="Resumo ilustrativo da apuração">
        <div className="stat-block">
          <span className="stat-icon">
            <CheckCheck />
          </span>
          <div>
            <p>
              Urnas apuradas <span className="illustrative-label">ILUSTRATIVO</span>
            </p>
            <strong>
              87,42<span>%</span>
            </strong>
            <div className="stat-progress">
              <i />
            </div>
          </div>
        </div>
        <div className="stat-block">
          <span className="stat-icon">
            <Vote />
          </span>
          <div>
            <p>Votos contabilizados</p>
            <strong>{formatNumber(result.total)}</strong>
            <small>{result.label} · dados fictícios</small>
          </div>
        </div>
        <div className="stat-block">
          <span className="stat-icon">
            <Clock3 />
          </span>
          <div>
            <p>Horário ilustrativo</p>
            <strong>
              20:45<span className="time-zone"> BRT</span>
            </strong>
            <small>Exemplo estático · sem atualização automática</small>
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
          {state ? result.label : (region ?? "Todas as regiões")}
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
                {Object.entries(stateInfo)
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
                Candidatos <span className="count-badge">4</span>
              </h2>
              <p>{result.label} · votos válidos fictícios</p>
            </div>
            <span className="candidate-sort">
              <ArrowDown size={13} />
              Mais votados
            </span>
          </div>
          <div className="candidate-list">
            {[...result.candidates]
              .sort((a, b) => b.percent - a.percent)
              .map((c, i) => (
                <CandidateCard key={c.id} candidate={c} rank={i + 1} />
              ))}
          </div>
          <p className="candidate-disclaimer">Nomes, partidos e retratos são fictícios.</p>
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
