# NewVisionCar — Plano de Execução

Plano de execução do projeto dividido em milestones, do setup até o deploy. Cada milestone é isolado em uma branch própria e fechado com um commit final antes de seguir para o próximo.

Convenção de branch: `feature/mN-nome-curto` (setup e deploy usam `chore/...`).

**Mudança de fluxo a partir do Milestone 3:** nos Milestones 0–2, cada feature teve interface e backend construídos e mesclados juntos, um de cada vez. A partir daqui, o fluxo passa a ser em duas fases: primeiro a **interface de todas as features restantes** (M3–M8), com dados mockados, cada uma em sua própria branch (`feature/mN-nome-ui`) mesclada assim que pronta; só depois, numa segunda passada, o **backend de cada uma** (`feature/mN-nome-backend`), também uma branch por feature. Isso significa mais um pente de branches (uma UI + uma backend por feature) em vez de uma só combinada.

---

## Milestone 0 — Setup do Projeto

**Branch:** `chore/setup-inicial`

**Objetivo:** Colocar o projeto no ar localmente com o stack decidido (Next.js + TypeScript + Tailwind + shadcn/ui + Supabase CLI), sem nenhuma feature de produto ainda.

**Entregas:**
- [x] `create-next-app` (TypeScript, Tailwind, App Router, `src/`, alias `@/*`)
- [x] `shadcn/ui` inicializado + tokens de cor do projeto (`--primary` azul, `--brand-accent` laranja, cores de status)
- [x] Dependências base: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `react-hook-form`, `@hookform/resolvers`
- [x] Supabase CLI instalada, projeto linkado (`supabase link`), confirmado que o schema remoto está vazio (via Management API — `db pull`/`db diff` exigem Docker, indisponível nesta máquina; `db push` não depende disso)
- [x] `.env.example` e `.env.local` (gitignored) com as chaves do Supabase
- [x] `npm run dev`, `npm run build` e `npx tsc --noEmit` rodando sem erro na página padrão

**Commit final:** `chore: setup inicial do projeto (next.js, tailwind, shadcn, supabase)`

---

## Milestone 1 — Fundação (Auth + Multi-tenant + Papéis)

**Branch:** `feature/m1-fundacao`

**Objetivo:** Ter um app onde é possível criar conta, criar uma agência (virando Gestor) ou entrar em uma agência existente com convite (virando Vendedor), com um shell autenticado que já distingue os dois papéis.

**Entregas — Interface:**
- [x] Layout `(auth)`: páginas de login e cadastro (`login/page.tsx`, `signup/page.tsx`) com formulário (`react-hook-form` + `zod`)
- [x] Página `/onboarding`: escolha entre "Criar minha revenda" e "Tenho um código de convite"
- [x] Shell autenticado `(dashboard)/layout.tsx`: sidebar (bloco `sidebar` do shadcn) + topbar, com `nav-config.ts` já listando Estoque/Financeiro/CRM/Desempenho como itens "em breve"
- [x] Página `/settings/team`: lista de membros da agência + botão para gerar código de convite (gestor-only na UI)
- [x] Sidebar renderiza itens diferentes para Gestor vs Vendedor (a partir do papel recebido por prop, ainda sem dado real do backend)

**Entregas — Backend:**
- [x] `supabase/migrations/0001_foundation.sql`: tabelas `agencies`, `profiles`, `agency_invites`
- [x] Funções `SECURITY DEFINER`: `get_my_agency_id()`, `get_my_role()`, `is_gestor()`
- [x] Trigger `on_auth_user_created` → `handle_new_user()` (cria profile esquelético no signup)
- [x] RPCs `create_agency_and_set_gestor(p_name)` e `join_agency_with_invite(p_code)` (+ `create_agency_invite(p_role)` para gerar convites)
- [x] Políticas RLS em `agencies`, `profiles`, `agency_invites` (migration 0003 corrigiu um gap: usuário sem agência não conseguia ler o próprio profile via RLS)
- [x] `src/lib/supabase/{client.ts, server.ts, middleware.ts}` + `src/proxy.ts` (gate de autenticado/onboarding, sem checagem de papel — Next.js 16 renomeou middleware.ts para proxy.ts)
- [x] `src/app/auth/confirm/route.ts` (confirmação de e-mail) — configuração manual de Site URL no dashboard Supabase ainda pendente do lado do usuário
- [x] Ligar formulários e páginas da interface às Server Actions/RPCs reais — validado com teste E2E real (Playwright + Supabase Admin API): gestor cria agência, gera convite, vendedor entra com o código, sidebar filtra corretamente por papel, `/settings/team` bloqueado para vendedor

