import { HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { MODULOS, modulosDoPerfil } from "../config/modulos";
import { ProvedorApp, useApp } from "../core/acesso/contexto";
import { Layout } from "./Layout";
import { ModuloPlanejado } from "../modulos/roadmap/Roadmap";

// HashRouter: as rotas funcionam no GitHub Pages e na Vercel sem configuração de servidor.
function Rotas() {
  const { perfil } = useApp();
  const mods = modulosDoPerfil(perfil.id).filter((m) => m.status === "ativo" && m.componente);
  const inicio = mods[0]?.rota ?? "/";
  return (
    <Routes>
      <Route element={<Layout />}>
        {mods.map((m) => {
          const C = m.componente!;
          return <Route key={m.id} path={m.rota} element={<C />} />;
        })}
        <Route path="/planejado/:id" element={<Planejado />} />
        <Route path="*" element={<Navigate to={inicio} replace />} />
      </Route>
    </Routes>
  );
}

function Planejado() {
  const { id } = useParams();
  const m = MODULOS.find((x) => x.id === id);
  return m ? <ModuloPlanejado id={m.id} /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <ProvedorApp>
        <Rotas />
      </ProvedorApp>
    </HashRouter>
  );
}
