// Interface única de acesso aos dados. As páginas só conhecem esta interface.
// Hoje: provedor-mock (JSON fictício). Depois: provedor-api (PostgreSQL via API),
// sem mudar nenhuma página.
import type { AlertaLinha, ControleArquivo, Pedido, Rodada, Vaga } from "../../types";

export interface BaseOrcamento {
  pedidos: Pedido[];
  vagas: Vaga[];
  alertas: AlertaLinha[];
  controle: ControleArquivo[];
  rodadas: Rodada[];
  atualizadoEm: string;
  fonte: "mock" | "api";
}

export interface ProvedorDados {
  carregar(): Promise<BaseOrcamento>;
}

export { provedorMock as provedor } from "./provedor-mock";
