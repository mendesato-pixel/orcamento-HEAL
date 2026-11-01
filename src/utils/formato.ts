const brl0 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const brl2 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
const num = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export const reais = (v: number | null | undefined) => (v == null ? "–" : brl0.format(v));
export const reaisCentavos = (v: number | null | undefined) => (v == null ? "–" : brl2.format(v));
export const numero = (v: number) => num.format(v);
export const pct = (v: number, casas = 1) => `${(v * 100).toLocaleString("pt-BR", { maximumFractionDigits: casas, minimumFractionDigits: casas })}%`;

/** R$ 1,2 mi · R$ 840 mil · R$ 950 */
export const reaisCurto = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1e6) return `R$ ${(v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  if (a >= 1e3) return `R$ ${(v / 1e3).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} mil`;
  return brl0.format(v);
};

export const soma = <T,>(arr: T[], f: (x: T) => number) => arr.reduce((a, x) => a + (f(x) || 0), 0);

export const agrupar = <T,>(arr: T[], chave: (x: T) => string) => {
  const m = new Map<string, T[]>();
  for (const x of arr) {
    const k = chave(x);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(x);
  }
  return m;
};

export const dataBR = (iso: string) => iso.split("-").reverse().join("/");

export const baixarCSV = (nome: string, linhas: Record<string, unknown>[]) => {
  if (!linhas.length) return;
  const cols = Object.keys(linhas[0]);
  const esc = (v: unknown) => {
    const s = typeof v === "object" && v !== null ? JSON.stringify(v) : String(v ?? "");
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(";"), ...linhas.map((l) => cols.map((c) => esc(l[c])).join(";"))].join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
};
