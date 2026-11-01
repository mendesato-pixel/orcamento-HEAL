import { Suspense, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { modulosDoPerfil } from "../config/modulos";
import { PERFIS, type PerfilId } from "../config/perfis";
import { useApp } from "../core/acesso/contexto";
import { BarraFiltros } from "../core/filtros/BarraFiltros";
import { Icone } from "../components/Icone";
import { dataBR } from "../utils/formato";

export function Layout() {
  const { perfil, setPerfil, base } = useApp();
  const [menuAberto, setMenuAberto] = useState(false);
  const local = useLocation();
  const mods = modulosDoPerfil(perfil.id);
  const grupos = [...new Set(mods.map((m) => m.grupo))];
  const semFiltro = local.pathname.startsWith("/proximos") || local.pathname.startsWith("/planejado");

  return (
    <div className={`app ${menuAberto ? "menu-aberto" : ""}`}>
      <aside className="lateral">
        <div className="marca-app">
          <div className="logo" aria-hidden="true">H</div>
          <div>
            <strong>Orçamento HEAL</strong>
            <span>Sistema de análise orçamentária</span>
          </div>
        </div>
        <nav onClick={() => setMenuAberto(false)}>
          {grupos.map((g) => (
            <div key={g} className="nav-grupo">
              <div className="nav-titulo">{g}</div>
              {mods.filter((m) => m.grupo === g).map((m) =>
                m.status === "ativo" ? (
                  <NavLink key={m.id} to={m.rota} end={m.rota === "/"} className="nav-item">
                    <Icone nome={m.icone} /> {m.nome}
                  </NavLink>
                ) : (
                  <NavLink key={m.id} to={`/planejado/${m.id}`} className="nav-item nav-planejado" title="Módulo planejado">
                    <Icone nome={m.icone} /> {m.nome} <span className="nav-cadeado"><Icone nome="cadeado" tamanho={14} /></span>
                  </NavLink>
                ),
              )}
            </div>
          ))}
        </nav>
        <div className="lateral-rodape">
          <label className="perfil">
            <span>Ver como</span>
            <select value={perfil.id} onChange={(e) => setPerfil(e.target.value as PerfilId)}>
              {PERFIS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <small>{perfil.descricao}</small>
          </label>
          <div className="aviso-mock">Dados fictícios · estrutura igual ao consolidado 2027</div>
        </div>
      </aside>

      <div className="principal">
        <header className="topo">
          <button className="botao-icone so-celular" onClick={() => setMenuAberto(!menuAberto)} aria-label="Menu"><Icone nome="menu" /></button>
          {!semFiltro && <BarraFiltros />}
          <div className="topo-info">
            {base && <span>3ª rodada · dados até {dataBR(base.atualizadoEm)}</span>}
          </div>
        </header>
        <main>
          {base ? (
            <Suspense fallback={<div className="carregando">Carregando…</div>}><Outlet /></Suspense>
          ) : (
            <div className="carregando">Carregando dados…</div>
          )}
        </main>
      </div>
    </div>
  );
}
