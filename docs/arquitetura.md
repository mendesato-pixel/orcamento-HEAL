# Arquitetura

## Camadas de dados (PostgreSQL, planejado)

| Schema | Camada | Conteúdo |
| --- | --- | --- |
| raw | Bruta | Cópia fiel de cada aba recebida, colunas como texto, mais arquivo, linha e data de carga |
| stg | Tratada | Tipos definidos, códigos padronizados, meses em formato longo (item × mês) |
| cad | Núcleo | Cadastros: centros de custo, contas, grupos de gasto, setores, cargos, fornecedores |
| ref | Núcleo | Listas de valores, parâmetros e regras de classificação e de qualidade |
| orc | Núcleo | Fatos orçados, com ano e rodada |
| ctb, fin, cus, com | Núcleo | Fatos realizados (contábil, financeiro, custos, comercial) |
| aud | Núcleo | Alertas, controle de arquivos, reclassificações |
| mart | Analítica | Visões que alimentam as telas |

## Aplicação

- As telas só falam com `src/core/dados/provedor.ts`.
- Hoje o provedor lê `data/mock/*.json`, com a mesma estrutura das visões do mart.
- Depois, `provedor-api.ts` lerá uma API sobre o PostgreSQL (por exemplo PostgREST ou um serviço próprio), sem mudar as telas.
- Perfis: cada módulo declara em `src/config/modulos.tsx` quais perfis podem vê-lo. Na versão real, a permissão é aplicada no banco (row-level security) e na API.
