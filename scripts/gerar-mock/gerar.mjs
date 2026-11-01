// Gera dados FICTÍCIOS para o mockup, com as mesmas variáveis do
// consolidado do orçamento (DESP_E_INVEST, NOVAS_VAGAS, ALERTAS, CONTROLE_ARQUIVOS).
// Uso: node scripts/gerar-mock/gerar.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../../data/mock");
mkdirSync(OUT, { recursive: true });

// PRNG determinístico: os mesmos dados a cada execução
let seed = 20271031;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const between = (a, b) => a + rnd() * (b - a);
const round = (v, n = 2) => Math.round(v * 10 ** n) / 10 ** n;

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const MKEYS = MESES.map((m) => "valor_" + m.toLowerCase());

// ---------------- Cadastros (fictícios) ----------------
const DIRETORIAS = ["Diretoria Técnica", "Diretoria Assistencial", "Diretoria Administrativa"];
const SETORES = [
  ["CETAS", "CETAS", 0, [["210", "CETAS – Atendimento"], ["211", "CETAS – Oficinas"]], "Operacional"],
  ["ENF", "Enfermagem", 1, [["220", "Enfermagem – Postos"], ["221", "Enfermagem – Educação Permanente"]], "Operacional"],
  ["FARM", "Farmácia", 1, [["230", "Farmácia"]], "Operacional"],
  ["NUT", "Nutrição", 1, [["240", "Nutrição e Dietética"]], "Operacional"],
  ["SS", "Serviço Social", 1, [["250", "Serviço Social"]], "Operacional"],
  ["CCIH", "NISA/CCIH", 0, [["260", "NISA/CCIH"]], "Operacional"],
  ["MOR", "Moradia", 1, [["270", "Moradia Assistida"]], "Operacional"],
  ["DT", "Diretoria Técnica", 0, [["200", "Diretoria Técnica"]], "Operacional"],
  ["MAN", "Manutenção", 2, [["330", "Manutenção Predial"], ["331", "Manutenção de Equipamentos"]], "Administrativo"],
  ["HOT", "Hotelaria", 2, [["340", "Hotelaria e Limpeza"]], "Administrativo"],
  ["TI", "TI", 2, [["320", "Tecnologia da Informação"]], "Administrativo"],
  ["RH", "RH", 2, [["300", "Recursos Humanos"]], "Administrativo"],
  ["DP", "Departamento Pessoal", 2, [["301", "Departamento Pessoal"]], "Administrativo"],
  ["JUR", "Jurídico", 2, [["310", "Jurídico"]], "Administrativo"],
  ["COM", "Comunicação", 2, [["315", "Comunicação"]], "Administrativo"],
  ["COMP", "Compras", 2, [["325", "Compras e Suprimentos"]], "Administrativo"],
  ["FIN", "Financeiro", 2, [["305", "Financeiro e Controladoria"]], "Administrativo"],
];

