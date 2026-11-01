// Registro de módulos: o menu e as rotas saem daqui.
// Para criar um módulo: copie src/modulos/_modelo, registre-o abaixo e defina os perfis.
import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { PerfilId } from "./perfis";

export interface Modulo {
  id: string;
  rota: string;
  nome: string;
  grupo: "Orçamento 2027" | "Controle" | "Próximos módulos";
  icone: string; // nome do ícone em components/Icone.tsx
  perfis: PerfilId[];
  status: "ativo" | "planejado";
  componente?: LazyExoticComponent<ComponentType>;
}

const TODOS: PerfilId[] = ["gerente_financeiro", "controladoria", "diretoria", "gestor_setor"];

export const MODULOS: Modulo[] = [
  { id: "visao-geral", rota: "/", nome: "Visão geral", grupo: "Orçamento 2027", icone: "painel", perfis: ["gerente_financeiro", "controladoria", "diretoria"], status: "ativo", componente: lazy(() => import("../modulos/visao-geral/VisaoGeral")) },
  { id: "pedidos", rota: "/pedidos", nome: "Pedidos", grupo: "Orçamento 2027", icone: "lista", perfis: TODOS, status: "ativo", componente: lazy(() => import("../modulos/pedidos/Pedidos")) },
  { id: "comparativo", rota: "/comparativo-2026", nome: "2026 × 2027", grupo: "Orçamento 2027", icone: "tendencia", perfis: ["gerente_financeiro", "controladoria", "diretoria"], status: "ativo", componente: lazy(() => import("../modulos/comparativo-2026/Comparativo")) },
  { id: "vagas", rota: "/novas-vagas", nome: "Novas vagas", grupo: "Orçamento 2027", icone: "pessoas", perfis: TODOS, status: "ativo", componente: lazy(() => import("../modulos/novas-vagas/NovasVagas")) },
  { id: "classificacao", rota: "/classificacao", nome: "Classificação", grupo: "Controle", icone: "balanca", perfis: ["gerente_financeiro", "controladoria"], status: "ativo", componente: lazy(() => import("../modulos/classificacao/Classificacao")) },
  { id: "qualidade", rota: "/qualidade-dados", nome: "Qualidade dos dados", grupo: "Controle", icone: "escudo", perfis: TODOS, status: "ativo", componente: lazy(() => import("../modulos/qualidade-dados/Qualidade")) },
  { id: "roadmap", rota: "/proximos-modulos", nome: "Roteiro do sistema", grupo: "Próximos módulos", icone: "mapa", perfis: ["gerente_financeiro", "controladoria", "diretoria"], status: "ativo", componente: lazy(() => import("../modulos/roadmap/Roadmap")) },
  { id: "orcado-realizado", rota: "/orcado-realizado", nome: "Orçado × realizado", grupo: "Próximos módulos", icone: "alvo", perfis: ["gerente_financeiro", "controladoria", "diretoria"], status: "planejado" },
  { id: "custos", rota: "/custos", nome: "Custos e Pareto", grupo: "Próximos módulos", icone: "pareto", perfis: ["gerente_financeiro", "controladoria"], status: "planejado" },
  { id: "receitas", rota: "/receitas", nome: "Receitas e captação", grupo: "Próximos módulos", icone: "moeda", perfis: ["gerente_financeiro", "diretoria"], status: "planejado" },
];

export const modulosDoPerfil = (p: PerfilId) => MODULOS.filter((m) => m.perfis.includes(p));
