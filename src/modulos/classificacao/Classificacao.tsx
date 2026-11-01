import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabela, type Coluna } from "../../components/Tabela";
import { Cartao, Kpi, Pagina, Selo } from "../../components/ui";
import { COR, DicaGrafico, Legenda, eixo } from "../../components/graficos";
import { useDados } from "../../core/acesso/contexto";
import type { Pedido } from "../../types";
import { agrupar, reais, reaisCurto, soma } from "../../utils/formato";
import { DetalhePedido } from "../pedidos/DetalhePedido";

// ref_criterios_classificacao (vigente na 3ª rodada)
const REGRAS = [
  { ordem: 1, regra: "Vale o tipo informado pelo setor quando coerente com a natureza da conta (1.2.x = investimento; 4.x = despesa).", efeito: "Classificação" },
  { ordem: 2, regra: "Tipo em conflito com a conta, ou conta em branco/fora da lista → natureza da conta.", efeito: "Classificação" },
  { ordem: 3, regra: "Mensalidades, assinaturas, serviços e consumo recorrente lançados como investimento → despesa; obras AVCB → Instalações (investimento).", efeito: "Classificação e conta" },
  { ordem: 4, regra: "Limite de R$ 1.200 (bens de pequeno valor) gera só sugestão nos alertas, sem alterar o lançamento do setor.", efeito: "Só alerta" },
];

export default function Classificacao() {
  const { pedidos } = useDados();
  const [aberto, setAberto] = useState<Pedido | null>(null);

  const r = useMemo(() => {
    const tipos = ["Despesa", "Investimento", ""] as const;
    const matriz = tipos.map((t) => ({
      t: t || "(em branco)",
      cel: (["Despesa", "Investimento"] as const).map((f) => {
        const ps = pedidos.filter((p) => p.tipo_informado === t && p.classificacao_final === f);
        return { n: ps.length, v: soma(ps, (p) => p.total_2027), diverge: t !== "" && t !== f };
      }),
    }));
    const reclass = pedidos.filter((p) => p.motivo_reclassificacao || !p.tipo_informado);
    const sugestoes = pedidos.filter((p) => p.alertas.some((a) => a.tipo === "Sugestão de classificação"));
    const grupos = [...agrupar(pedidos, (p) => p.grupo_gasto)].map(([g, ps]) => ({
      grupo: g,
      Despesa: soma(ps.filter((p) => p.classificacao_final === "Despesa"), (p) => p.total_2027),
      Investimento: soma(ps.filter((p) => p.classificacao_final === "Investimento"), (p) => p.total_2027),
    })).sort((a, b) => b.Despesa + b.Investimento - a.Despesa - a.Investimento);
    return { matriz, reclass, sugestoes, grupos };
  }, [pedidos]);

  const colunas: Coluna<Pedido>[] = [
    { id: "id", titulo: "ID", valor: (p) => p.id, largura: "70px" },
    { id: "setor", titulo: "Setor", valor: (p) => p.setor },
    { id: "item", titulo: "Item", valor: (p) => p.item_descricao, render: (p) => <span className="celula-item">{p.item_descricao}</span> },
    { id: "inf", titulo: "Informado", valor: (p) => p.tipo_informado || "(em branco)" },
    { id: "fin", titulo: "Final", valor: (p) => p.classificacao_final, render: (p) => <Selo tom={p.classificacao_final === "Despesa" ? "despesa" : "investimento"}>{p.classificacao_final}</Selo> },
    { id: "motivo", titulo: "Motivo", valor: (p) => p.motivo_reclassificacao || "Tipo em branco; classificado pela conta (regra 2).", render: (p) => <span className="celula-texto">{p.motivo_reclassificacao || "Tipo em branco; classificado pela conta (regra 2)."}</span> },
    { id: "total", titulo: "Total 2027", valor: (p) => p.total_2027, render: (p) => reais(p.total_2027), num: true },
  ];

  const valorReclass = soma(r.reclass.filter((p) => p.tipo_informado), (p) => p.total_2027);

  return (
    <Pagina titulo="Classificação: despesa × investimento"
      resumo="Como o tipo informado pelos setores foi tratado na consolidação, quais regras valem e onde ainda há sugestão de revisão.">
      <div className="kpis">
        <Kpi rotulo="Reclassificados" valor={String(r.reclass.filter((p) => p.tipo_informado).length)} detalhe={`${reais(valorReclass)} mudaram de classe`} tom="atencao" />
        <Kpi rotulo="Tipo em branco" valor={String(r.reclass.filter((p) => !p.tipo_informado).length)} detalhe="classificados pela conta" />
        <Kpi rotulo="Sugestões (R$ 1.200)" valor={String(r.sugestoes.length)} detalhe={`${reais(soma(r.sugestoes, (p) => p.total_2027))} sem alterar o lançamento`} />
        <Kpi rotulo="Regras vigentes" valor={String(REGRAS.length)} detalhe="3ª rodada de consolidação" />
      </div>

      <div className="grade-2">
        <Cartao titulo="Tipo informado × classificação final" sub="Células destacadas: o setor marcou um tipo e a consolidação usou outro.">
          <table className="tabela matriz">
            <thead><tr><th>Informado pelo setor</th><th className="num">→ Despesa</th><th className="num">→ Investimento</th></tr></thead>
            <tbody>
              {r.matriz.map((l) => (
                <tr key={l.t}>
                  <td>{l.t}</td>
                  {l.cel.map((c, i) => (
                    <td key={i} className={`num ${c.diverge && c.n ? "celula-diverge" : ""}`}>
                      <strong>{c.n}</strong><small>{reaisCurto(c.v)}</small>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="subtitulo">Regras de classificação vigentes</h3>
          <ol className="regras">
            {REGRAS.map((x) => <li key={x.ordem}><span>{x.regra}</span><Selo>{x.efeito}</Selo></li>)}
          </ol>
        </Cartao>

        <Cartao titulo="Classificação final por grupo de gasto" sub="Ajuda a conferir se cada grupo caiu na natureza esperada.">
          <Legenda itens={[{ nome: "Despesa", cor: COR.despesa }, { nome: "Investimento", cor: COR.investimento }]} />
          <ResponsiveContainer width="100%" height={Math.max(260, r.grupos.length * 34 + 30)}>
            <BarChart data={r.grupos} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} stroke={COR.grade} />
              <XAxis type="number" {...eixo} tickFormatter={reaisCurto} />
              <YAxis type="category" dataKey="grupo" {...eixo} width={170} />
              <Tooltip content={<DicaGrafico total />} cursor={{ fill: "var(--hover)" }} />
              <Bar dataKey="Despesa" stackId="a" fill={COR.despesa} />
              <Bar dataKey="Investimento" stackId="a" fill={COR.investimento} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Cartao>
      </div>

      <Cartao titulo="Itens reclassificados ou sem tipo" sub="Clique para ver o item completo, com conta informada e conta final.">
        <Tabela linhas={r.reclass} colunas={colunas} chave={(p) => p.id} onLinha={setAberto} ordemInicial={{ id: "total", desc: true }} porPagina={15} />
      </Cartao>
      <DetalhePedido p={aberto} onFechar={() => setAberto(null)} />
    </Pagina>
  );
}