// conta, grupo, tipo, sufixo contábil
const CONTAS = [
  ["Material de consumo", "Materiais", "Despesa", "01.001"],
  ["Material de escritório", "Materiais", "Despesa", "01.002"],
  ["Materiais médico-hospitalares", "Materiais", "Despesa", "01.003"],
  ["Medicamentos", "Materiais", "Despesa", "01.004"],
  ["Gêneros alimentícios", "Materiais", "Despesa", "01.005"],
  ["Uniformes e EPI", "Materiais", "Despesa", "01.006"],
  ["Bens de pequeno valor", "Materiais", "Despesa", "01.007"],
  ["Serviços de terceiros PJ", "Serviços de terceiros", "Despesa", "02.001"],
  ["Serviços de terceiros PF (RPA)", "Serviços de terceiros", "Despesa", "02.002"],
  ["Consultoria e assessoria", "Serviços de terceiros", "Despesa", "02.003"],
  ["Licenças e assinaturas de software", "Tecnologia (despesa)", "Despesa", "03.001"],
  ["Telecomunicações e internet", "Tecnologia (despesa)", "Despesa", "03.002"],
  ["Manutenção predial", "Manutenção e conservação", "Despesa", "04.001"],
  ["Manutenção de equipamentos", "Manutenção e conservação", "Despesa", "04.002"],
  ["Treinamento e capacitação", "Pessoal e benefícios", "Despesa", "05.001"],
  ["Exames e laudos ocupacionais", "Pessoal e benefícios", "Despesa", "05.002"],
  ["Eventos e atividades terapêuticas", "Atividades assistenciais", "Despesa", "06.001"],
  ["Máquinas e equipamentos", "Equipamentos e mobiliário", "Investimento", "1.2.3.01"],
  ["Equipamentos médico-hospitalares", "Equipamentos e mobiliário", "Investimento", "1.2.3.02"],
  ["Móveis e utensílios", "Equipamentos e mobiliário", "Investimento", "1.2.3.03"],
  ["Computadores e periféricos", "Tecnologia (investimento)", "Investimento", "1.2.3.04"],
  ["Software (licença perpétua)", "Tecnologia (investimento)", "Investimento", "1.2.4.01"],
  ["Instalações", "Instalações", "Investimento", "1.2.2.01"],
  ["Veículos", "Veículos", "Investimento", "1.2.3.05"],
];
const contaInfo = Object.fromEntries(CONTAS.map(([c, g, t, s]) => [c, { grupo: g, tipo: t, s }]));
const contabil = (conta, natureza) => {
  const c = contaInfo[conta];
  if (!c) return "";
  if (c.tipo === "Investimento") return c.s;
  return (natureza === "Operacional" ? "4.2." : "4.3.") + c.s;
};

