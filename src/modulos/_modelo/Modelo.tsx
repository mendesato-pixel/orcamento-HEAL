import { Cartao, Kpi, Pagina } from "../../components/ui";
import { useDados } from "../../core/acesso/contexto";
import { reaisCurto, soma } from "../../utils/formato";

// Esqueleto de módulo: copie esta pasta e registre em src/config/modulos.tsx.
export default function Modelo() {
  const { pedidos } = useDados();
  return (
    <Pagina titulo="Novo módulo" resumo="Uma frase com a pergunta que esta página responde.">
      <div className="kpis kpis-3">
        <Kpi rotulo="Indicador" valor={reaisCurto(soma(pedidos, (p) => p.total_2027))} detalhe="contexto do número" />
      </div>
      <Cartao titulo="Análise principal">Conteúdo.</Cartao>
    </Pagina>
  );
}
