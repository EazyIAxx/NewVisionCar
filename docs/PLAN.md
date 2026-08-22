# NewVisionCar — Plano de Execução

Plano de execução do projeto dividido em milestones, do setup até o deploy. Em cada milestone, a interface (UI) é construída primeiro (com dados mockados/estáticos quando necessário), e o backend (schema Supabase, RLS, Server Actions) é ligado depois. Cada milestone é isolado em uma branch própria e fechado com um commit final antes de seguir para o próximo.

Convenção de branch: `feature/mN-nome-curto` (setup e deploy usam `chore/...`).

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

## Milestone 2 — Estoque

**Branch:** `feature/m2-estoque`

**Objetivo:** Gestor e Vendedor conseguem ver e gerenciar o estoque de veículos da agência; custo/margem fica visível só para o Gestor.

**Entregas — Interface:**
- [ ] Grid de cards de veículo (estilo Kavak/Webmotors): foto, marca/modelo/ano, preço, badge de status
- [ ] Formulário de cadastro/edição de veículo (marca, modelo, ano, placa, cor, km, categoria B, preço, custo — campo custo só aparece para Gestor)
- [ ] Upload de fotos do veículo (múltiplas imagens)
- [ ] Busca e filtros (marca, faixa de preço, status, ano)
- [ ] Ação rápida de mudar status (disponível/reservado/vendido) disponível para Vendedor

**Entregas — Backend:**
- [ ] Migration `vehicles` (`agency_id`, dados do veículo, `status`, `cost_price`, `sale_price`)
- [ ] Supabase Storage bucket para fotos, com política de acesso por agência
- [ ] RLS: leitura/escrita por `agency_id`; coluna `cost_price` só legível por `is_gestor()` (view separada ou policy de coluna)
- [ ] Server Actions de CRUD de veículo + upload de fotos

**Commit final:** `feat: módulo de estoque — CRUD de veículos, fotos e status`

---

## Milestone 3 — Financeiro

**Branch:** `feature/m3-financeiro`

**Objetivo:** Gestor enxerga faturamento, despesas e lucro líquido por veículo, vendedor e período. Vendedor não tem nenhum acesso a este módulo.

**Entregas — Interface:**
- [ ] Dashboard financeiro (gráficos de receita/despesa/lucro por período) — só no nav do Gestor
- [ ] Tela de lançamento de despesas (categoria: aluguel, funcionários, manutenção, marketing)
- [ ] Tela de faturamento por venda com breakdown de lucro líquido

**Entregas — Backend:**
- [ ] Migration `expenses` (`agency_id`, categoria, valor, data)
- [ ] Cálculo de lucro líquido por veículo (`sale_price - cost_price - despesas vinculadas`)
- [ ] RLS: acesso total restrito a `is_gestor()` em todas as tabelas financeiras
- [ ] Server Actions de CRUD de despesas + queries agregadas por período/vendedor

**Commit final:** `feat: módulo financeiro — despesas, faturamento e lucro líquido`

---

## Milestone 4 — CRM Kanban

**Branch:** `feature/m4-crm-kanban`

**Objetivo:** Leads entram no funil (novo, contato feito, visita agendada, negociação, venda fechada, perdido) e são atribuídos a vendedores, que só veem os próprios.

**Entregas — Interface:**
- [ ] Board Kanban estilo Pipedrive (colunas por estágio, cards de lead, drag-and-drop)
- [ ] Formulário/modal de lead: dados de contato, origem (WhatsApp/site/indicação), veículo de interesse
- [ ] Histórico de interações no card do lead
- [ ] Calendário de visitas agendadas

**Entregas — Backend:**
- [ ] Migration `leads` (`agency_id`, `vendedor_id`, estágio, origem, veículo vinculado) + `lead_activities`
- [ ] RLS: Gestor vê todos os leads da agência; Vendedor só os seus (`vendedor_id = auth.uid()`)
- [ ] Server Actions de mudança de estágio, atribuição e histórico

**Commit final:** `feat: CRM — funil kanban de leads`

---

## Milestone 5 — Desempenho e Comissões

**Branch:** `feature/m5-desempenho`

**Objetivo:** Painel restrito ao Gestor mostrando total vendido e comissão (0,5% por veículo vendido) de cada vendedor.

**Entregas — Interface:**
- [ ] Painel de desempenho (ranking de vendedores, total vendido, comissão) — visível só no nav do Gestor
- [ ] Vendedor vê uma versão restrita mostrando apenas os próprios números

**Entregas — Backend:**
- [ ] Cálculo de comissão (0,5% do `sale_price` por venda fechada), a partir dos dados de M2 (venda) e M4 (atribuição do fechamento)
- [ ] RLS: Gestor vê todos; Vendedor só `vendedor_id = auth.uid()`

**Commit final:** `feat: desempenho e comissões — 0,5% por veículo vendido`

---

## Milestone 6 — Landing Page

**Branch:** `feature/m6-landing-page`

**Objetivo:** Página pública de marketing do NewVisionCar (a plataforma), não a vitrine de uma revenda específica.

**Entregas:**
- [ ] Hero, seção de funcionalidades, seção de preços (placeholder até M7), CTA de cadastro
- [ ] Responsivo, usando os mesmos tokens de cor do app

**Commit final:** `feat: landing page de marketing do NewVisionCar`

---

## Milestone 7 — Billing Stripe

**Branch:** `feature/m7-billing-stripe`

**Objetivo:** Agências assinam um plano pago via Stripe para usar a plataforma.

**Entregas — Interface:**
- [ ] Página de planos/preços
- [ ] Redirecionamento para Stripe Checkout
- [ ] Portal do cliente (gerenciar assinatura) acessível ao Gestor

**Entregas — Backend:**
- [ ] Colunas `agencies.stripe_customer_id` / `agencies.plan_status`
- [ ] `/api/stripe/webhook`: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Bloqueio de acesso quando assinatura está inativa/inadimplente

**Commit final:** `feat: billing — assinatura da agência via stripe`

---

## Milestone 8 — Agente de IA no WhatsApp

**Branch:** `feature/m8-whatsapp-ai`

**Objetivo:** Agente de IA atende leads pelo WhatsApp, consulta estoque em tempo real e agenda visitas — sem negociar preço.

**Entregas — Interface:**
- [ ] Painel de configuração do agente (mensagens padrão, horários de atendimento) para o Gestor
- [ ] Leads criados pelo agente aparecem automaticamente no Kanban (M4) com origem "WhatsApp"

**Entregas — Backend:**
- [ ] `/api/whatsapp/webhook` (WhatsApp Business Cloud API ou Twilio)
- [ ] Agente com acesso de leitura ao estoque (M2) para responder disponibilidade/preço
- [ ] Criação de lead/agendamento de visita gravado no calendário e no CRM (M4)

**Commit final:** `feat: agente de ia no whatsapp — atendimento e agendamento de visitas`

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
