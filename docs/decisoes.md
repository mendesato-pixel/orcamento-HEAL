# Registro de decisões

| Data | Decisão | Motivo |
| --- | --- | --- |
| 01/11/2026 | Vite + React + TypeScript, build estático | Publica no GitHub Pages e na Vercel sem servidor |
| 01/11/2026 | Rotas com `#` (HashRouter) | Evita configurar fallback de rotas no Pages |
| 01/11/2026 | Dados fictícios gerados por script determinístico | Repositório público temporário; nenhuma informação real versionada |
| 01/11/2026 | Interface única de dados (`core/dados`) | Trocar mock por API sem reescrever telas |
| 01/11/2026 | Módulos registrados em `config/modulos.tsx` com perfis | Crescer módulo a módulo e preparar controle de acesso |

## Regras de classificação (3ª rodada, 31/10/2026)

1. Vale o tipo informado pelo setor quando coerente com a natureza da conta (1.2.x = investimento; 4.x = despesa).
2. Tipo em conflito com a conta, ou conta em branco/fora da lista → natureza da conta.
3. Mensalidades, assinaturas, serviços e consumo recorrente lançados como investimento → despesa; obras AVCB → Instalações (investimento).
4. Limite de R$ 1.200 (bens de pequeno valor) gera só sugestão nos alertas.
