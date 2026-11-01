// Filtros globais (diretoria e setor), compartilhados por todas as páginas.
import { useMemo } from "react";
import { useApp } from "../acesso/contexto";

export function BarraFiltros() {
  const { base, filtros, setFiltros, perfil } = useApp();
  const diretorias = useMemo(() => [...new Set(base?.pedidos.map((p) => p.diretoria))].sort(), [base]);
  const setores = useMemo(
    () => [...new Set(base?.pedidos.filter((p) => !filtros.diretoria || p.diretoria === filtros.diretoria).map((p) => p.setor))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [base, filtros.diretoria],
  );

  if (perfil.setorFixo) {
    return <div className="filtros"><span className="filtro-fixo">Setor: <strong>{perfil.setorFixo}</strong> (definido pelo perfil)</span></div>;
  }
  return (
    <div className="filtros">
      <label>
        <span>Diretoria</span>
        <select value={filtros.diretoria} onChange={(e) => setFiltros({ diretoria: e.target.value, setor: "" })}>
          <option value="">Todas</option>
          {diretorias.map((d) => <option key={d}>{d}</option>)}
        </select>
      </label>
      <label>
        <span>Setor</span>
        <select value={filtros.setor} onChange={(e) => setFiltros({ ...filtros, setor: e.target.value })}>
          <option value="">Todos</option>
          {setores.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      {(filtros.diretoria || filtros.setor) && (
        <button className="botao-link" onClick={() => setFiltros({ diretoria: "", setor: "" })}>Limpar filtros</button>
      )}
    </div>
  );
}
