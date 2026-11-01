import type { ProvedorDados } from "./provedor";
import type { AlertaLinha, ControleArquivo, Pedido, Rodada, Vaga } from "../../types";
import pedidos from "../../../data/mock/orc_consolidado_itens.json";
import vagas from "../../../data/mock/orc_novas_vagas.json";
import alertas from "../../../data/mock/aud_alertas.json";
import controle from "../../../data/mock/aud_controle_arquivos.json";
import rodadas from "../../../data/mock/orc_rodadas.json";

export const provedorMock: ProvedorDados = {
  async carregar() {
    return {
      pedidos: pedidos as unknown as Pedido[],
      vagas: vagas as unknown as Vaga[],
      alertas: alertas as AlertaLinha[],
      controle: controle as ControleArquivo[],
      rodadas: rodadas as Rodada[],
      atualizadoEm: "2026-10-31",
      fonte: "mock",
    };
  },
};
