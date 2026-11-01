import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabela, type Coluna } from "../../components/Tabela";
import { Cartao, Kpi, Pagina, Selo } from "../../components/ui";
import { COR, DicaGrafico, Legenda, eixo } from "../../components/graficos";
import { useDados } from "../../core/acesso/contexto";
import type { Vaga } from "../../types";
import { agrupar, numero, reais, reaisCentavos, reaisCurto, soma } from "../../utils/formato";

export default function NovasVagas() {
  const { vagas } = useDados();

  const r = useMemo(() => {
    const total = soma(vagas, (v) => v.total_2027);
    const anualCheio = soma(vagas, (v) => v.custo_mensal_vaga * v.qtd_vagas * 12);
    const naoQuadro = vagas.filter((v) => v.alertas.some((a) => a.tipo === "Não é aumento de quadro"));
    const semValor = vagas.filter((v) => v.salario_base === 0);
    const setores = [...agrupar(vagas, (v) => v.setor)].map(([s, vs]) => ({
      setor: s,
      "Custo em 2027": soma(vs, (v) => v.total_2027),
      "Efeito nos anos seguintes": soma(vs, (v) => v.custo_mensal_vaga * v.qtd_vagas * 12) - soma(vs, (v) => v.total_2027),
    })).sort((a, b) => b["Custo em 2027"] + b["Efeito nos anos seguintes"] - a["Custo em 2027"] - a["Efeito nos anos seguintes"]);
    return { total, anualCheio, naoQuadro, semValor, setores };
  }, [vagas]);

  const colunas: Coluna<Vaga>[] = [
    { id: "id", titulo: "ID", valor: (v) => v.id, largura: "60px" },
    { id: "setor", titulo: "Setor", valor: (v) => v.setor },
    { id: "cargo", titulo: "Cargo", valor: (v) => v.cargo, render: (v) => <span className="celula-item">{v.cargo}</span> },
    { id: "qtd", titulo: "Vagas", valor: (v) => v.qtd_vagas, num: true },
    { id: "mes", titulo: "Início", valor: (v) => v.mes_inicio },
    { id: "sal", titulo: "Salário base", valor: (v) => v.salario_base, render: (v) => (v.salario_base ? reaisCentavos(v.salario_base) : <Selo tom="critico">não informado</Selo>), num: true },
    { id: "cm", titulo: "Custo mensal/vaga", valor: (v) => v.custo_mensal_vaga, render: (v) => reais(v.custo_mensal_vaga), num: true },
    { id: "total", titulo: "Total 2027", valor: (v) => v.total_2027, render: (v) => reais(v.total_2027), num: true },
    { id: "alertas", titulo: "Alertas", valor: (v) => v.alertas.map((a) => a.tipo).join(", "),
      render: (v) => v.alertas.map((a) => <Selo key={a.tipo} tom="atencao">{a.tipo}</Selo>) },
  ];

  return (
    <Pagina titulo="Novas vagas"
      resumo={<>Custo mensal por vaga = salário base × fator de encargos ({numero(vagas[0]?.fator_encargos ?? 0)}) × 13 ÷ 12, conforme a matriz. Reajuste e dissídio em 0%.</>}>
      <div className="kpis">
        <Kpi rotulo="Vagas pedidas" valor={String(soma(vagas, (v) => v.qtd_vagas))} detalhe={`${vagas.length} linhas em ${new Set(vagas.map((v) => v.setor)).size} setores`} />
        <Kpi rotulo="Custo em 2027" marca={COR.vaga} valor={reaisCurto(r.total)} detalhe="a partir do mês de início" />
        <Kpi rotulo="Custo anual completo" valor={reaisCurto(r.anualCheio)} detalhe={<>impacto recorrente a partir de 2028 (+{reaisCurto(r.anualCheio - r.total)})</>} tom="atencao" />
        <Kpi rotulo="Não são aumento de quadro" valor={String(r.naoQuadro.length)} detalhe={`${reais(soma(r.naoQuadro, (v) => v.total_2027))} a tratar como diferença salarial`} tom="critico" />
      </div>

      <Cartao titulo="Custo das vagas por setor" sub="O efeito nos anos seguintes é o que a vaga custa a mais quando passa a valer o ano inteiro.">
        <Legenda itens={[{ nome: "Custo em 2027", cor: COR.vaga }, { nome: "Efeito nos anos seguintes", cor: COR.neutro }]} />
        <ResponsiveContainer width="100%" height={Math.max(200, r.setores.length * 32 + 30)}>
          <BarChart data={r.setores} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke={COR.grade} />
            <XAxis type="number" {...eixo} tickFormatter={reaisCurto} />
            <YAxis type="category" dataKey="setor" {...eixo} width={130} />
            <Tooltip content={<DicaGrafico total />} cursor={{ fill: "var(--hover)" }} />
            <Bar dataKey="Custo em 2027" stackId="a" fill={COR.vaga} />
            <Bar dataKey="Efeito nos anos seguintes" stackId="a" fill={COR.neutro} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Cartao>

      <Cartao titulo="Vagas pedidas" sub="Justificativa e alertas ajudam a separar aumento real de quadro de substituições.">
        <Tabela linhas={vagas} colunas={colunas} chave={(v) => v.id} ordemInicial={{ id: "total", desc: true }} />
      </Cartao>
    </Pagina>
  );
}
