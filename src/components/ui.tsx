// Peças de interface reutilizáveis: cabeçalho de página, cartão, KPI, selo, gaveta.
import { useEffect, type ReactNode } from "react";
import { Icone } from "./Icone";

export function Pagina({ titulo, resumo, acoes, children }: { titulo: string; resumo?: ReactNode; acoes?: ReactNode; children: ReactNode }) {
  return (
    <div className="pagina">
      <header className="pagina-topo">
        <div>
          <h1>{titulo}</h1>
          {resumo && <p className="pagina-resumo">{resumo}</p>}
        </div>
        {acoes && <div className="pagina-acoes">{acoes}</div>}
      </header>
      {children}
    </div>
  );
}

export function Cartao({ titulo, sub, acoes, children, className = "" }: { titulo?: string; sub?: ReactNode; acoes?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`cartao ${className}`}>
      {(titulo || acoes) && (
        <div className="cartao-topo">
          <div>
            {titulo && <h2>{titulo}</h2>}
            {sub && <p className="cartao-sub">{sub}</p>}
          </div>
          {acoes}
        </div>
      )}
      {children}
    </section>
  );
}

export function Kpi({ rotulo, valor, detalhe, tom, marca }: { rotulo: string; valor: string; detalhe?: ReactNode; tom?: "bom" | "atencao" | "critico"; marca?: string }) {
  return (
    <div className="kpi">
      <div className="kpi-rotulo">
        {marca && <span className="marca" style={{ background: marca }} />}
        {rotulo}
      </div>
      <div className="kpi-valor">{valor}</div>
      {detalhe && <div className={`kpi-detalhe ${tom ? "tom-" + tom : ""}`}>{detalhe}</div>}
    </div>
  );
}

export function Selo({ children, tom = "neutro" }: { children: ReactNode; tom?: "neutro" | "despesa" | "investimento" | "vaga" | "atencao" | "critico" | "bom" }) {
  return <span className={`selo selo-${tom}`}>{children}</span>;
}

export function Gaveta({ aberta, titulo, onFechar, children }: { aberta: boolean; titulo: ReactNode; onFechar: () => void; children: ReactNode }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onFechar]);
  if (!aberta) return null;
  return (
    <div className="gaveta-fundo" onClick={onFechar}>
      <aside className="gaveta" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="gaveta-topo">
          <div className="gaveta-titulo">{titulo}</div>
          <button className="botao-icone" onClick={onFechar} aria-label="Fechar"><Icone nome="fechar" /></button>
        </div>
        <div className="gaveta-corpo">{children}</div>
      </aside>
    </div>
  );
}

export function Vazio({ texto }: { texto: string }) {
  return <div className="vazio">{texto}</div>;
}
