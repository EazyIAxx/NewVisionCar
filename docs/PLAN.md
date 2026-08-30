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
- [x] Board Kanban estilo Pipedrive (colunas por estágio, cards de lead, drag-and-drop via `@dnd-kit`)
- [x] Formulário/modal de lead: dados de contato, origem (WhatsApp/site/indicação), veículo de interesse
- [x] Histórico de interações no card do lead (timeline no modal de detalhe + adicionar nota)
- [x] Calendário de visitas agendadas (componente `calendar` do shadcn, dias com visita marcados)

**Commit final:** `feat: interface do CRM — funil kanban de leads (mock)`

---

### Milestone 5 — Desempenho e Comissões (Interface)

**Branch:** `feature/m5-desempenho-ui`

**Objetivo:** Painel restrito ao Gestor mostrando total vendido e comissão (0,5% por veículo vendido) de cada vendedor (dados mockados).

**Entregas:**
- [x] Painel de desempenho (ranking de vendedores, total vendido, comissão) — Gestor vê todos, com o 1º lugar destacado
- [x] Vendedor vê uma versão restrita ("Meu desempenho") mostrando apenas os próprios números — nav-config.ts liberado para os dois papéis

**Commit final:** `feat: interface de desempenho e comissões (mock)`

---

### Milestone 6 — Landing Page

**Branch:** `feature/m6-landing-page`

**Objetivo:** Página pública de marketing do NewVisionCar (a plataforma), não a vitrine de uma revenda específica. Sem backend próprio — não entra na Fase B.

**Entregas:**
- [x] Hero com CTA de cadastro, seção "BIA" (diferencial da IA no WhatsApp, com mockup de conversa), recursos (card stack arrastável), como funciona, benefícios e FAQ
- [x] Responsivo, usando os mesmos tokens de cor do app
- [ ] Seção de preços — adiada pro M7 (Billing Stripe), quando os planos existirem de fato

**Commit final:** `feat: landing page de marketing do NewVisionCar (M6)`

---

### Milestone 7 — Billing Stripe (Interface)

**Branch:** `feature/m7-billing-ui`

**Objetivo:** Agências assinam um plano pago via Stripe para usar a plataforma (fluxo de UI, sem o webhook real ainda).

**Entregas:**
- [x] Três planos definidos (Start/Profissional/Ilimitado, por faixa de veículos e usuários) + seção de preços pública na landing page
- [x] Página `/settings/billing` (gestor-only): status do plano (mock trial), comparação dos planos, botão "Assinar" (mock — simula redirecionamento pro Stripe Checkout)
- [x] "Gerenciar assinatura" (mock — simula o portal do cliente Stripe) acessível ao Gestor

**Commit final:** `feat: interface de billing — planos e checkout (mock)`

---

### Milestone 8 — Agente de IA no WhatsApp (Interface)

**Branch:** `feature/m8-whatsapp-ui`

**Objetivo:** Painel de configuração do agente e leads do WhatsApp aparecendo no Kanban (mock).

