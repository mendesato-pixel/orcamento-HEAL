// Tabela genérica com ordenação por coluna e paginação simples.
import { useMemo, useState, type ReactNode } from "react";

export interface Coluna<T> {
  id: string;
  titulo: string;
  valor: (x: T) => string | number | null;
  render?: (x: T) => ReactNode;
  num?: boolean;
  largura?: string;
}

export function Tabela<T>({ linhas, colunas, onLinha, ordemInicial, porPagina = 25, chave }: {
  linhas: T[];
  colunas: Coluna<T>[];
  onLinha?: (x: T) => void;
  ordemInicial?: { id: string; desc: boolean };
  porPagina?: number;
  chave: (x: T) => string;
}) {
  const [ordem, setOrdem] = useState(ordemInicial ?? { id: colunas[0].id, desc: false });
  const [pag, setPag] = useState(0);

  const ordenadas = useMemo(() => {
    const c = colunas.find((x) => x.id === ordem.id);
    if (!c) return linhas;
    return [...linhas].sort((a, b) => {
      const va = c.valor(a), vb = c.valor(b);
      const r = typeof va === "number" && typeof vb === "number" ? va - vb : String(va ?? "").localeCompare(String(vb ?? ""), "pt-BR");
      return ordem.desc ? -r : r;
    });
  }, [linhas, colunas, ordem]);

  const total = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const p = Math.min(pag, total - 1);
  const visiveis = ordenadas.slice(p * porPagina, (p + 1) * porPagina);

  return (
    <div className="tabela-envelope">
      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              {colunas.map((c) => (
                <th key={c.id} className={c.num ? "num" : ""} style={{ width: c.largura }}
                  aria-sort={ordem.id === c.id ? (ordem.desc ? "descending" : "ascending") : "none"}>
                  <button onClick={() => setOrdem({ id: c.id, desc: ordem.id === c.id ? !ordem.desc : !!c.num })}>
                    {c.titulo}
                    <span className="seta">{ordem.id === c.id ? (ordem.desc ? "↓" : "↑") : ""}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.map((x) => (
              <tr key={chave(x)} onClick={onLinha ? () => onLinha(x) : undefined} className={onLinha ? "clicavel" : ""}>
                {colunas.map((c) => (
                  <td key={c.id} className={c.num ? "num" : ""}>{c.render ? c.render(x) : c.valor(x)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 1 && (
        <div className="paginacao">
          <span>{ordenadas.length} linhas</span>
          <button disabled={p === 0} onClick={() => setPag(p - 1)}>Anterior</button>
          <span>{p + 1} de {total}</span>
          <button disabled={p >= total - 1} onClick={() => setPag(p + 1)}>Próxima</button>
        </div>
      )}
    </div>
  );
}
