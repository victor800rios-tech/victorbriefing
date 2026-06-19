
## Visão Geral

Aplicação web "Briefing para Desenvolvimento de Site" com duas áreas:

- **Pública**: landing + wizard de 9 seções (29 perguntas) com upload de arquivos, salvamento automático no navegador, e tela de confirmação.
- **Admin** (protegida): dashboard com métricas, tabela de briefings com busca/filtros/ordenação, visualização e edição de respostas, mudança de status e exclusão.

Visual: direção **Precision corporate (dark)** — fundo `#09090b`, cards `#121214`, accent indigo `#6366f1`, tipografia Geist, bordas arredondadas, sombras sutis, animações discretas (Framer Motion).

Stack: React + TypeScript + Tailwind v4 + shadcn/ui + React Hook Form + Zod + Framer Motion + TanStack Router/Query + Lovable Cloud (Postgres + Auth + Storage).

---

## Estrutura de Rotas

```text
/                            -> Landing pública
/briefing                    -> Wizard (9 etapas, público)
/briefing/sucesso            -> Tela de confirmação
/auth                        -> Login admin (e-mail/senha)
/_authenticated/admin        -> Dashboard
/_authenticated/admin/$id    -> Detalhe do briefing
```

Apenas o e-mail **victor008rios@gmail.com** terá o papel `admin` (atribuído via seed na migração). Demais cadastros ficam sem acesso ao painel.

---

## Backend (Lovable Cloud)

### Tabelas

**`briefings`** — uma linha por envio, com colunas para cada uma das 29 perguntas (texto/booleano/array conforme a pergunta), além de:
- `id` (uuid), `created_at`, `updated_at`
- `empresa` (text, indexado para busca)
- `responsavel` (text, indexado para busca)
- `data_briefing` (date)
- `status` enum: `novo | em_analise | proposta_enviada | em_desenvolvimento | concluido` (default `novo`)

**`briefing_files`** — arquivos enviados, ligados a `briefing_id`:
- `id`, `briefing_id` (FK cascade), `field_key` (ex.: `identidade_visual`), `file_path`, `file_name`, `mime_type`, `size_bytes`, `created_at`

**`user_roles`** + enum `app_role ('admin')` + função `has_role()` (padrão obrigatório, evita recursão de RLS).

### RLS (políticas)

- `briefings`: `INSERT` permitido a `anon` + `authenticated` (briefing público). `SELECT/UPDATE/DELETE` apenas para `admin` via `has_role(auth.uid(), 'admin')`.
- `briefing_files`: mesmas regras de `briefings`.
- `user_roles`: `SELECT` apenas para o próprio usuário; mutações só via service role.
- `GRANT`s explícitos (INSERT anon; SELECT/INSERT/UPDATE/DELETE authenticated; ALL service_role).

### Storage

Bucket **privado** `briefing-uploads`. Upload no envio (anônimo) via política `INSERT` permitindo `anon` no bucket. Leitura/exclusão apenas para `admin` (URLs assinadas geradas server-side).

---

## Frontend

### Landing `/`
Hero centralizado com título "Briefing para Desenvolvimento de Site", descrição e botão **Iniciar Briefing** → `/briefing`. Navbar com logo e link "Entrar" (admin).

### Wizard `/briefing`
- Layout split-screen: painel esquerdo (contexto da seção + barra de progresso de 9 pílulas) e painel direito (campos).
- 9 etapas (Sobre a Empresa, Identidade Visual, Objetivo, Estrutura, Funcionalidades, Conteúdo, Referências, Aspectos Técnicos, Prazo/Investimento) + uma etapa inicial de Identificação (empresa, responsável, data).
- Validação com Zod por etapa (React Hook Form `trigger` antes de avançar).
- Botões **Anterior** / **Próximo**; última etapa: **Enviar Briefing**.
- **Autosave** em `localStorage` (debounce 500ms), restaurado ao abrir.
- Upload com dropzone (etapa Identidade Visual): aceita imagens, PDFs, documentos; limite 20 MB/arquivo; preview da lista de arquivos.
- Transições entre etapas com Framer Motion (fade + slide horizontal).

### Envio
Ao clicar em **Enviar Briefing**:
1. Validação global Zod.
2. Upload de arquivos para bucket → coleta de `file_path`.
3. `INSERT` em `briefings` + `INSERT` em `briefing_files`.
4. Limpa `localStorage` e redireciona para `/briefing/sucesso`.