**Commit final:** `feat: fundação — auth, multi-tenant e papéis gestor/vendedor`

---

## Milestone 2 — Estoque (Interface)

**Branch:** `feature/m2-estoque-ui`

**Objetivo:** Gestor e Vendedor conseguem ver e gerenciar o estoque de veículos da agência (com dados mockados); custo/margem só aparece no formulário para o Gestor.

**Entregas:**
- [x] Grid de cards de veículo (estilo Kavak/Webmotors): foto, marca/modelo/ano, preço, badge de status
- [x] Formulário de cadastro/edição de veículo (marca, modelo, ano, placa, cor, km, preço, custo — campo custo só aparece para Gestor)
- [x] Upload de fotos do veículo (múltiplas imagens, com preview e remoção antes de salvar)
- [x] Busca e filtros (marca/modelo, status, preço máximo)
- [x] Ação rápida de mudar status (disponível/reservado/vendido) disponível para Vendedor

**Commit final:** `feat: interface do estoque — grid, formulário e fotos (mock)`

---

## Milestone 2 — Estoque (Backend)

**Branch:** `feature/m2-estoque-backend`

**Objetivo:** Ligar a interface do estoque ao Supabase — dados reais, RLS e upload de fotos.

**Entregas:**
- [x] Migration `vehicles` (`agency_id`, dados do veículo, `status`, `cost_price`, `price`)
- [x] Supabase Storage bucket `vehicle-photos` (leitura pública, escrita restrita por `agency_id` no path)
- [x] RLS: leitura/escrita por `agency_id`; `cost_price` só visível para `is_gestor()` via view `vehicles_view` (RLS não restringe coluna nativamente)
- [x] Server Actions de CRUD de veículo + upload de fotos (via `FormData` — arquivos aninhados num objeto comum não chegam ao Server Action) — validado com E2E real (Playwright + Admin API): criação com foto, edição com custo pré-preenchido, mudança de status, e vendedor sem acesso ao campo de custo

**Commit final:** `feat: backend do estoque — migrations, RLS, upload de fotos`

---

## Fase A — Interfaces (M3–M8, dados mockados)

### Milestone 3 — Financeiro (Interface)

**Branch:** `feature/m3-financeiro-ui`

**Objetivo:** Gestor enxerga faturamento, despesas e lucro líquido por veículo, vendedor e período (dados mockados). Vendedor não tem acesso a este módulo nem no nav.

**Entregas:**
- [x] Dashboard financeiro (gráfico de receita/despesa/lucro por mês, componente `chart` oficial do shadcn/Recharts) — só no nav do Gestor
- [x] Tela de lançamento de despesas (categoria: aluguel, funcionários, manutenção, marketing) via modal
- [x] Tela de faturamento por venda com breakdown de lucro líquido

**Commit final:** `feat: interface do financeiro — dashboard, despesas e faturamento (mock)`

---

### Milestone 4 — CRM Kanban (Interface)

**Branch:** `feature/m4-crm-ui`

**Objetivo:** Leads entram no funil (novo, contato feito, visita agendada, negociação, venda fechada, perdido), com dados mockados.

**Entregas:**
- [ ] Board Kanban estilo Pipedrive (colunas por estágio, cards de lead, drag-and-drop)
- [ ] Formulário/modal de lead: dados de contato, origem (WhatsApp/site/indicação), veículo de interesse
- [ ] Histórico de interações no card do lead
- [ ] Calendário de visitas agendadas

**Commit final:** `feat: interface do CRM — funil kanban de leads (mock)`

---

### Milestone 5 — Desempenho e Comissões (Interface)

**Branch:** `feature/m5-desempenho-ui`

**Objetivo:** Painel restrito ao Gestor mostrando total vendido e comissão (0,5% por veículo vendido) de cada vendedor (dados mockados).

**Entregas:**
- [ ] Painel de desempenho (ranking de vendedores, total vendido, comissão) — visível só no nav do Gestor
- [ ] Vendedor vê uma versão restrita mostrando apenas os próprios números

**Commit final:** `feat: interface de desempenho e comissões (mock)`

---

### Milestone 6 — Landing Page

**Branch:** `feature/m6-landing-page`

**Objetivo:** Página pública de marketing do NewVisionCar (a plataforma), não a vitrine de uma revenda específica. Sem backend próprio — não entra na Fase B.

