// Perfis de acesso. No mockup, o perfil é escolhido num seletor e só muda o que
// aparece na tela. Na versão real, o controle de acesso fica no servidor/banco.
export type PerfilId = "gerente_financeiro" | "controladoria" | "diretoria" | "gestor_setor";

export interface Perfil {
  id: PerfilId;
  nome: string;
  descricao: string;
  /** Se definido, o perfil só enxerga dados deste setor. */
  setorFixo?: string;
}

export const PERFIS: Perfil[] = [
  { id: "gerente_financeiro", nome: "Gerente financeiro", descricao: "Visão completa: cenários, oportunidades e qualidade dos dados." },
  { id: "controladoria", nome: "Controladoria", descricao: "Consolidação, classificação e tratamento de alertas." },
  { id: "diretoria", nome: "Diretoria", descricao: "Totais, prioridades e evolução por rodada." },
  { id: "gestor_setor", nome: "Gestor de setor (Enfermagem)", descricao: "Somente os pedidos, vagas e pendências do próprio setor.", setorFixo: "Enfermagem" },
];
