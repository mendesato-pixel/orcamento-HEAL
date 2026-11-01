# Orçamento HEAL – sistema de análise orçamentária (mockup)

> **Todos os dados deste repositório são fictícios.** As variáveis, abas e regras seguem o consolidado do orçamento 2027, mas nenhum valor, item ou responsável é real.

Mockup navegável de um sistema de análise orçamentária que cresce módulo a módulo. Nesta fase ele cobre o orçamento 2027:

| Módulo | O que responde |
| --- | --- |
| Visão geral | Quanto foi pedido, onde está concentrado, como se distribui no ano e como evoluiu entre rodadas |
| Pedidos | Cada item com memória de cálculo, justificativa, alertas e origem (arquivo e linha) |
| 2026 × 2027 | Itens de continuidade que crescem acima de um limite de referência |
| Novas vagas | Custo em 2027, custo anual completo e vagas que não são aumento de quadro |
| Classificação | Tipo informado × classificação final, regras vigentes e reclassificações |
| Qualidade dos dados | Verificações automáticas, alertas por setor e conciliação das planilhas |
| Roteiro do sistema | Próximos módulos e as bases de dados que cada um exige |

O seletor **Ver como**, no canto inferior esquerdo, simula os perfis de acesso (gerente financeiro, Controladoria, diretoria, gestor de setor).

## Rodar localmente

```bash
npm install
npm run dev
```

Para regenerar os dados fictícios: `node scripts/gerar-mock/gerar.mjs`.

## Publicar

- **GitHub Pages:** em *Settings → Pages*, escolha *Source: GitHub Actions*. O workflow `.github/workflows/deploy-pages.yml` publica a cada push na `main`.
- **Vercel:** importe o repositório; o `vercel.json` já define build e pasta de saída.

O app usa rotas com `#`, então funciona nos dois sem configuração extra.

## Estrutura

```
data/mock/            dados fictícios com o nome das tabelas do dicionário
database/             estrutura planejada do PostgreSQL (documentação)
docs/                 dicionário de dados, arquitetura, perfis, decisões
scripts/gerar-mock/   gerador determinístico dos dados fictícios
src/app/              layout e rotas
src/config/           registro de módulos e perfis
src/core/dados/       interface única de dados (mock hoje, API depois)
src/core/acesso/      perfil ativo e filtros globais
src/core/filtros/     barra de filtros compartilhada
src/components/       tabelas, gráficos, KPIs, gaveta de detalhe
src/modulos/          um módulo por pasta (_modelo é o esqueleto)
src/types/            tipos que espelham o dicionário de dados
```

Para criar um módulo, veja `src/modulos/_modelo/README.md`.

## Cuidados

- Nunca versionar dados reais, planilhas ou credenciais. O `.gitignore` bloqueia `.env`, `*.xlsx`, `*.csv`, `*.pdf` e `data/real/`.
- O seletor de perfil do mockup só muda o que aparece na tela. Na versão real, as permissões ficam no servidor e no banco.
