# Modelo de módulo

Para criar um módulo novo:

1. Copie esta pasta para `src/modulos/<nome-do-modulo>/`.
2. Renomeie `Modelo.tsx` e escreva a página usando `useDados()` (dados já filtrados pelo perfil e pelos filtros globais) e as peças de `src/components`.
3. Registre o módulo em `src/config/modulos.tsx`: rota, nome, grupo do menu, ícone, perfis que podem ver e `status: "ativo"`.
4. Se precisar de uma base nova, acrescente-a em `src/core/dados/provedor.ts` (interface), no `provedor-mock.ts` (JSON fictício em `data/mock/`) e documente as variáveis em `docs/dicionario-dados.md`.

Nenhuma página acessa arquivos ou a API diretamente: tudo passa por `core/dados`.
