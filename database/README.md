# database/

Estrutura planejada do PostgreSQL. Ainda sem scripts: esta pasta guarda a organização que os arquivos seguirão.

- `schemas/` — um arquivo por schema (raw, stg, cad, ref, orc, ctb, fin, cus, com, aud, mart), na ordem de criação.
- `regras-qualidade/` — regras de verificação com descrição, severidade (bloqueante ou aviso) e área responsável.

Veja `docs/arquitetura.md`.
