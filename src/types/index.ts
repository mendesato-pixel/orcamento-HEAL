// Tipos espelham o dicionário de dados (docs/dicionario-dados.md).
export const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"] as const;
export type Mes = (typeof MESES)[number];
export const CHAVES_MES = MESES.map((m) => `valor_${m.toLowerCase()}`) as `valor_${Lowercase<Mes>}`[];

export type Classe = "Despesa" | "Investimento";
export interface Alerta { tipo: string; detalhe: string }

type Meses = { [K in `valor_${Lowercase<Mes>}`]: number };

/** orc_consolidado_itens — aba DESP_E_INVEST */
export interface Pedido extends Meses {
  id: string;
  setor: string;
  setor_sigla: string;
  diretoria: string;
  centro_custo_rotulo: string;
  natureza_cc: "Operacional" | "Administrativo";
  grupo_gasto: string;
  conta_orcamentaria: string;
  conta_contabil: string;
  item_descricao: string;
  situacao: string;
  prioridade: string;
  frequencia: string;
  mes_inicio: Mes;
  quantidade: number;
  valor_unitario: number;
  base_calculo: string;
  fonte_valor: string;
  valor_2026: number | null;
  justificativa: string;
  tipo_informado: Classe | "";
  conta_informada: string;
  classificacao_final: Classe;
  motivo_reclassificacao: string;
  alertas: Alerta[];
  status_linha: string;
  arquivo_origem: string;
  linha_origem: number;
  total_2027: number;
}

/** orc_novas_vagas — aba NOVAS_VAGAS */
export interface Vaga extends Meses {
  id: string;
  setor: string;
  setor_sigla: string;
  diretoria: string;
  centro_custo_rotulo: string;
  cargo: string;
  qtd_vagas: number;
  mes_inicio: Mes;
  prioridade: string;
  justificativa: string;
  salario_base: number;
  fator_encargos: number;
  custo_mensal_vaga: number;
  alertas: Alerta[];
  arquivo_origem: string;
  linha_origem: number;
  total_2027: number;
}

/** aud_alertas — aba ALERTAS */
export interface AlertaLinha {
  id_item: string;
  setor: string;
  item: string;
  classificacao_final: string;
  total_2027: number;
  tipo_alerta: string;
  detalhe: string;
  status: "Aberto" | "Resolvido";
}

/** aud_controle_arquivos — aba CONTROLE_ARQUIVOS */
export interface ControleArquivo {
  arquivo: string;
  setor: string;
  responsavel: string;
  cargo_area: string;
  data: string;
  data_prevista: string;
  usado: string;
  total_pedidos_arquivo: number;
  total_vagas_arquivo: number;
  consolidado_despesas: number;
  consolidado_investimentos: number;
  consolidado_vagas: number;
  diferenca: number;
  observacao: string;
}

export interface Rodada {
  rodada: string;
  data: string;
  despesas: number;
  investimentos: number;
  vagas: number;
  alertas_abertos: number;
}
