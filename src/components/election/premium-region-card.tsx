import { Link } from "@tanstack/react-router";
import { ArrowUpRight, History, Percent, Repeat2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Repeat2, label: "Comparação entre os turnos de 2026" },
  { icon: History, label: "Comparação com o 2º turno presidencial de 2022" },
  { icon: Scale, label: "Diferenças absolutas de votos por região" },
  { icon: Percent, label: "Variações em pontos percentuais por região" },
];

export function PremiumRegionCard() {
  return (
    <section className="premium-card" aria-labelledby="premium-card-title">
      <span className="premium-card-strip" aria-hidden="true">
        <i className="region-north" />
        <i className="region-northeast" />
        <i className="region-central" />
        <i className="region-southeast" />
        <i className="region-south" />
      </span>
      <div className="premium-card-top">
        <span className="premium-eyebrow">
          ANÁLISE REGIONAL MAIS PROFUNDA <span className="premium-tag">PREMIUM</span>
        </span>
        <h2 id="premium-card-title">Entenda como os votos mudam por região</h2>
        <p>Do país ao seu estado, com as diferenças de uma eleição para outra.</p>
      </div>
      <ul className="premium-benefits">
        {benefits.map(({ icon: Icon, label }) => (
          <li key={label}>
            <span className="premium-benefit-icon">
              <Icon size={13} />
            </span>
            {label}
          </li>
        ))}
      </ul>
      <div className="premium-card-foot">
        <span className="premium-card-price">
          <strong>R$ 5</strong>
          <small>pagamento único</small>
        </span>
        <Button asChild variant="outline" className="premium-card-cta">
          <Link to="/comparacao">
            Ver prévia visual <ArrowUpRight size={14} />
          </Link>
        </Button>
      </div>
      <p className="premium-card-note">
        Prévia apenas visual · dados fictícios · nenhuma cobrança nesta etapa
      </p>
    </section>
  );
}
