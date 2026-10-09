import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>
            mapa<span className="text-primary">eleitoral</span>
            <small>ELEIÇÕES 2026</small>
          </span>
        </Link>
        <nav aria-label="Navegação principal">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "nav-active" }}>
            Resultados
          </Link>
          <Link to="/comparacao" activeProps={{ className: "nav-active" }}>
            Comparação histórica <span className="premium-tag">PREMIUM</span>
          </Link>
          <Link to="/sobre" activeProps={{ className: "nav-active" }}>
            Sobre o projeto
          </Link>
        </nav>
        <span className="independent">
          <ShieldCheck size={15} /> Ferramenta independente
        </span>
        <Button asChild variant="outline" className="header-premium">
          <Link to="/comparacao">
            Conhecer Premium <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </header>
  );
}
