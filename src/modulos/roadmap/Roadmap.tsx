import { Link } from "react-router-dom";
import { Cartao, Pagina, Selo } from "../../components/ui";
import { Icone } from "../../components/Icone";
import { MODULOS } from "../../config/modulos";
import { PERFIS } from "../../config/perfis";

// Próximas etapas e as bases de dados (dicionário) que cada uma exige.
const ETAPAS = [
  {
    id: "orcado-realizado", fase: "Fase 2", nome: "Orçado × realizado",
    pergunta: "Onde o realizado está se afastando do orçado, por diretoria, centro de custo e conta?",
    entrega: ["Desvio do mês e acumulado em R$ e %", "Ranking dos maiores desvios", "Navegação diretoria → CC → conta → lançamento"],
    bases: ["ctb_balancete_mensal", "ctb_plano_contas", "cus_custo_realizado_cc"],
  },
  {
    id: "custos", fase: "Fase 2", nome: "Custos e Pareto",
    pergunta: "Quais contas e fornecedores concentram o gasto e quais contratos crescem acima do reajuste?",
    entrega: ["Pareto 80/20 de contas e fornecedores", "Tendência mensal com média móvel de 12 meses", "Custo unitário por serviço"],
    bases: ["cus_custo_realizado_cc", "fin_contas_pagar", "cad_fornecedores", "com_producao"],
  },
  {
    id: "receitas", fase: "Fase 3", nome: "Receitas e captação",
    pergunta: "De onde vem a receita, quão concentrada ela é e quais contratos vencem nos próximos meses?",
    entrega: ["Receita por fonte e contrato", "Concentração nas maiores fontes", "Calendário de vencimentos"],
    bases: ["orc_receitas", "com_fontes_receita", "fin_contas_receber"],
  },
  {
    id: "entrada", fase: "Fase 4", nome: "Pedidos on-line com perfis e login",
    pergunta: "Como substituir as 17 planilhas por um formulário único, com validação na hora do preenchimento?",
    entrega: ["Formulário por setor com as regras de qualidade aplicadas na digitação", "Login e permissões por perfil no servidor", "Fluxo de aprovação por diretoria"],
    bases: ["orc_pedidos", "orc_novas_vagas", "cad_centros_custo", "cad_contas_orcamentarias"],
  },
];

export default function Roadmap() {
  return (
    <Pagina titulo="Roteiro do sistema"
      resumo="O mockup cobre o orçamento 2027 (fase 1). Cada próxima fase é um módulo novo, plugado no mesmo menu, nos mesmos filtros e na mesma base PostgreSQL.">
      <div className="fases">
        <div className="fase fase-ativa">
          <Selo tom="bom">✓ Fase 1 · neste mockup</Selo>
          <h3>Orçamento 2027</h3>
          <p>Visão geral, pedidos, 2026 × 2027, novas vagas, classificação e qualidade dos dados.</p>
        </div>
        {ETAPAS.map((e) => (
          <div key={e.id} className="fase">
            <Selo>{e.fase}</Selo>
            <h3>{e.nome}</h3>
            <p>{e.pergunta}</p>
            <div className="bases">{e.bases.map((b) => <code key={b}>{b}</code>)}</div>
          </div>
        ))}
      </div>

      <div className="grade-2">
        <Cartao titulo="Perfis de acesso" sub="No mockup, o seletor “Ver como” simula cada perfil. Na versão real, o banco aplica as permissões.">
          <table className="tabela compacta">
            <thead><tr><th>Módulo</th>{PERFIS.map((p) => <th key={p.id} className="centro">{p.nome.replace(" (Enfermagem)", "")}</th>)}</tr></thead>
            <tbody>
              {MODULOS.filter((m) => m.id !== "roadmap").map((m) => (
                <tr key={m.id}>
                  <td>{m.nome}{m.status === "planejado" && <span className="discreto"> · planejado</span>}</td>
                  {PERFIS.map((p) => <td key={p.id} className="centro">{m.perfis.includes(p.id) ? "✓" : "–"}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="nota">O gestor de setor vê apenas os dados do próprio setor em todas as telas.</p>
        </Cartao>

        <Cartao titulo="Como os dados chegam aqui">
          <ol className="fluxo">
            <li><strong>Fontes</strong><span>Planilhas setoriais, consolidado, ERP contábil e financeiro, folha, contratos.</span></li>
            <li><strong>raw</strong><span>Cópia fiel de cada arquivo, com arquivo e linha de origem.</span></li>
            <li><strong>stg</strong><span>Tipos e códigos padronizados; meses em formato longo.</span></li>
            <li><strong>núcleo</strong><span>Cadastros, regras, orçado, realizado e auditoria.</span></li>
            <li><strong>mart</strong><span>Visões prontas que alimentam estas telas.</span></li>
          </ol>
          <p className="nota">Hoje as telas leem arquivos fictícios com a mesma estrutura do mart. Trocar pela base real não muda nenhuma tela.</p>
        </Cartao>
      </div>
    </Pagina>
  );
}

export function ModuloPlanejado({ id }: { id: string }) {
  const m = MODULOS.find((x) => x.id === id)!;
  const e = ETAPAS.find((x) => x.id === id);
  return (
    <Pagina titulo={m.nome} resumo="Módulo planejado. Esta página mostra o que ele vai responder e quais bases precisa.">
      <Cartao className="planejado">
        <div className="planejado-icone"><Icone nome={m.icone} tamanho={28} /></div>
        {e ? (
          <>
            <h2>{e.pergunta}</h2>
            <h3 className="subtitulo">O que vai entregar</h3>
            <ul className="lista">{e.entrega.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3 className="subtitulo">Bases necessárias (dicionário de dados)</h3>
            <div className="bases">{e.bases.map((b) => <code key={b}>{b}</code>)}</div>
          </>
        ) : <p>Em definição.</p>}
        <p><Link to="/proximos-modulos" className="botao-link">Ver o roteiro completo →</Link></p>
      </Cartao>
    </Pagina>
  );
}
