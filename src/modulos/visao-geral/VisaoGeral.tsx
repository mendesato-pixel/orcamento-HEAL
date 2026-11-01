import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Cartao, Kpi, Pagina, Selo } from "../../components/ui";
import { COR, DicaGrafico, Legenda, eixo } from "../../components/graficos";
import { temFiltro, useApp, useDados } from "../../core/acesso/contexto";
import { CHAVES_MES, MESES } from "../../types";
import { agrupar, pct, reais, reaisCurto, soma } from "../../utils/formato";

const LEG = [
  { nome: "Despesas (pedidos)", cor: COR.despesa },
  { nome: "Investimentos", cor: COR.investimento },
  { nome: "Novas vagas", cor: COR.vaga },
];

export default function VisaoGeral() {
  const { pedidos, vagas, alertas, rodadas } = useDados();
  const { filtros, perfil } = useApp();
  const filtrado = temFiltro(filtros, perfil);

  const r = useMemo(() => {
    const desp = pedidos.filter((p) => p.classificacao_final === "Despesa");
    const inv = pedidos.filter((p) => p.classificacao_final === "Investimento");
    const D = soma(desp, (p) => p.total_2027), I = soma(inv, (p) => p.total_2027), V = soma(vagas, (v) => v.total_2027);
    const total = D + I + V;

    const setores = [...agrupar([...pedidos, ...vagas], (x) => x.setor)].map(([setor]) => ({
      setor,
      Despesa: soma(desp.filter((p) => p.setor === setor), (p) => p.total_2027),
      Investimento: soma(inv.filter((p) => p.setor === setor), (p) => p.total_2027),
      Vagas: soma(vagas.filter((v) => v.setor === setor), (v) => v.total_2027),
    })).map((s) => ({ ...s, total: s.Despesa + s.Investimento + s.Vagas })).sort((a, b) => b.total - a.total);

    const mensal = MESES.map((m, i) => ({
      mes: m,
      Despesa: soma(desp, (p) => p[CHAVES_MES[i]]),
      Investimento: soma(inv, (p) => p[CHAVES_MES[i]]),
      Vagas: soma(vagas, (v) => v[CHAVES_MES[i]]),
    }));
    const pico = mensal.reduce((a, b) => (b.Despesa + b.Investimento + b.Vagas > a.Despesa + a.Investimento + a.Vagas ? b : a));

    const top = [...pedidos].sort((a, b) => b.total_2027 - a.total_2027).slice(0, 10);
    const topSoma = soma(top, (p) => p.total_2027);

    const prioridades = [...agrupar(pedidos, (p) => p.prioridade)].map(([prio, ps]) => ({
      prio, n: ps.length,
      desp: soma(ps.filter((p) => p.classificacao_final === "Despesa"), (p) => p.total_2027),
      inv: soma(ps.filter((p) => p.classificacao_final === "Investimento"), (p) => p.total_2027),
    })).sort((a, b) => a.prio.localeCompare(b.prio));

    return { D, I, V, total, setores, mensal, pico, top, topSoma, prioridades };
  }, [pedidos, vagas]);

  const abertos = alertas.filter((a) => a.status === "Aberto");
  const r1 = rodadas[0], r3 = rodadas[rodadas.length - 1];
  const tot = (x: typeof r1) => x.despesas + x.investimentos + x.vagas;
  const desejaveis = r.prioridades.find((p) => p.prio.startsWith("3"));

  return (
    <Pagina
      titulo="Visão geral do orçamento 2027"
      resumo={<>Total pedido de <strong>{reais(r.total)}</strong> em {pedidos.length} pedidos e {soma(vagas, (v) => v.qtd_vagas)} vagas. Os 10 maiores pedidos concentram <strong>{pct(r.topSoma / (r.D + r.I || 1), 0)}</strong> do valor dos pedidos.</>}
    >
      <div className="kpis">
        <Kpi rotulo="Total geral" valor={reaisCurto(r.total)}
          detalhe={!filtrado ? <>{tot(r3) < tot(r1) ? "▼" : "▲"} {pct(Math.abs(tot(r3) / tot(r1) - 1))} desde a 1ª rodada</> : "recorte filtrado"}
          tom={!filtrado && tot(r3) < tot(r1) ? "bom" : undefined} />
        <Kpi rotulo="Despesas (pedidos)" marca={COR.despesa} valor={reaisCurto(r.D)} detalhe={pct(r.D / (r.total || 1)) + " do total"} />
        <Kpi rotulo="Investimentos" marca={COR.investimento} valor={reaisCurto(r.I)} detalhe={pct(r.I / (r.total || 1)) + " do total"} />
        <Kpi rotulo="Novas vagas" marca={COR.vaga} valor={reaisCurto(r.V)} detalhe={`${soma(vagas, (v) => v.qtd_vagas)} vagas em ${vagas.length} pedidos`} />
        <Kpi rotulo="Alertas abertos" valor={String(abertos.length)} detalhe={<Link to="/qualidade-dados">ver qualidade dos dados →</Link>} tom={abertos.length ? "atencao" : "bom"} />
      </div>

      <div className="grade-2">
        <Cartao titulo="Total 2027 por setor" sub="Ordenado pelo maior total. Passe o mouse para ver a composição.">
          <Legenda itens={LEG} />
          <ResponsiveContainer width="100%" height={Math.max(220, r.setores.length * 30 + 30)}>
            <BarChart data={r.setores} layout="vertical" margin={{ left: 8, right: 16 }} barCategoryGap={6}>
              <CartesianGrid horizontal={false} stroke={COR.grade} />
              <XAxis type="number" {...eixo} tickFormatter={reaisCurto} />
              <YAxis type="category" dataKey="setor" {...eixo} width={130} />
              <Tooltip content={<DicaGrafico total />} cursor={{ fill: "var(--hover)" }} />
              <Bar dataKey="Despesa" name="Despesas" stackId="a" fill={COR.despesa} />
              <Bar dataKey="Investimento" name="Investimentos" stackId="a" fill={COR.investimento} />
              <Bar dataKey="Vagas" name="Novas vagas" stackId="a" fill={COR.vaga} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Cartao>

        <div className="coluna">
          <Cartao titulo="Desembolso mês a mês" sub={<>Pico em <strong>{r.pico.mes}</strong>: {reais(r.pico.Despesa + r.pico.Investimento + r.pico.Vagas)}. Base para o planejamento de caixa.</>}>
            <Legenda itens={LEG} />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={r.mensal} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} stroke={COR.grade} />
                <XAxis dataKey="mes" {...eixo} />
                <YAxis {...eixo} tickFormatter={reaisCurto} width={64} />
                <Tooltip content={<DicaGrafico total />} cursor={{ fill: "var(--hover)" }} />
                <Bar dataKey="Despesa" name="Despesas" stackId="a" fill={COR.despesa} />
                <Bar dataKey="Investimento" name="Investimentos" stackId="a" fill={COR.investimento} />
                <Bar dataKey="Vagas" name="Novas vagas" stackId="a" fill={COR.vaga} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Cartao>

          <Cartao titulo="Onde revisar primeiro" sub="Pedidos por prioridade informada pelo setor.">
            <table className="tabela compacta">
              <thead><tr><th>Prioridade</th><th className="num">Itens</th><th className="num">Despesas</th><th className="num">Investimentos</th></tr></thead>
              <tbody>
                {r.prioridades.map((p) => (
                  <tr key={p.prio}><td>{p.prio}</td><td className="num">{p.n}</td><td className="num">{reais(p.desp)}</td><td className="num">{reais(p.inv)}</td></tr>
                ))}
              </tbody>
            </table>
            {desejaveis && (
              <p className="nota">Os itens <strong>desejáveis</strong> somam {reais(desejaveis.desp + desejaveis.inv)}: primeiro espaço de negociação se o teto de 2027 ficar abaixo do pedido.</p>
            )}
          </Cartao>
        </div>
      </div>

      <div className="grade-2">
        <Cartao titulo="10 maiores pedidos" sub={`Somam ${reais(r.topSoma)}. Validar escopo e cotação antes de aprovar.`}
          acoes={<Link className="botao-link" to="/pedidos">Ver todos →</Link>}>
          <table className="tabela compacta">
            <thead><tr><th>Item</th><th>Setor</th><th>Tipo</th><th className="num">Total 2027</th></tr></thead>
            <tbody>
              {r.top.map((p) => (
                <tr key={p.id}>
                  <td>{p.item_descricao}{p.alertas.length > 0 && <span className="ponto-alerta" title={p.alertas.map((a) => a.tipo).join(", ")}>●</span>}</td>
                  <td>{p.setor}</td>
                  <td><Selo tom={p.classificacao_final === "Despesa" ? "despesa" : "investimento"}>{p.classificacao_final}</Selo></td>
                  <td className="num">{reais(p.total_2027)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Cartao>

        {!filtrado ? (
          <Cartao titulo="Evolução entre rodadas de consolidação" sub="Cada rodada fica guardada: dá para ver o efeito das revisões com os setores.">
            <Legenda itens={LEG} />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rodadas.map((x) => ({ rodada: x.rodada, Despesa: x.despesas, Investimento: x.investimentos, Vagas: x.vagas }))} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} stroke={COR.grade} />
                <XAxis dataKey="rodada" {...eixo} />
                <YAxis {...eixo} tickFormatter={reaisCurto} width={64} />
                <Tooltip content={<DicaGrafico total />} cursor={{ fill: "var(--hover)" }} />
                <Bar dataKey="Despesa" name="Despesas" stackId="a" fill={COR.despesa} />
                <Bar dataKey="Investimento" name="Investimentos" stackId="a" fill={COR.investimento} />
                <Bar dataKey="Vagas" name="Novas vagas" stackId="a" fill={COR.vaga} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="nota">Alertas abertos: {rodadas.map((x) => `${x.rodada} ${x.alertas_abertos}`).join(" · ")}.</p>
          </Cartao>
        ) : (
          <Cartao titulo="Evolução entre rodadas" sub="Disponível na visão sem filtros.">
            <p className="nota">A evolução por rodada é mostrada para o consolidado total.</p>
          </Cartao>
        )}
      </div>
    </Pagina>
  );
}