### Sucesso `/briefing/sucesso`
Card centralizado com ícone de check animado e a mensagem fornecida.

### Auth `/auth`
Login por e-mail/senha (Lovable Cloud Auth, autoconfirm habilitado). Sem cadastro público — só o admin já provisionado entra. Erros amigáveis.

### Admin `/_authenticated/admin`
Sidebar fixa minimal + conteúdo.
- **Header**: título + indicador "X novos este mês".
- **Métricas** (6 cards): Total, Novos, Em análise, Proposta enviada, Em desenvolvimento, Concluídos.
- **Tabela** (shadcn `Table`): Empresa, Responsável, Data, Status (badge colorida), Ação (Visualizar).
- **Busca** por empresa/responsável (input com debounce).
- **Filtros** por status (Select multi).
- **Ordenação** por data (asc/desc).
- Dados via TanStack Query.

### Detalhe `/_authenticated/admin/$id`
- Cabeçalho com Empresa, Responsável, Data, Status (Select para alterar — update otimista).
- Conteúdo organizado pelas 9 seções, cada resposta editável inline (modo edição por seção, salva no banco).
- Lista de anexos com download via URL assinada.
- Botão **Excluir** com confirmação (AlertDialog) — remove arquivos do bucket e linha do banco.

---

## Componentização

```text
src/
  routes/                       (rotas TanStack)
  components/
    landing/Hero.tsx
    wizard/
      WizardShell.tsx           (split-screen + progresso + navegação)
      StepIdentificacao.tsx
      StepEmpresa.tsx
      StepIdentidade.tsx        (com FileDropzone)
      StepObjetivo.tsx
      StepEstrutura.tsx
      StepFuncionalidades.tsx
      StepConteudo.tsx
      StepReferencias.tsx
      StepTecnicos.tsx
      StepPrazoInvestimento.tsx
      FileDropzone.tsx
      ProgressPills.tsx
    admin/
      AdminShell.tsx (sidebar)
      MetricsGrid.tsx
      BriefingsTable.tsx
      StatusBadge.tsx
      BriefingDetail.tsx
      SectionEditor.tsx
      FileList.tsx
    ui/                         (shadcn)
  lib/
    briefing-schema.ts          (Zod por etapa + união final)
    briefing-storage.ts         (autosave localStorage)
    status.ts                   (labels/cores de status)
    supabase-queries.ts         (helpers React Query)
  hooks/
    useAutosave.ts
    useBriefings.ts             (list/get/update/delete)
  integrations/supabase/        (gerado)
  styles.css                    (tokens dark + Geist)
```

---

## Detalhes Técnicos

- **Tailwind v4**: tokens (`--color-brand-bg`, `--color-brand-card`, `--color-brand-primary`, `--color-brand-border`, `--color-brand-text-muted`, `--font-geist`) em `src/styles.css` via `@theme`.
- **Geist**: carregado via `<link>` no `__root.tsx` (não via `@import` no CSS).
- **Framer Motion**: `AnimatePresence` no Wizard para transições de etapa; entrada suave de cards no dashboard.
- **shadcn**: Button, Input, Textarea, Select, Checkbox, RadioGroup, Label, Card, Badge, Table, AlertDialog, Toast (sonner), Skeleton, Progress.
- **Acessibilidade**: labels associados, foco visível (ring indigo), navegação por teclado no wizard, `aria-current` na etapa ativa, contraste WCAG AA no dark.
- **Responsividade**: split-screen vira coluna única no mobile; tabela com scroll horizontal; sidebar admin colapsa em drawer.
- **Performance**: code-split por rota, imagens otimizadas, React Query com `staleTime` adequado.
- **Validação**: Zod com mensagens em português; campos obrigatórios definidos por etapa.
- **Não inclui**: e-mail, PDF, webhooks, WhatsApp — conforme solicitado.

---

## Entregáveis em ordem

1. Habilitar Lovable Cloud.
2. Migração SQL: enums, tabelas, RLS, grants, função `has_role`, bucket Storage + políticas, seed do admin (`victor008rios@gmail.com` → role `admin` quando o usuário for criado via `/auth`).
3. Tokens de design + carregamento do Geist.
4. Landing pública.
5. Wizard completo com autosave, validação e upload.
6. Envio + tela de sucesso.
7. Auth + layout `_authenticated`.
8. Dashboard admin (métricas, tabela, filtros).
9. Página de detalhe (edição, mudança de status, exclusão, downloads assinados).
10. Polimento responsivo, animações e revisão de acessibilidade.