// item, conta, frequência, faixa de valor unitário, faixa de quantidade
const ITENS = [
  ["Luvas de procedimento (caixa)", "Materiais médico-hospitalares", "Mensal", [28, 45], [20, 120]],
  ["Seringas e agulhas descartáveis", "Materiais médico-hospitalares", "Mensal", [0.6, 1.4], [400, 1500]],
  ["Curativos e coberturas especiais", "Materiais médico-hospitalares", "Mensal", [12, 60], [30, 150]],
  ["Medicamentos de uso contínuo", "Medicamentos", "Mensal", [3, 90], [200, 900]],
  ["Suplemento nutricional", "Gêneros alimentícios", "Mensal", [18, 55], [60, 300]],
  ["Hortifruti e perecíveis", "Gêneros alimentícios", "Mensal", [3500, 9000], [1, 1]],
  ["Material de limpeza e higienização", "Material de consumo", "Mensal", [900, 4200], [1, 2]],
  ["Papel A4 e suprimentos de impressão", "Material de escritório", "Mensal", [180, 650], [1, 3]],
  ["Uniformes da equipe", "Uniformes e EPI", "Anual", [85, 160], [20, 90]],
  ["EPIs para brigada de incêndio", "Uniformes e EPI", "Anual", [120, 380], [10, 30]],
  ["Ventilador de parede", "Bens de pequeno valor", "Única", [240, 480], [2, 10]],
  ["Cadeira de escritório", "Bens de pequeno valor", "Única", [650, 1150], [2, 12]],
  ["Serviço de dedetização e controle de pragas", "Serviços de terceiros PJ", "Trimestral", [2400, 5200], [1, 1]],
  ["Coleta de resíduos de saúde", "Serviços de terceiros PJ", "Mensal", [2800, 6500], [1, 1]],
  ["Lavanderia terceirizada", "Serviços de terceiros PJ", "Mensal", [9000, 21000], [1, 1]],
  ["Oficineiro de arte-terapia", "Serviços de terceiros PF (RPA)", "Mensal", [1600, 3400], [1, 2]],
  ["Assessoria jurídica trabalhista", "Consultoria e assessoria", "Mensal", [3500, 8000], [1, 1]],
  ["Auditoria externa das demonstrações", "Consultoria e assessoria", "Anual", [28000, 52000], [1, 1]],
  ["Sistema de ponto eletrônico (mensalidade)", "Licenças e assinaturas de software", "Mensal", [900, 2600], [1, 1]],
  ["Licenças de pacote de escritório", "Licenças e assinaturas de software", "Anual", [380, 620], [15, 60]],
  ["Link de internet dedicado", "Telecomunicações e internet", "Mensal", [1800, 4200], [1, 1]],
  ["Teleatendimento (central)", "Telecomunicações e internet", "Mensal", [2200, 5600], [1, 1]],
  ["Pintura de áreas comuns", "Manutenção predial", "Única", [18000, 65000], [1, 1]],
  ["Manutenção preventiva do sistema de ar-condicionado", "Manutenção de equipamentos", "Mensal", [2600, 7800], [1, 1]],
  ["Manutenção de elevadores", "Manutenção de equipamentos", "Mensal", [1900, 4200], [1, 1]],
  ["Calibração de equipamentos médicos", "Manutenção de equipamentos", "Anual", [9000, 26000], [1, 1]],
  ["Capacitação em segurança do paciente", "Treinamento e capacitação", "Única", [6000, 22000], [1, 1]],
  ["Exames periódicos (PCMSO)", "Exames e laudos ocupacionais", "Anual", [70, 140], [80, 260]],
  ["Passeios e atividades em grupo", "Eventos e atividades terapêuticas", "Mensal", [800, 3200], [1, 1]],
  ["Cama hospitalar elétrica", "Equipamentos médico-hospitalares", "Única", [6800, 14500], [2, 12]],
  ["Monitor multiparamétrico", "Equipamentos médico-hospitalares", "Única", [9500, 26000], [1, 4]],
  ["Cadeira de rodas", "Equipamentos médico-hospitalares", "Única", [1300, 3800], [2, 10]],
  ["Lavadora de piso industrial", "Máquinas e equipamentos", "Única", [9000, 24000], [1, 2]],
  ["Fogão industrial", "Máquinas e equipamentos", "Única", [4800, 12000], [1, 2]],
  ["Climatizador evaporativo", "Máquinas e equipamentos", "Única", [2200, 5200], [2, 8]],
  ["Armários para postos de enfermagem", "Móveis e utensílios", "Única", [1800, 4600], [4, 20]],
  ["Mobiliário para sala de convivência", "Móveis e utensílios", "Única", [12000, 38000], [1, 1]],
  ["Computadores (troca periódica)", "Computadores e periféricos", "Única", [3600, 5900], [4, 25]],
  ["Servidor de arquivos", "Computadores e periféricos", "Única", [22000, 48000], [1, 1]],
  ["Software de gestão de prontuário", "Software (licença perpétua)", "Única", [45000, 120000], [1, 1]],
  ["Adequação para AVCB", "Instalações", "Única", [60000, 260000], [1, 1]],
  ["Reforma de consultórios", "Instalações", "Única", [80000, 320000], [1, 1]],
  ["Van adaptada para transporte", "Veículos", "Única", [210000, 290000], [1, 1]],
];

