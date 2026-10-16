import type { ReactNode } from "react";
import { Info, ShieldCheck, ArrowUpRight, Landmark } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Header } from "./header";
export function PageShell({
  children,
  simulated = true,
}: {
  children: ReactNode;
  /** Mostra o aviso de dados fictícios. Desligue só quando a página usa dados oficiais. */
  simulated?: boolean;
}) {
  return (
    <>
      <Header />
      <div className="demo-notice">
        {simulated ? (
          <div>
            <Info size={16} />
            <p>
              <strong>
                Dados fictícios — demonstração visual, não representam a apuração oficial
              </strong>
            </p>
            <span>AMBIENTE DE DEMONSTRAÇÃO</span>
          </div>
        ) : (
          <div>
            <Landmark size={16} />
            <p>
              <strong>
                Fonte: arquivos públicos de resultados do TSE (resultados.tse.jus.br). Projeto
                independente, sem vínculo com o TSE.
              </strong>
            </p>
            <span>FONTE OFICIAL</span>
          </div>
        )}
      </div>
      <main className="page-main">{children}</main>
      <footer className="site-footer">
        <div>
          <span className="footer-brand">
            mapaeleitoral <small>© 2026</small>
          </span>
          <p>
            <ShieldCheck size={14} />
            Projeto independente. Sem vínculo com o TSE.
          </p>
          <Link to="/sobre">
            Transparência e metodologia <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </>
  );
}
