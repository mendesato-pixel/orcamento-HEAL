import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabela, type Coluna } from "../../components/Tabela";
import { Cartao, Kpi, Pagina, Selo } from "../../components/ui";
import { COR, DicaGrafico, Legenda, eixo } from "../../components/graficos";
import { useDados } from "../../core/acesso/contexto";
import type { AlertaLinha, ControleArquivo } from "../../types";
import { agrupar, dataBR, pct, reais } from "../../utils/formato";

// Cada tipo de alerta pertence a uma categoria (ref: regras de qualidade).
const CATEGORIA: Record<string, string> = {
  "Cálculo refeito": "Erro de sistema",
  "Centro de custo": "Erro de usuário",
  "Centro de custo corrigido": "Erro de usuário",
  "Classificação divergente": "Erro de usuário",
  "Sem valor": "Erro de usuário",
  "Provável erro de frequência": "Erro de usuário",
  "Mês ajustado": "Erro de usuário",
  "Pessoal fora de NOVAS_VAGAS": "Erro de usuário",
  "Classificação": "Erro de usuário",
  "Reclassificado": "Ajuste da consolidação",
  "Valor atípico": "Revisão de valor",
  "Alto valor": "Revisão de valor",
  "Possível custo corrente": "Revisão de valor",
  "Não é aumento de quadro": "Revisão de valor",
  "Sugestão de classificação": "Revisão de valor",
};
const cat = (t: string) => CATEGORIA[t] ?? "Outros";
const COR_CAT: Record<string, string> = {
  "Erro de usuário": "var(--serie-2)",
  "Erro de sistema": "var(--serie-7)",
  "Revisão de valor": "var(--serie-1)",
  "Ajuste da consolidação": "var(--serie-neutra)",
};
const CATS = Object.keys(COR_CAT);