// afinidade setor → itens (índices de palavras-chave)
const AFIN = {
  ENF: ["Luvas", "Seringas", "Curativos", "Cama", "Monitor", "Cadeira de rodas", "Armários", "segurança do paciente", "Uniformes"],
  FARM: ["Medicamentos", "Seringas", "Curativos", "Computadores", "Uniformes"],
  NUT: ["Suplemento", "Hortifruti", "Fogão", "Uniformes", "Climatizador"],
  CETAS: ["Oficineiro", "Passeios", "Reforma de consultórios", "Mobiliário", "Ventilador", "Teleatendimento"],
  SS: ["Passeios", "Papel", "Cadeira de escritório", "Computadores", "Van"],
  CCIH: ["Luvas", "Coleta de resíduos", "dedetização", "Licenças de pacote", "Capacitação", "Material de limpeza"],
  MOR: ["Hortifruti", "Material de limpeza", "Mobiliário", "Passeios", "Ventilador"],
  DT: ["Computadores", "Teleatendimento", "Climatizador", "Passeios", "Software de gestão", "Monitor", "Calibração"],
  MAN: ["Pintura", "ar-condicionado", "elevadores", "Adequação para AVCB", "Lavadora", "EPIs"],
  HOT: ["Lavanderia", "Material de limpeza", "Lavadora", "Uniformes", "dedetização"],
  TI: ["Link de internet", "Licenças de pacote", "Servidor", "Computadores", "Software de gestão"],
  RH: ["Exames periódicos", "EPIs", "Capacitação", "Licenças de pacote", "Cadeira de escritório"],
  DP: ["Sistema de ponto", "Papel", "Computadores"],
  JUR: ["Assessoria jurídica", "Papel", "Cadeira de escritório"],
  COM: ["Licenças de pacote", "Computadores", "Papel"],
  COMP: ["Papel", "Computadores", "Cadeira de escritório"],
  FIN: ["Auditoria externa", "Computadores", "Licenças de pacote", "Papel"],
};

const GERAIS = ["Papel", "Cadeira de escritório", "Computadores", "Licenças de pacote", "Material de limpeza", "Uniformes", "Ventilador", "Capacitação", "Climatizador", "Mobiliário", "Exames periódicos", "Link de internet", "Passeios", "Armários", "Teleatendimento", "EPIs", "Pintura", "Calibração", "ar-condicionado"];
const SITUACOES =["Novo", "Continuidade", "Substituição", "Ampliação"];
const PRIORIDADES = ["1 – Essencial", "2 – Importante", "3 – Desejável"];
const FONTES = ["Cotação de fornecedor", "Contrato vigente", "Histórico 2026", "Estimativa do setor", "Ata de registro de preço"];
const JUSTS = [
  "Garantir a continuidade do atendimento aos usuários.",
  "Adequação a exigência legal e sanitária.",
  "Substituição de itens com desgaste e risco operacional.",
  "Ampliação da capacidade de atendimento prevista para 2027.",
  "Redução de retrabalho e de custos de manutenção corretiva.",
  "Melhoria das condições de trabalho da equipe.",
];

// ---------------- Pedidos ----------------
const pedidos = [];
let pid = 0;
const addAlert = (p, tipo, detalhe) => p.alertas.push({ tipo, detalhe });

