import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { COR, DicaGrafico, eixo } from "../../components/graficos";
import { Gaveta, Selo } from "../../components/ui";
import { CHAVES_MES, MESES, type Pedido } from "../../types";
import { numero, pct, reais, reaisCentavos } from "../../utils/formato";

export function DetalhePedido({ p, onFechar }: { p: Pedido | null; onFechar: () => void }) {
  if (!p) return null;
  const mensal = MESES.map((m, i) => ({ mes: m, valor: p[CHAVES_MES[i]] }));
  const reclass = p.tipo_informado && p.tipo_informado !== p.classificacao_final;
  const campo = (rotulo: string, valor: React.ReactNode) => (
    <div className="campo"><dt>{rotulo}</dt><dd>{valor || "–"}</dd></div>
  );
  return (
    <Gaveta aberta titulo={<><span className="id">{p.id}</span> {p.item_descricao}</>} onFechar={onFechar}>
      <div className="detalhe-total">
        <div><span>Total 2027</span><strong>{reais(p.total_2027)}</strong></div>
        {p.valor_2026 != null && (
          <div><span>Valor 2026</span><strong>{reais(p.valor_2026)}</strong><small>{p.total_2027 >= p.valor_2026 ? "+" : ""}{pct(p.total_2027 / p.valor_2026 - 1)}</small></div>
        )}
        <Selo tom={p.classificacao_final === "Despesa" ? "despesa" : "investimento"}>{p.classificacao_final}</Selo>
      </div>

      {p.alertas.length > 0 && (
        <div className="bloco-alertas">
          {p.alertas.map((a, i) => (
            <div key={i} className="alerta-item"><strong>{a.tipo}</strong><span>{a.detalhe}</span></div>
          ))}
        </div>
      )}

      <h3>Distribuição mensal</h3>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={mensal} margin={{ left: 0, right: 0, top: 4 }}>
          <XAxis dataKey="mes" {...eixo} fontSize={10} interval={0} />
          <Tooltip content={<DicaGrafico />} cursor={{ fill: "var(--hover)" }} />
          <Bar dataKey="valor" name="Valor" fill={p.classificacao_final === "Despesa" ? COR.despesa : COR.investimento} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <h3>Identificação</h3>
      <dl className="campos">
        {campo("Setor", p.setor)}
        {campo("Diretoria", p.diretoria)}
        {campo("Centro de custo", p.centro_custo_rotulo)}
        {campo("Natureza do CC", p.natureza_cc)}
        {campo("Situação", p.situacao)}
        {campo("Prioridade", p.prioridade)}
      </dl>

      <h3>Classificação</h3>
      <dl className="campos">
        {campo("Tipo informado", p.tipo_informado || "(em branco)")}
        {campo("Classificação final", p.classificacao_final)}
        {campo("Grupo de gasto", p.grupo_gasto)}
        {campo("Conta orçamentária", p.conta_orcamentaria)}
        {campo("Conta informada", p.conta_informada)}
        {campo("Conta contábil", p.conta_contabil)}
      </dl>
      {reclass && <p className="nota">Reclassificado: {p.motivo_reclassificacao}</p>}

      <h3>Cálculo</h3>
      <dl className="campos">
        {campo("Quantidade", numero(p.quantidade))}
        {campo("Valor unitário", reaisCentavos(p.valor_unitario))}
        {campo("Frequência", p.frequencia)}
        {campo("Mês de início", p.mes_inicio)}
        {campo("Base de cálculo", p.base_calculo)}
        {campo("Fonte do valor", p.fonte_valor)}
      </dl>

      <h3>Justificativa</h3>
      <p className="texto">{p.justificativa}</p>

      <h3>Origem</h3>
      <dl className="campos">
        {campo("Arquivo", p.arquivo_origem)}
        {campo("Linha", p.linha_origem)}
        {campo("Status da linha", p.status_linha)}
      </dl>
    </Gaveta>
  );
}
