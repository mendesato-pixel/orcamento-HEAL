import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabela, type Coluna } from "../../components/Tabela";
import { Cartao, Kpi, Pagina, Selo } from "../../components/ui";
import { COR, eixo } from "../../components/graficos";
import { useDados } from "../../core/acesso/contexto";
import type { Pedido } from "../../types";
import { agrupar, pct, reais, reaisCurto, soma } from "../../utils/formato";

type Linha = Pedido & { var_abs: number; var_pct: number };

export default function Comparativo() {
  const { pedidos } = useDados();
  const [limite, setLimite] = useState(0.1);

  const r = useMemo(() => {
    const itens: Linha[] = pedidos.filter((p) => p.valor_2026 != null && p.valor_2026 > 0).map((p) => ({
      ...p, var_abs: p.total_2027 - p.valor_2026!, var_pct: p.total_2027 / p.valor_2026! - 1,
    }));
    const b26 = soma(itens, (p) => p.valor_2026!), b27 = soma(itens, (p) => p.total_2027);
    const grupos = [...agrupar(itens, (p) => p.grupo_gasto)].map(([g, ps]) => {
      const a = soma(ps, (p) => p.valor_2026!), b = soma(ps, (p) => p.total_2027);
      return { grupo: g, var_abs: b - a, var_pct: b / a - 1, v26: a, v27: b };
    }).sort((a, b) => b.var_abs - a.var_abs);
    return { itens, b26, b27, grupos };
  }, [pedidos]);

  const acima = r.itens.filter((p) => p.var_pct > limite);
  const excesso = soma(acima, (p) => p.total_2027 - p.valor_2026! * (1 + limite));

  const colunas: Coluna<Linha>[] = [
    { id: "item", titulo: "Item", valor: (p) => p.item_descricao, render: (p) => <span className="celula-item">{p.item_descricao}</span> },
    { id: "setor", titulo: "Setor", valor: (p) => p.setor },
    { id: "fonte", titulo: "Fonte do valor", valor: (p) => p.fonte_valor },
    { id: "v26", titulo: "Valor 2026", valor: (p) => p.valor_2026, render: (p) => reais(p.valor_2026), num: true },
    { id: "v27", titulo: "Total 2027", valor: (p) => p.total_2027, render: (p) => reais(p.total_2027), num: true },
    { id: "abs", titulo: "Variação R$", valor: (p) => p.var_abs, render: (p) => reais(p.var_abs), num: true },
    { id: "pct", titulo: "Variação %", valor: (p) => p.var_pct, num: true,
      render: (p) => <Selo tom={p.var_pct > limite ? "critico" : p.var_pct < 0 ? "bom" : "neutro"}>{p.var_pct > 0 ? "+" : ""}{pct(p.var_pct)}</Selo> },
  ];

  return (
    <Pagina titulo="2026 × 2027"
      resumo={<>Compara itens de continuidade que têm <code>valor_2026</code> informado. Mostra onde o pedido de 2027 cresce acima de um limite de referência: candidatos a renegociação ou revisão de escopo.</>}
      acoes={
        <label className="seletor-inline">Limite de referência
          <select value={limite} onChange={(e) => setLimite(Number(e.target.value))}>
            {[0.05, 0.1, 0.15, 0.2].map((x) => <option key={x} value={x}>{pct(x, 0)}</option>)}
          </select>
        </label>
      }>
      <div className="kpis">
        <Kpi rotulo="Itens comparáveis" valor={String(r.itens.length)} detalhe={`${pct(r.itens.length / (pedidos.length || 1), 0)} dos pedidos`} />
        <Kpi rotulo="Base 2026" valor={reaisCurto(r.b26)} detalhe="mesmos itens" />
        <Kpi rotulo="Pedido 2027" valor={reaisCurto(r.b27)} detalhe={`${r.b27 >= r.b26 ? "+" : ""}${pct(r.b27 / (r.b26 || 1) - 1)} sobre 2026`} tom={r.b27 / (r.b26 || 1) - 1 > limite ? "critico" : "atencao"} />
        <Kpi rotulo={`Acima de ${pct(limite, 0)}`} valor={String(acima.length)} detalhe={<>excedente de <strong>{reais(excesso)}</strong> sobre o limite</>} tom="critico" />
      </div>

      <Cartao titulo="Variação por grupo de gasto" sub="Diferença em R$ entre 2027 e 2026 nos itens comparáveis. Passe o mouse para ver os valores.">
        <ResponsiveContainer width="100%" height={Math.max(200, r.grupos.length * 36 + 30)}>
          <BarChart data={r.grupos} layout="vertical" margin={{ left: 8, right: 24 }}>
            <CartesianGrid horizontal={false} stroke={COR.grade} />
            <XAxis type="number" {...eixo} tickFormatter={reaisCurto} />
            <YAxis type="category" dataKey="grupo" {...eixo} width={170} />
            <ReferenceLine x={0} stroke={COR.eixo} />
            <Tooltip cursor={{ fill: "var(--hover)" }} content={({ active, payload }) => {
              const g = payload?.[0]?.payload as (typeof r.grupos)[number] | undefined;
              if (!active || !g) return null;
              return (
                <div className="dica">
                  <div className="dica-titulo">{g.grupo}</div>
                  <div className="dica-linha"><span /><span>2026</span><strong>{reais(g.v26)}</strong></div>
                  <div className="dica-linha"><span /><span>2027</span><strong>{reais(g.v27)}</strong></div>
                  <div className="dica-linha dica-total"><span /><span>Variação</span><strong>{reais(g.var_abs)} ({pct(g.var_pct)})</strong></div>
                </div>
              );
            }} />
            <Bar dataKey="var_abs" name="Variação" radius={4} maxBarSize={22}>
              {r.grupos.map((g) => <Cell key={g.grupo} fill={g.var_abs >= 0 ? COR.positivo : COR.negativo} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Cartao>

      <Cartao titulo="Itens comparáveis" sub={`Ordenados pela maior variação em R$. Em vermelho, acima de ${pct(limite, 0)}.`}>
        <Tabela linhas={r.itens} colunas={colunas} chave={(p) => p.id} ordemInicial={{ id: "abs", desc: true }} porPagina={15} />
      </Cartao>
    </Pagina>
  );
}