for (const [sig, nome, di, ccs, nat] of SETORES) {
  // itens típicos do setor + itens comuns a todos, sorteados sem repetição
  const proprios = ITENS.filter(([it]) => AFIN[sig].some((k) => it.includes(k)));
  const comuns = ITENS.filter(([it]) => GERAIS.some((k) => it.includes(k)) && !proprios.some(([p]) => p === it));
  const embaralhar = (a) => a.map((x) => [rnd(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const pool = [...proprios, ...embaralhar(comuns).slice(0, Math.round(between(8, 14)))];
  let linha = 8;
  for (const [base, conta, freq, vr, qr] of pool) {
    const item = base;
    const [cc, ccNome] = pick(ccs);
    const vu = round(between(...vr));
    const qtd = Math.max(1, Math.round(between(...qr)));
    const mi = freq === "Única" || freq === "Anual" ? Math.floor(between(0, 10)) : rnd() < 0.7 ? 0 : Math.floor(between(1, 6));
    const meses = Array(12).fill(0);
    for (let m = mi; m < 12; m++) {
      if (freq === "Mensal") meses[m] = vu * qtd;
      else if (freq === "Trimestral" && (m - mi) % 3 === 0) meses[m] = vu * qtd;
    }
    if (freq === "Única" || freq === "Anual") meses[mi] = vu * qtd;

    const info = contaInfo[conta];
    const p = {
      id: "",
      setor: nome,
      setor_sigla: sig,
      diretoria: DIRETORIAS[di],
      centro_custo_rotulo: `${cc} – ${ccNome}`,
      natureza_cc: nat,
      grupo_gasto: info.grupo,
      conta_orcamentaria: conta,
      conta_contabil: contabil(conta, nat),
      item_descricao: item,
      situacao: pick(SITUACOES),
      prioridade: rnd() < 0.45 ? PRIORIDADES[0] : rnd() < 0.6 ? PRIORIDADES[1] : PRIORIDADES[2],
      frequencia: freq,
      mes_inicio: MESES[mi],
      quantidade: qtd,
      valor_unitario: vu,
      base_calculo: `${qtd} × R$ ${vu.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (${freq.toLowerCase()})`,
      fonte_valor: pick(FONTES),
      valor_2026: null,
      justificativa: pick(JUSTS),
      tipo_informado: info.tipo,
      conta_informada: conta,
      classificacao_final: info.tipo,
      motivo_reclassificacao: "",
      alertas: [],
      status_linha: "OK",
      arquivo_origem: `Matriz_Orcamento_HEAL_2027_${sig}.xlsx`,
      linha_origem: linha++,
    };
    MKEYS.forEach((key, i) => (p[key] = round(meses[i])));
    p.total_2027 = round(meses.reduce((a, b) => a + b, 0));
    if (p.situacao === "Continuidade" && freq !== "Única") p.valor_2026 = round(p.total_2027 / between(0.92, 1.35));
    pedidos.push(p);
  }
}

// Reclassificações e alertas (proporções fictícias)
for (const p of pedidos) {
  const r = rnd();
  if (p.tipo_informado === "Despesa" && p.frequencia === "Mensal" && r < 0.08) {
    p.tipo_informado = "Investimento";
    p.motivo_reclassificacao = "Serviço/consumo recorrente lançado como investimento → despesa (regra 3).";
    addAlert(p, "Reclassificado", p.motivo_reclassificacao);
  } else if (p.tipo_informado === "Investimento" && p.item_descricao.includes("AVCB") && r < 0.6) {
    p.tipo_informado = "Despesa";
    p.conta_informada = "Manutenção predial";
    p.motivo_reclassificacao = "Obra de adequação AVCB → Instalações (investimento), regra 3.";
    addAlert(p, "Reclassificado", p.motivo_reclassificacao);
  } else if (r < 0.1) {
    p.tipo_informado = "";
    addAlert(p, "Classificação divergente", "Tipo em branco; classificado pela natureza da conta (regra 2).");
  }
  if (p.classificacao_final === "Investimento" && p.valor_unitario < 1200)
    addAlert(p, "Sugestão de classificação", "Valor unitário abaixo de R$ 1.200: avaliar como bem de pequeno valor (não altera o lançamento).");
  if (p.classificacao_final === "Despesa" && p.conta_orcamentaria !== "Bens de pequeno valor" && p.valor_unitario >= 1200 && p.frequencia === "Única" && rnd() < 0.5)
    addAlert(p, "Sugestão de classificação", "Bem durável acima de R$ 1.200 em conta de despesa: avaliar como investimento.");
  if (p.total_2027 >= 500000) addAlert(p, "Alto valor", "Pedido ≥ R$ 500 mil – validar orçamento e escopo.");
}
// Casos pontuais para as telas de qualidade
const byItem = (s) => pedidos.filter((p) => p.item_descricao.includes(s));
const atip = byItem("Reforma de consultórios")[0] || pedidos[3];
atip.frequencia = "Mensal"; atip.mes_inicio = "JAN";
MKEYS.forEach((k) => (atip[k] = atip.valor_unitario));
atip.total_2027 = round(atip.valor_unitario * 12);
addAlert(atip, "Provável erro de frequência", "Obra única lançada como mensal (12×). Confirmar com o setor.");
addAlert(atip, "Valor atípico", "Valor muito acima do padrão do setor.");
for (const p of pedidos.filter((x) => x.setor_sigla === "DT").slice(0, 3)) {
  p.status_linha = "Erro de fórmula na origem";
  addAlert(p, "Cálculo refeito", "Fórmula da planilha de origem retornou erro; valor recalculado pela quantidade × valor unitário.");
}
for (const p of pedidos.filter((x) => x.setor_sigla === "DT").slice(3, 6)) {
  const novo = pick(["350", "351", "357"]);
  p.centro_custo_rotulo = `${novo} – (não cadastrado)`;
  addAlert(p, "Centro de custo", `CC ${novo} não existe no cadastro de centros de custo.`);
}
for (const p of pedidos.filter((x) => x.setor_sigla === "JUR").slice(0, 2)) {
  addAlert(p, "Centro de custo corrigido", "Informado CC 314 (inexistente); consolidado em 310 – Jurídico.");
}
for (const p of pedidos.filter((x) => x.setor_sigla === "MOR").slice(0, 2)) {
  addAlert(p, "Possível custo corrente", "Linha parece custo já existente da operação, não pedido novo.");
}
for (const p of pedidos.filter((x) => x.setor_sigla === "SS")) {
  if (rnd() < 0.3) addAlert(p, "Mês ajustado", "Sem mês de início informado; lançado em JAN.");
}
for (const p of pedidos) if (p.alertas.length && p.status_linha === "OK") p.status_linha = "Com alerta";

pedidos.sort((a, b) => a.setor.localeCompare(b.setor) || a.linha_origem - b.linha_origem);
pedidos.forEach((p, i) => (p.id = (p.classificacao_final === "Despesa" ? "D-" : "I-") + String(i + 1).padStart(3, "0")));

// ---------------- Novas vagas ----------------
const FATOR = 1.72;
const VAGAS_DEF = [
  ["ENF", "Técnico de enfermagem", 4, 3200, "Nova ala com 12 leitos prevista para o 2º semestre."],
  ["ENF", "Enfermeiro", 2, 5600, "Cobertura do plantão noturno."],
  ["CETAS", "Psicólogo", 1, 5200, "Demanda reprimida de atendimentos em grupo."],
  ["CETAS", "Terapeuta ocupacional", 1, 4800, "Ampliação das oficinas terapêuticas."],
  ["NUT", "Auxiliar de cozinha", 2, 2100, "Aumento de refeições servidas."],
  ["MOR", "Cuidador", 3, 0, "Nova casa de moradia assistida."],
  ["MAN", "Auxiliar de manutenção", 2, 2400, "Reduzir dependência de terceiros em pequenos reparos."],
  ["HOT", "Auxiliar de limpeza", 3, 1950, "Expansão de área construída."],
  ["TI", "Analista de suporte", 1, 4600, "Substituição de assistente por analista, sem ampliação do quadro."],
  ["CCIH", "Enfermeiro de controle de infecção", 1, 6200, "Adequação salarial de colaboradora."],
  ["DP", "Analista de DP", 1, 4300, "Substituição de função existente."],
  ["SS", "Assistente social", 1, 4900, "Acompanhamento de famílias na moradia."],
  ["FARM", "Farmacêutico", 1, 6100, "Cobertura de responsabilidade técnica no fim de semana."],
  ["RH", "Analista de treinamento", 1, 4500, "Programa de educação permanente."],
  ["COM", "Jovem aprendiz", 1, 1100, "Apoio à produção de conteúdo."],
  ["FIN", "Analista de custos", 1, 5800, "Implantação de custeio por centro de custo."],
  ["DT", "Médico psiquiatra (20h)", 1, 11500, "Ampliação da cobertura médica."],
  ["CETAS", "Educador físico (autônomo 1×/semana)", 1, 1400, "Atividades físicas semanais."],
];
const vagas = VAGAS_DEF.map(([sig, cargo, qtd, sal, just], i) => {
  const s = SETORES.find((x) => x[0] === sig);
  const [cc, ccNome] = s[3][0];
  const mi = Math.floor(between(0, 7));
  const cm = round(sal * FATOR * 13 / 12);
  const v = {
    id: "V-" + String(i + 1).padStart(2, "0"),
    setor: s[1], setor_sigla: sig, diretoria: DIRETORIAS[s[2]],
    centro_custo_rotulo: `${cc} – ${ccNome}`,
    cargo, qtd_vagas: qtd, mes_inicio: MESES[mi],
    prioridade: pick(PRIORIDADES), justificativa: just,
    salario_base: sal, fator_encargos: FATOR, custo_mensal_vaga: cm,
    alertas: [], arquivo_origem: `Matriz_Orcamento_HEAL_2027_${sig}.xlsx`, linha_origem: 8 + i % 3,
  };
  MKEYS.forEach((k, m) => (v[k] = m >= mi ? round(cm * qtd) : 0));
  v.total_2027 = round(MKEYS.reduce((a, k) => a + v[k], 0));
  if (sal === 0) v.alertas.push({ tipo: "Sem valor", detalhe: "Cargo fora da tabela do RH e salário não informado – custo ficou zero." });
  if (/Substituição|sem ampliação|Adequação salarial/.test(just)) v.alertas.push({ tipo: "Não é aumento de quadro", detalhe: "Justificativa indica substituição ou ajuste salarial. Avaliar só a diferença." });
  if (/autônomo/.test(cargo)) v.alertas.push({ tipo: "Classificação", detalhe: "Autônomo seria serviço PF (RPA), não vaga CLT; fator de encargos não se aplica." });
  if (/aprendiz/i.test(cargo)) v.alertas.push({ tipo: "Pessoal fora de NOVAS_VAGAS", detalhe: "Também aparece em PEDIDOS do setor; evitar duplicidade." });
  return v;
});

// ---------------- Alertas (formato da aba ALERTAS) ----------------
const alertas = [];
for (const p of pedidos) for (const a of p.alertas) alertas.push({ id_item: p.id, setor: p.setor, item: p.item_descricao, classificacao_final: p.classificacao_final, total_2027: p.total_2027, tipo_alerta: a.tipo, detalhe: a.detalhe, status: rnd() < 0.35 ? "Resolvido" : "Aberto" });
for (const v of vagas) for (const a of v.alertas) alertas.push({ id_item: v.id, setor: v.setor, item: "Vaga: " + v.cargo, classificacao_final: "Despesa (pessoal)", total_2027: v.total_2027, tipo_alerta: a.tipo, detalhe: a.detalhe, status: "Aberto" });

// ---------------- Controle de arquivos ----------------
const sum = (arr, f) => round(arr.reduce((a, x) => a + f(x), 0));
const controle = SETORES.map(([sig, nome, , , ], i) => {
  const ps = pedidos.filter((p) => p.setor_sigla === sig);
  const vs = vagas.filter((v) => v.setor_sigla === sig);
  const desp = sum(ps.filter((p) => p.classificacao_final === "Despesa"), (p) => p.total_2027);
  const inv = sum(ps.filter((p) => p.classificacao_final === "Investimento"), (p) => p.total_2027);
  const vag = sum(vs, (v) => v.total_2027);
  let ajuste = 0, obs = "Sem diferença.";
  if (sig === "DT") { ajuste = sum(ps.filter((p) => p.status_linha.startsWith("Erro")), (p) => p.total_2027); obs = "Diferença = linhas com erro de fórmula na origem, recalculadas."; }
  if (sig === "FARM") { ajuste = round(between(3000, 7000)); obs = "Uniformes com quantidade em branco zeravam o valor."; }
  if (sig === "MOR") obs = "Vaga de cuidador sem salário (custo zero).";
  if (sig === "JUR") obs = "CC 314 corrigido para 310. Arquivo sem responsável preenchido.";
  const dia = 18 + (i % 9);
  return {
    arquivo: `Matriz_Orcamento_HEAL_2027_${sig}.xlsx`, setor: nome,
    responsavel: sig === "JUR" ? "(não preenchido)" : `Responsável ${String(i + 1).padStart(2, "0")}`,
    cargo_area: `Coordenação – ${nome}`, data: `2026-10-${dia}`,
    data_prevista: "2026-10-24", usado: "Sim",
    total_pedidos_arquivo: round(desp + inv - ajuste), total_vagas_arquivo: vag,
    consolidado_despesas: desp, consolidado_investimentos: inv, consolidado_vagas: vag,
    diferenca: round(ajuste), observacao: obs,
  };
});
controle.push(
  { arquivo: "Matriz_Orcamento_HEAL_2027_RH_II.xlsx", setor: "RH", responsavel: "Responsável 12", cargo_area: "Coordenação – RH", data: "2026-10-21", data_prevista: "2026-10-24", usado: "Não – versão anterior", total_pedidos_arquivo: 0, total_vagas_arquivo: 0, consolidado_despesas: 0, consolidado_investimentos: 0, consolidado_vagas: 0, diferenca: 0, observacao: "Versão anterior do arquivo do RH – excluída para não duplicar." },
  { arquivo: "Matriz_Orcamento_HEAL_2027_MAN_v1.xlsx", setor: "Manutenção", responsavel: "Responsável 09", cargo_area: "Coordenação – Manutenção", data: "2026-10-23", data_prevista: "2026-10-24", usado: "Não – versão anterior", total_pedidos_arquivo: 0, total_vagas_arquivo: 0, consolidado_despesas: 0, consolidado_investimentos: 0, consolidado_vagas: 0, diferenca: 0, observacao: "Versão anterior, sem a vaga – excluída." },
);

// ---------------- Rodadas de consolidação ----------------
const tot = (cls) => sum(pedidos.filter((p) => p.classificacao_final === cls), (p) => p.total_2027);
const D = tot("Despesa"), I = tot("Investimento"), V = sum(vagas, (v) => v.total_2027);
const rodadas = [
  { rodada: "1ª rodada", data: "2026-10-24", despesas: round(D * 1.18), investimentos: round(I * 0.83), vagas: round(V * 1.1), alertas_abertos: 142 },
  { rodada: "2ª rodada", data: "2026-10-28", despesas: round(D * 1.06), investimentos: round(I * 0.94), vagas: round(V * 1.02), alertas_abertos: 97 },
  { rodada: "3ª rodada", data: "2026-10-31", despesas: D, investimentos: I, vagas: V, alertas_abertos: alertas.filter((a) => a.status === "Aberto").length },
];

const write = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 1));
write("orc_consolidado_itens.json", pedidos);
write("orc_novas_vagas.json", vagas);
write("aud_alertas.json", alertas);
write("aud_controle_arquivos.json", controle);
write("orc_rodadas.json", rodadas);
write("cad_centros_custo.json", SETORES.flatMap(([, , di, ccs, nat]) => ccs.map(([c, n]) => ({ codigo_cc: c, rotulo_cc: `${c} – ${n}`, diretoria: DIRETORIAS[di], natureza: nat }))));
write("cad_contas_orcamentarias.json", CONTAS.map(([c, g, t, s]) => ({ conta: c, grupo_gasto: g, tipo: t, codigo_operacional: t === "Despesa" ? "4.2." + s : s, codigo_administrativo: t === "Despesa" ? "4.3." + s : s })));
console.log(`pedidos ${pedidos.length} | vagas ${vagas.length} | alertas ${alertas.length}`);
console.log(`despesas ${D.toFixed(0)} | investimentos ${I.toFixed(0)} | vagas ${V.toFixed(0)}`);