**Entregas:**
- [ ] Hero, seção de funcionalidades, seção de preços (placeholder até M7), CTA de cadastro
- [ ] Responsivo, usando os mesmos tokens de cor do app

**Commit final:** `feat: landing page de marketing do NewVisionCar`

---

### Milestone 7 — Billing Stripe (Interface)

**Branch:** `feature/m7-billing-ui`

**Objetivo:** Agências assinam um plano pago via Stripe para usar a plataforma (fluxo de UI, sem o webhook real ainda).

**Entregas:**
- [ ] Página de planos/preços
- [ ] Redirecionamento para Stripe Checkout
- [ ] Portal do cliente (gerenciar assinatura) acessível ao Gestor

**Commit final:** `feat: interface de billing — planos e checkout (mock)`

---

### Milestone 8 — Agente de IA no WhatsApp (Interface)

**Branch:** `feature/m8-whatsapp-ui`

**Objetivo:** Painel de configuração do agente e leads do WhatsApp aparecendo no Kanban (mock).

**Entregas:**
- [ ] Painel de configuração do agente (mensagens padrão, horários de atendimento) para o Gestor
- [ ] Leads mockados com origem "WhatsApp" aparecendo no Kanban (M4)

**Commit final:** `feat: interface do agente de ia no whatsapp (mock)`

---

## Fase B — Backends (M3–M8)

### Milestone 3 — Financeiro (Backend)

**Branch:** `feature/m3-financeiro-backend`

**Entregas:**
- [ ] Migration `expenses` (`agency_id`, categoria, valor, data)
- [ ] Cálculo de lucro líquido por veículo (`sale_price - cost_price - despesas vinculadas`)
- [ ] RLS: acesso total restrito a `is_gestor()` em todas as tabelas financeiras
- [ ] Server Actions de CRUD de despesas + queries agregadas por período/vendedor

**Commit final:** `feat: backend do financeiro — despesas, lucro líquido e RLS`

---

### Milestone 4 — CRM Kanban (Backend)

**Branch:** `feature/m4-crm-backend`

**Entregas:**
- [ ] Migration `leads` (`agency_id`, `vendedor_id`, estágio, origem, veículo vinculado) + `lead_activities`
- [ ] RLS: Gestor vê todos os leads da agência; Vendedor só os seus (`vendedor_id = auth.uid()`)
- [ ] Server Actions de mudança de estágio, atribuição e histórico

**Commit final:** `feat: backend do CRM — leads, estágios e RLS`

---

### Milestone 5 — Desempenho e Comissões (Backend)

**Branch:** `feature/m5-desempenho-backend`

**Entregas:**
- [ ] Cálculo de comissão (0,5% do `sale_price` por venda fechada), a partir dos dados de M2 (venda) e M4 (atribuição do fechamento)
- [ ] RLS: Gestor vê todos; Vendedor só `vendedor_id = auth.uid()`

**Commit final:** `feat: backend de desempenho e comissões — 0,5% por veículo vendido`

---

### Milestone 7 — Billing Stripe (Backend)

**Branch:** `feature/m7-billing-backend`

**Entregas:**
- [ ] Colunas `agencies.stripe_customer_id` / `agencies.plan_status`
- [ ] `/api/stripe/webhook`: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Bloqueio de acesso quando assinatura está inativa/inadimplente

**Commit final:** `feat: backend de billing — webhook e assinatura da agência`

---

### Milestone 8 — Agente de IA no WhatsApp (Backend)

**Branch:** `feature/m8-whatsapp-backend`

**Entregas:**
- [ ] `/api/whatsapp/webhook` (WhatsApp Business Cloud API ou Twilio)
- [ ] Agente com acesso de leitura ao estoque (M2) para responder disponibilidade/preço
- [ ] Criação de lead/agendamento de visita gravado no calendário e no CRM (M4)

**Commit final:** `feat: backend do agente de ia no whatsapp — webhook e integração`

---

## Milestone 9 — Deploy

**Branch:** `chore/deploy-producao`

**Objetivo:** Aplicação publicada em produção, com o projeto Supabase de produção configurado.

**Entregas:**
- [ ] Deploy na Vercel ligado ao repositório
- [ ] Variáveis de ambiente de produção configuradas (Supabase, Stripe, WhatsApp)
- [ ] Migrations aplicadas no projeto Supabase de produção
- [ ] Site URL/redirects de Auth e webhooks (Stripe, WhatsApp) apontando para o domínio de produção
- [ ] Teste fumaça: cadastro, onboarding, estoque, CRM, comissão e checkout funcionando em produção

**Commit final:** `chore: deploy em produção`
