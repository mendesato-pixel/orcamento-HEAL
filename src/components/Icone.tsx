const P: Record<string, string> = {
  painel: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z",
  lista: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  tendencia: "M3 17l6-6 4 4 8-8M15 7h6v6",
  pessoas: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  balanca: "M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0zM19 7l-3 7a4 4 0 0 0 6 0zM8 21h8",
  escudo: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  mapa: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
  alvo: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  pareto: "M3 21V10h4v11M10 21V14h4v7M17 21v-4h4v4M3 6c6 0 12 1 18 9",
  moeda: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9a3 3 0 0 0-3-2c-2 0-3 1-3 2.5S10 12 12 12s3 1 3 2.5-1 2.5-3 2.5a3 3 0 0 1-3-2M12 5v2M12 17v2",
  cadeado: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  baixar: "M12 3v12M7 10l5 5 5-5M5 21h14",
  fechar: "M6 6l12 12M18 6L6 18",
  alerta: "M12 3l10 18H2zM12 10v5M12 18h.01",
  menu: "M3 6h18M3 12h18M3 18h18",
  busca: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
};

export function Icone({ nome, tamanho = 18 }: { nome: string; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[nome] || P.painel} />
    </svg>
  );
}
