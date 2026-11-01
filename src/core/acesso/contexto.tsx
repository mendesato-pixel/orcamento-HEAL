// Estado global do mockup: perfil ativo, filtros compartilhados e dados já filtrados.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PERFIS, type Perfil, type PerfilId } from "../../config/perfis";
import { provedor, type BaseOrcamento } from "../dados/provedor";

export interface Filtros { diretoria: string; setor: string }

interface Ctx {
  perfil: Perfil;
  setPerfil: (id: PerfilId) => void;
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
  base: BaseOrcamento | null;
  /** dados recortados pelo perfil e pelos filtros globais */
  dados: BaseOrcamento | null;
}

const Contexto = createContext<Ctx | null>(null);

const lerPerfil = (): PerfilId => {
  try {
    const v = localStorage.getItem("perfil") as PerfilId | null;
    if (v && PERFIS.some((p) => p.id === v)) return v;
  } catch { /* armazenamento indisponível */ }
  return "gerente_financeiro";
};

export function ProvedorApp({ children }: { children: ReactNode }) {
  const [perfilId, setPerfilId] = useState<PerfilId>(lerPerfil);
  const [filtros, setFiltros] = useState<Filtros>({ diretoria: "", setor: "" });
  const [base, setBase] = useState<BaseOrcamento | null>(null);

  useEffect(() => { provedor.carregar().then(setBase); }, []);

  const perfil = PERFIS.find((p) => p.id === perfilId)!;
  const setPerfil = (id: PerfilId) => {
    setPerfilId(id);
    setFiltros({ diretoria: "", setor: "" });
    try { localStorage.setItem("perfil", id); } catch { /* ignora */ }
  };

  const dados = useMemo(() => {
    if (!base) return null;
    const setor = perfil.setorFixo || filtros.setor;
    const ok = (x: { setor: string; diretoria?: string }) =>
      (!setor || x.setor === setor) && (!filtros.diretoria || x.diretoria === filtros.diretoria);
    const pedidos = base.pedidos.filter(ok);
    const vagas = base.vagas.filter(ok);
    const ids = new Set([...pedidos.map((p) => p.id), ...vagas.map((v) => v.id)]);
    return {
      ...base,
      pedidos,
      vagas,
      alertas: base.alertas.filter((a) => ids.has(a.id_item)),
      controle: base.controle.filter((c) => !setor || c.setor === setor),
    };
  }, [base, perfil, filtros]);

  return <Contexto.Provider value={{ perfil, setPerfil, filtros, setFiltros, base, dados }}>{children}</Contexto.Provider>;
}

export const useApp = () => {
  const c = useContext(Contexto);
  if (!c) throw new Error("useApp fora do ProvedorApp");
  return c;
};

/** Dados prontos para a página (já filtrados). */
export const useDados = () => useApp().dados!;
export const temFiltro = (f: Filtros, p: Perfil) => !!(f.diretoria || f.setor || p.setorFixo);