export default function Qualidade() {
  const { alertas, controle, pedidos, vagas } = useDados();
  const [catFiltro, setCatFiltro] = useState("");
  const [status, setStatus] = useState("Aberto");

  const r = useMemo(() => {
    const abertos = alertas.filter((a) => a.status === "Aberto");
    const atrasados = controle.filter((c) => c.usado === "Sim" && c.data > c.data_prevista);
    const usados = controle.filter((c) => c.usado === "Sim");
    const difs = usados.filter((c) => Math.abs(c.diferenca) > 0.5);
    const limpos = pedidos.filter((p) => !p.alertas.length).length / (pedidos.length || 1);
    const porTipo = [...agrupar(alertas, (a) => a.tipo_alerta)].map(([t, as]) => ({
      tipo: t, categoria: cat(t),
      Abertos: as.filter((a) => a.status === "Aberto").length,
      Resolvidos: as.filter((a) => a.status === "Resolvido").length,
    })).sort((a, b) => b.Abertos + b.Resolvidos - a.Abertos - a.Resolvidos);
    const porSetor = [...agrupar(abertos, (a) => a.setor)].map(([s, as]) => {
      const o: Record<string, number | string> = { setor: s };
      for (const c of CATS) o[c] = as.filter((a) => cat(a.tipo_alerta) === c).length;
      return o;
    }).sort((a, b) => CATS.reduce((x, c) => x + Number(b[c]), 0) - CATS.reduce((x, c) => x + Number(a[c]), 0));

    const ccInexistente = pedidos.filter((p) => p.alertas.some((a) => a.tipo === "Centro de custo")).length;
    const erroFormula = pedidos.filter((p) => p.status_linha.startsWith("Erro")).length;
    const semSalario = vagas.filter((v) => !v.salario_base).length;
    const duplicadas = controle.filter((c) => c.usado.startsWith("Não")).length;
    const checks = [
      { nome: "Arquivos recebidos até a data prevista", ok: !atrasados.length, det: atrasados.length ? `${atrasados.length} arquivo(s) após o prazo` : "todos no prazo", tipo: "Atraso" },
      { nome: "Total consolidado bate com o total dos arquivos", ok: difs.every((d) => d.observacao && d.observacao !== "Sem diferença."), det: difs.length ? `${difs.length} diferença(s), todas com explicação` : "sem diferenças", tipo: "Erro de sistema" },
      { nome: "Fórmulas de origem sem erro", ok: false, det: `${erroFormula} linha(s) com erro, recalculadas e sinalizadas`, tipo: "Erro de sistema" },
      { nome: "Centros de custo existem no cadastro", ok: !ccInexistente, det: ccInexistente ? `${ccInexistente} pedido(s) com CC inexistente` : "todos válidos", tipo: "Erro de usuário" },
      { nome: "Vagas com salário informado", ok: !semSalario, det: semSalario ? `${semSalario} vaga(s) com custo zero` : "todas com salário", tipo: "Erro de usuário" },
      { nome: "Versões duplicadas excluídas", ok: true, det: `${duplicadas} versão(ões) anterior(es) fora da consolidação`, tipo: "Erro de usuário" },
    ];
    return { abertos, atrasados, difs, limpos, porTipo, porSetor, checks };
  }, [alertas, controle, pedidos, vagas]);

  const linhasAlerta = alertas.filter((a) => (!catFiltro || cat(a.tipo_alerta) === catFiltro) && (!status || a.status === status));

  const colAlertas: Coluna<AlertaLinha>[] = [
    { id: "id", titulo: "ID", valor: (a) => a.id_item, largura: "70px" },
    { id: "setor", titulo: "Setor", valor: (a) => a.setor },
    { id: "item", titulo: "Item", valor: (a) => a.item, render: (a) => <span className="celula-item">{a.item}</span> },
    { id: "cat", titulo: "Categoria", valor: (a) => cat(a.tipo_alerta), render: (a) => <span className="com-marca"><span className="marca" style={{ background: COR_CAT[cat(a.tipo_alerta)] }} />{cat(a.tipo_alerta)}</span> },
    { id: "tipo", titulo: "Tipo", valor: (a) => a.tipo_alerta },
    { id: "det", titulo: "Detalhe / ação", valor: (a) => a.detalhe, render: (a) => <span className="celula-texto">{a.detalhe}</span> },
    { id: "total", titulo: "Total 2027", valor: (a) => a.total_2027, render: (a) => reais(a.total_2027), num: true },
    { id: "status", titulo: "Status", valor: (a) => a.status, render: (a) => <Selo tom={a.status === "Aberto" ? "atencao" : "bom"}>{a.status === "Aberto" ? "● Aberto" : "✓ Resolvido"}</Selo> },
  ];

  const colArquivos: Coluna<ControleArquivo>[] = [
    { id: "setor", titulo: "Setor", valor: (c) => c.setor },
    { id: "arq", titulo: "Arquivo", valor: (c) => c.arquivo, render: (c) => <span className="celula-mono">{c.arquivo}</span> },
    { id: "resp", titulo: "Responsável", valor: (c) => c.responsavel },
    { id: "data", titulo: "Recebido", valor: (c) => c.data,
      render: (c) => <>{dataBR(c.data)} {c.usado === "Sim" && c.data > c.data_prevista ? <Selo tom="critico">▲ atraso</Selo> : null}</> },
    { id: "usado", titulo: "Usado", valor: (c) => c.usado, render: (c) => (c.usado === "Sim" ? "Sim" : <Selo>versão anterior</Selo>) },
    { id: "arqv", titulo: "Total no arquivo", valor: (c) => c.total_pedidos_arquivo + c.total_vagas_arquivo, render: (c) => reais(c.total_pedidos_arquivo + c.total_vagas_arquivo), num: true },
    { id: "cons", titulo: "Consolidado", valor: (c) => c.consolidado_despesas + c.consolidado_investimentos + c.consolidado_vagas, render: (c) => reais(c.consolidado_despesas + c.consolidado_investimentos + c.consolidado_vagas), num: true },
    { id: "dif", titulo: "Diferença", valor: (c) => c.diferenca, render: (c) => (Math.abs(c.diferenca) > 0.5 ? <strong>{reais(c.diferenca)}</strong> : "–"), num: true },
    { id: "obs", titulo: "Observação", valor: (c) => c.observacao, render: (c) => <span className="celula-texto">{c.observacao}</span> },
  ];

  return (
    <Pagina titulo="Qualidade dos dados"
      resumo="Verificações automáticas a cada carga: atrasos de envio, erros gerados pelas planilhas e erros de preenchimento. Nada chega às análises sem passar por aqui.">
      <div className="kpis">
        <Kpi rotulo="Alertas abertos" valor={String(r.abertos.length)} detalhe={`de ${alertas.length} gerados`} tom={r.abertos.length ? "atencao" : "bom"} />
        <Kpi rotulo="Pedidos sem alerta" valor={pct(r.limpos, 0)} detalhe={`${pedidos.filter((p) => !p.alertas.length).length} de ${pedidos.length}`} tom={r.limpos > 0.85 ? "bom" : "atencao"} />
        <Kpi rotulo="Arquivos atrasados" valor={String(r.atrasados.length)} detalhe="após a data prevista" tom={r.atrasados.length ? "critico" : "bom"} />
        <Kpi rotulo="Diferenças de conciliação" valor={String(r.difs.length)} detalhe="arquivo × consolidado, todas explicadas" />
      </div>

      <div className="grade-2">
        <Cartao titulo="Verificações automáticas" sub="Executadas a cada nova carga de planilhas.">
          <ul className="checks">
            {r.checks.map((c) => (
              <li key={c.nome} className={c.ok ? "ok" : "falha"}>
                <span className="check-icone" aria-label={c.ok ? "Aprovado" : "Atenção"}>{c.ok ? "✓" : "!"}</span>
                <div><strong>{c.nome}</strong><span>{c.det}</span></div>
                <Selo>{c.tipo}</Selo>
              </li>
            ))}
          </ul>
        </Cartao>

        <Cartao titulo="Alertas abertos por setor" sub="Quem precisa responder o quê. Base para cobrar os setores antes da próxima rodada.">
          <Legenda itens={CATS.map((c) => ({ nome: c, cor: COR_CAT[c] }))} />
          <ResponsiveContainer width="100%" height={Math.max(220, r.porSetor.length * 30 + 30)}>
            <BarChart data={r.porSetor} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} stroke={COR.grade} />
              <XAxis type="number" {...eixo} allowDecimals={false} />
              <YAxis type="category" dataKey="setor" {...eixo} width={130} />
              <Tooltip content={<DicaGrafico total formato={(v) => String(v)} />} cursor={{ fill: "var(--hover)" }} />
              {CATS.map((c, i) => <Bar key={c} dataKey={c} stackId="a" fill={COR_CAT[c]} radius={i === CATS.length - 1 ? [0, 4, 4, 0] : 0} />)}
            </BarChart>
          </ResponsiveContainer>
        </Cartao>
      </div>

      <Cartao titulo="Alertas" acoes={
        <div className="filtros-locais">
          <select value={catFiltro} onChange={(e) => setCatFiltro(e.target.value)} aria-label="Categoria">
            <option value="">Todas as categorias</option>{CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="">Abertos e resolvidos</option><option>Aberto</option><option>Resolvido</option>
          </select>
        </div>
      }>
        <Tabela linhas={linhasAlerta} colunas={colAlertas} chave={(a) => a.id_item + a.tipo_alerta} ordemInicial={{ id: "total", desc: true }} porPagina={15} />
      </Cartao>

      <Cartao titulo="Controle das planilhas recebidas" sub="Prazo, versão usada e conciliação entre o total de cada arquivo e o consolidado.">
        <Tabela linhas={controle} colunas={colArquivos} chave={(c) => c.arquivo} ordemInicial={{ id: "setor", desc: false }} porPagina={20} />
      </Cartao>
    </Pagina>
  );
}
