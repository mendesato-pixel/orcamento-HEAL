import { useMemo, useState } from "react";
import { Tabela, type Coluna } from "../../components/Tabela";
import { Cartao, Kpi, Pagina, Selo } from "../../components/ui";
import { Icone } from "../../components/Icone";
import { useDados } from "../../core/acesso/contexto";
import type { Pedido } from "../../types";
import { baixarCSV, reais, reaisCurto, soma } from "../../utils/formato";
import { DetalhePedido } from "./DetalhePedido";

const COLUNAS: Coluna<Pedido>[] = [
  { id: "id", titulo: "ID", valor: (p) => p.id, largura: "70px" },
  { id: "setor", titulo: "Setor", valor: (p) => p.setor },
  { id: "item", titulo: "Item", valor: (p) => p.item_descricao, render: (p) => <span className="celula-item">{p.item_descricao}</span> },
  { id: "grupo", titulo: "Grupo de gasto", valor: (p) => p.grupo_gasto },
  { id: "classe", titulo: "Classificação", valor: (p) => p.classificacao_final, render: (p) => <Selo tom={p.classificacao_final === "Despesa" ? "despesa" : "investimento"}>{p.classificacao_final}</Selo> },
  { id: "prio", titulo: "Prioridade", valor: (p) => p.prioridade },
  { id: "freq", titulo: "Frequência", valor: (p) => p.frequencia },
  { id: "total", titulo: "Total 2027", valor: (p) => p.total_2027, render: (p) => reais(p.total_2027), num: true },
  { id: "alertas", titulo: "Alertas", valor: (p) => p.alertas.length, render: (p) => (p.alertas.length ? <Selo tom="atencao">{p.alertas.length}</Selo> : ""), num: true, largura: "80px" },
];

export default function Pedidos() {
  const { pedidos } = useDados();
  const [busca, setBusca] = useState("");
  const [classe, setClasse] = useState("");
  const [prio, setPrio] = useState("");
  const [grupo, setGrupo] = useState("");
  const [soAlerta, setSoAlerta] = useState(false);
  const [aberto, setAberto] = useState<Pedido | null>(null);

  const opcoes = useMemo(() => ({
    prio: [...new Set(pedidos.map((p) => p.prioridade))].sort(),
    grupo: [...new Set(pedidos.map((p) => p.grupo_gasto))].sort(),
  }), [pedidos]);

  const linhas = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return pedidos.filter((p) =>
      (!b || `${p.item_descricao} ${p.justificativa} ${p.id} ${p.conta_orcamentaria}`.toLowerCase().includes(b)) &&
      (!classe || p.classificacao_final === classe) &&
      (!prio || p.prioridade === prio) &&
      (!grupo || p.grupo_gasto === grupo) &&
      (!soAlerta || p.alertas.length > 0));
  }, [pedidos, busca, classe, prio, grupo, soAlerta]);

  const total = soma(linhas, (p) => p.total_2027);
  const exportar = () => baixarCSV("pedidos_filtrados.csv", linhas.map(({ alertas, ...p }) => ({
    ...p, alertas: alertas.map((a) => a.tipo).join(" | "),
  })));

  return (
    <Pagina titulo="Pedidos"
      resumo="Todos os itens das planilhas setoriais, com as mesmas variáveis da aba DESP_E_INVEST. Clique numa linha para ver memória de cálculo, justificativa, alertas e origem."
      acoes={<button className="botao" onClick={exportar}><Icone nome="baixar" tamanho={16} /> Exportar CSV</button>}>
      <div className="kpis kpis-3">
        <Kpi rotulo="Itens no recorte" valor={String(linhas.length)} detalhe={`de ${pedidos.length} pedidos`} />
        <Kpi rotulo="Valor no recorte" valor={reaisCurto(total)} detalhe="soma de valor_jan a valor_dez" />
        <Kpi rotulo="Com alerta" valor={String(linhas.filter((p) => p.alertas.length).length)} detalhe="itens para validar com o setor" tom="atencao" />
      </div>

      <Cartao>
        <div className="filtros-locais">
          <label className="busca">
            <Icone nome="busca" tamanho={16} />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar item, conta, justificativa ou ID" />
          </label>
          <select value={classe} onChange={(e) => setClasse(e.target.value)} aria-label="Classificação">
            <option value="">Despesa e investimento</option><option>Despesa</option><option>Investimento</option>
          </select>
          <select value={prio} onChange={(e) => setPrio(e.target.value)} aria-label="Prioridade">
            <option value="">Todas as prioridades</option>{opcoes.prio.map((x) => <option key={x}>{x}</option>)}
          </select>
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)} aria-label="Grupo de gasto">
            <option value="">Todos os grupos</option>{opcoes.grupo.map((x) => <option key={x}>{x}</option>)}
          </select>
          <label className="check"><input type="checkbox" checked={soAlerta} onChange={(e) => setSoAlerta(e.target.checked)} /> Só com alerta</label>
        </div>
        <Tabela linhas={linhas} colunas={COLUNAS} chave={(p) => p.id} onLinha={setAberto} ordemInicial={{ id: "total", desc: true }} />
      </Cartao>
      <DetalhePedido p={aberto} onFechar={() => setAberto(null)} />
    </Pagina>
  );
}
