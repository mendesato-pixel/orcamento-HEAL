// Tema comum dos gráficos (Recharts). Cores por papel, definidas em styles.css.
import type { ReactNode } from "react";
import { reais } from "../utils/formato";

export const COR = {
  despesa: "var(--serie-1)",
  investimento: "var(--serie-2)",
  vaga: "var(--serie-3)",
  neutro: "var(--serie-neutra)",
  grade: "var(--grade)",
  eixo: "var(--texto-3)",
  positivo: "var(--div-pos)",
  negativo: "var(--div-neg)",
};

export const eixo = { stroke: COR.eixo, fontSize: 12, tickLine: false, axisLine: false } as const;

interface ItemTooltip { name?: string; value?: number; color?: string; dataKey?: string | number; payload?: Record<string, unknown> }

/** Tooltip padrão: título + uma linha por série, valores em R$. */
export function DicaGrafico({ active, payload, label, formato = reais, total }: {
  active?: boolean; payload?: ItemTooltip[]; label?: ReactNode; formato?: (v: number) => string; total?: boolean;
}) {
  if (!active || !payload?.length) return null;
  const soma = payload.reduce((a, p) => a + (Number(p.value) || 0), 0);
  return (
    <div className="dica">
      <div className="dica-titulo">{label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="dica-linha">
          <span className="marca" style={{ background: p.color }} />
          <span>{p.name}</span>
          <strong>{formato(Number(p.value) || 0)}</strong>
        </div>
      ))}
      {total && payload.length > 1 && (
        <div className="dica-linha dica-total"><span /> <span>Total</span><strong>{formato(soma)}</strong></div>
      )}
    </div>
  );
}

export function Legenda({ itens }: { itens: { nome: string; cor: string }[] }) {
  return (
    <div className="legenda">
      {itens.map((i) => (
        <span key={i.nome}><span className="marca" style={{ background: i.cor }} />{i.nome}</span>
      ))}
    </div>
  );
}