**Entregas:**
- [x] Página `/settings/whatsapp` (gestor-only): status/número, horário de atendimento por dia da semana, mensagens padrão (boas-vindas, fora do horário, visita agendada) com prévia em bolha de chat
- [x] Leads mockados com origem "WhatsApp" aparecendo no Kanban (M4) — já existia nos mocks do CRM, confirmado via E2E

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
- [x] Migration `leads` (`agency_id`, `vendedor_id`, estágio, origem, veículo vinculado) + `lead_activities`
- [x] RLS: Gestor vê todos os leads da agência; Vendedor só os seus (`vendedor_id = auth.uid()`) + os não atribuídos (lead vindo da vitrine sem dono, até alguém "pegar")
- [x] Server Actions de mudança de estágio, atribuição e histórico — atribuição automática ao vendedor na primeira interação com um lead sem dono
- [x] "Tenho interesse" da vitrine (M12) cria lead real via RPC `create_vitrine_lead`, origem "site"
- [x] Marcar data/hora da visita: campo no detalhe do lead (`scheduleVisit`); arrastar um lead pra "Visita agendada" no Kanban abre o detalhe automaticamente pedindo o horário

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
- [x] Colunas `agencies.stripe_customer_id` / `agencies.plan_status` (+ `stripe_subscription_id`, `trial_ends_at`) — protegidas por GRANT de coluna, só o webhook (service_role) escreve
- [x] `/api/stripe/webhook`: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` — testado de ponta a ponta com chaves reais (Stripe CLI + checkout de teste completo); achado e corrigido no processo: `/api/*` caía no gate de autenticação do middleware (307 pro /login em vez de processar o evento)
- [x] Bloqueio de acesso quando assinatura está inativa/inadimplente — testado de ponta a ponta (trial automático, redirect quando past_due/canceled, `/settings/billing` continua acessível, recuperação ao reativar)
- [x] Simplificado de 3 pra 2 planos (decisão do usuário): Básico e Com IA no WhatsApp — a diferença de IA depende do backend do M8, que ainda não existe (só a cobrança/trava de acesso está pronta)

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

## Fase C — Módulos Avançados: Interfaces (M10–M15, dados mockados)

Expansões pós-MVP. Mesmo fluxo em duas fases das Milestones 3–8: primeiro a interface de todos os módulos (M10–M15) com dados mockados, cada uma na sua branch `feature/mN-nome-ui`; só depois, na Fase D, o backend de cada uma (`feature/mN-nome-backend`). Detalhar cada milestone (telas exatas, textos, componentes) quando a fase for iniciada — os itens abaixo são o objetivo de alto nível.

### Milestone 10 — Emissor de Nota Fiscal (Interface)

**Branch:** `feature/m10-nota-fiscal-ui`

**Objetivo:** Gestor consegue configurar os dados fiscais da agência e disparar a emissão de nota fiscal a partir de uma venda (mock — sem provedor de NF-e real ainda).

**Entregas:**
- [x] Página `/settings/fiscal` (gestor-only): CNPJ, inscrição estadual/municipal, regime tributário
- [x] Coluna "Nota fiscal" em Vendas com status (pendente, emitida, cancelada) e botão "Emitir nota fiscal" por venda (mock, atualiza a tela na hora)

**Commit final:** `feat: interface do emissor de nota fiscal (mock)`

---

### Milestone 11 — Integrador de Anúncios (Interface)

**Branch:** `feature/m11-integrador-anuncios-ui`

**Objetivo:** Gestor/Vendedor consegue "publicar" um veículo do Estoque na OLX e no Webmotors pela UI (mock — sem chamada real às APIs dos portais ainda).

**Entregas:**
- [x] Card "Anúncios" na página de edição do veículo, com botão "Publicar anúncio"/"Remover anúncio" por portal (OLX, Webmotors)
- [x] Status de publicação por portal (não publicado, publicado, erro) mockado, atualizado na hora

**Commit final:** `feat: interface do integrador de anúncios (mock)`

---

### Milestone 12 — Vitrine Pública da Revenda (Interface)

**Branch:** `feature/m12-vitrine-publica-ui`

**Objetivo:** Rota pública (sem login) mostrando os veículos disponíveis da revenda, com dados mockados — a vitrine é o site público da revenda em si, não um site institucional à parte.

**Entregas:**
- [x] Rota pública `/vitrine/[slug]` (layout próprio, sem sidebar): grid de veículos disponíveis, filtros básicos, página de detalhe com fotos
- [x] Botão "Tenho interesse" no detalhe do veículo (formulário de contato, mock)
- [x] Página `/settings/vitrine` (gestor-only): nome de exibição, slug e cor de destaque

**Commit final:** `feat: interface da vitrine pública da revenda (mock)`

---

### Milestone 13 — Ordem de Serviço (Interface)

**Branch:** `feature/m13-ordem-servico-ui`

**Objetivo:** Gestor/Vendedor registra serviços feitos num veículo antes da venda (revisão, higienização, funilaria), com dados mockados.

**Entregas:**
- [x] Card "Ordens de Serviço" na página de edição do veículo, com lista (tipo, fornecedor, valor, status) — mockado
- [x] Formulário "Nova OS" (tipo, fornecedor, valor, data), status inicial "Pendente"

**Commit final:** `feat: interface de ordem de serviço (mock)`

---

### Milestone 14 — Integração RENAVE (Interface)

**Branch:** `feature/m14-renave-ui`

**Objetivo:** Painel de status da transferência RENAVE por venda, com dados mockados (sem integração real com a API do RENAVE ainda).

**Entregas:**
- [x] Coluna "RENAVE" na listagem de Vendas com status (pendente, em andamento, concluída, erro)
- [x] Formulário "Iniciar transferência" (CPF, RG e endereço do comprador — forma de pagamento já vem da venda)

**Commit final:** `feat: interface de integração com o renave (mock)`

---

### Milestone 15 — Simulação e Integração de Financiamento (Interface)

**Branch:** `feature/m15-financiamento-ui`

**Objetivo:** Simulador de parcelas de financiamento na página do veículo, com taxas mockadas (sem parceiro financeiro real ainda).

**Entregas:**
- [x] Simulador de financiamento (entrada, prazo, parcela estimada) na página do veículo — vitrine pública (M12) e Estoque interno
- [x] Formulário de envio de proposta (dados do comprador) para análise — painel "Envie sua proposta" na vitrine

**Commit final:** `feat: interface de simulação de financiamento (mock)`

---

## Fase D — Backends (M10–M15)

### Backend de Vendas (pré-requisito para M10/M14)

**Branch:** `feature/vendas-backend`

**Objetivo:** Vendas nunca teve um milestone de backend próprio (foi adicionada fora do roadmap M0–M9 original) — mas M10 (Nota Fiscal) e M14 (RENAVE) referenciam `sale_id`, que precisa apontar pra uma tabela `sales` real.

**Entregas:**
- [x] Migration `sales` (`agency_id`, `vehicle_id` opcional, `vendedor_id`, cliente, forma de pagamento, valor, custo, data) + RLS (Gestor vê tudo da agência; Vendedor só as próprias vendas) + `sales_view` (esconde `cost_price` de quem não é gestor, mesmo padrão de `vehicles_view`)
- [x] `createSale` grava de verdade; listagem de Vendas lê da `sales_view`; seletor de "Vendedor" no formulário passa a listar os membros reais da equipe
- [x] Financeiro e Desempenho passam a ler da mesma `sales_view` real, mantendo os números consistentes entre os três módulos
- [x] Clientes (consolidação CRM + Vendas) passa a usar vendas reais — CRM/leads continuam mockados até o backend do M4

**Commit final:** `feat: backend de vendas — migration, RLS e rewire de financeiro/desempenho/clientes`

---

### Milestone 10 — Emissor de Nota Fiscal (Backend)

**Branch:** `feature/m10-nota-fiscal-backend`

**Entregas:**
- [ ] Integração com provedor de emissão (ex: Focus NFe, NFE.io — a definir) — pendente até haver conta/chave de API
- [x] Migration `invoices` (`agency_id`, `sale_id`, status, número, chave de acesso) + dados fiscais em `agencies` (CNPJ, IE, IM, regime tributário) + RLS restrita a Gestor
- [ ] Webhook/polling de atualização de status da nota — depende do provedor real; por enquanto, "Emitir nota fiscal" cria um registro "pendente" de verdade e um botão "Simular emissão" (gestor) simula a conclusão

**Commit final:** `feat: backend do emissor de nota fiscal — migration, RLS e fluxo sem provedor real`

---

### Milestone 11 — Integrador de Anúncios (Backend)

**Branch:** `feature/m11-integrador-anuncios-backend`

**Entregas:**
- [ ] Integração com as APIs (ou parceiro agregador — acesso direto pode exigir parceria comercial com cada portal); por enquanto, "Publicar anúncio" grava `status: publicado` real no banco representando a intenção da revenda, não uma confirmação do portal
- [x] Migration `listings` (`vehicle_id`, portal, status, `external_id`, `published_at`)
- [x] Sincronização: veículo vendido despublica automaticamente nos portais (via `updateVehicleStatus`/`updateVehicle`)

**Commit final:** `feat: backend do integrador de anúncios — olx e webmotors`

---

### Milestone 12 — Vitrine Pública da Revenda (Backend)

**Branch:** `feature/m12-vitrine-publica-backend`

**Entregas:**
- [x] Rota pública sem autenticação; leitura pública só de veículos com status "disponível" via funções `SECURITY DEFINER` (`get_vitrine_agency`/`get_vitrine_vehicles`, RLS não filtra coluna então evitam expor CNPJ/cost_price a visitante anônimo)
- [x] "Tenho interesse" cria lead automaticamente no CRM (M4), com origem "site" — fechado junto com o backend do M4

**Commit final:** `fix: vitrine pública lendo dados reais de estoque e revenda`

---

### Milestone 13 — Ordem de Serviço (Backend)

**Branch:** `feature/m13-ordem-servico-backend`

**Entregas:**
- [x] Migration `service_orders` (`agency_id`, `vehicle_id`, tipo, fornecedor, valor, status, data)
- [x] RLS restrita a Gestor (dado financeiro, mesma regra da Nota Fiscal — nem por RLS, nem pela UI o Vendedor vê)
- [x] Valor da OS somado ao `cost_price` do veículo no cálculo de lucro (M3) — venda vinculada a um veículo do estoque herda `cost_price` real via RPC `compute_vehicle_cost` (SECURITY DEFINER, permite Vendedor registrar vendas com custo correto sem ele conseguir ler o valor)

**Commit final:** `feat: backend de ordem de serviço`

---

### Milestone 14 — Integração RENAVE (Backend)

**Branch:** `feature/m14-renave-backend`

**Entregas:**
- [ ] Integração com a API do RENAVE (via DETRAN do estado ou provedor homologado — a definir); por enquanto, "Iniciar transferência" grava `em_andamento` real no banco (intenção real, não confirmação do órgão) e "Simular conclusão" (gestor/vendedor) simula o retorno
- [x] Migration `renave_transfers` (`agency_id`, `sale_id`, status, protocolo) — RLS segue o padrão de `sales` (Vendedor gerencia as próprias vendas, Gestor vê tudo)

**Commit final:** `feat: backend de integração com o renave`

---

### Milestone 15 — Simulação e Integração de Financiamento (Backend)

**Branch:** `feature/m15-financiamento-backend`

**Entregas:**
- [ ] Integração com API de parceiro(s) financeiro(s) para simulação com taxas reais (a definir); por enquanto, "Solicitar financiamento" grava um pedido real como "pendente" e o Gestor simula a decisão (Aprovado/Recusado)
- [x] Migration `financing_requests` (`agency_id`, `vehicle_id`, `lead_id`, status, valores simulados, dados do solicitante) — não existia nenhuma ação de solicitar até agora (só a calculadora), então essa ação foi criada junto do backend; solicitação pela vitrine pública também cria lead real no CRM (origem "site")

**Commit final:** `feat: backend de simulação e integração de financiamento`

---

## Milestone 16 — Deploy

**Branch:** `chore/deploy-producao`

**Objetivo:** Aplicação publicada em produção, com o projeto Supabase de produção configurado — só depois de todos os módulos (M0–M15) estarem prontos.

**Entregas:**
- [ ] Deploy na Vercel ligado ao repositório
- [ ] Variáveis de ambiente de produção configuradas (Supabase, Stripe, WhatsApp, provedor de NF-e, RENAVE, parceiro de financiamento)
- [ ] Migrations aplicadas no projeto Supabase de produção
- [ ] Site URL/redirects de Auth e webhooks (Stripe, WhatsApp, NF-e, RENAVE) apontando para o domínio de produção
- [ ] Teste fumaça: cadastro, onboarding, estoque, CRM, vendas, financeiro, comissão, checkout, nota fiscal, integrador de anúncios, vitrine pública, ordem de serviço, RENAVE e financiamento funcionando em produção

**Commit final:** `chore: deploy em produção`
