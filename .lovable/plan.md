## Causa

O envio do briefing falha com erro de RLS (401) porque as tabelas `briefings` e `briefing_files` não têm `GRANT` de privilégios para os roles `anon`, `authenticated` e `service_role`. As políticas RLS já permitem o INSERT público, mas sem o GRANT na tabela, o Postgres bloqueia antes de avaliar a política.

## Correção

Migração única que adiciona os GRANTs faltantes:

- `briefings`: `INSERT` para `anon` e `authenticated`; `SELECT, UPDATE, DELETE` para `authenticated` (admin via RLS); `ALL` para `service_role`.
- `briefing_files`: mesmos grants de `briefings`.
- `user_roles`: `SELECT` para `authenticated`; `ALL` para `service_role`.

Nenhuma alteração de schema, política ou código frontend é necessária — só os GRANTs.

## Verificação

Após aplicar, abrir `/briefing`, preencher e enviar. Esperado: redirecionamento para `/briefing/sucesso` e novo registro visível no `/admin`.
