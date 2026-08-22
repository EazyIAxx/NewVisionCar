# RevendaPro

@AGENTS.md

SaaS multi-tenant para gestão completa de revendas de veículos de passeio (categoria B): estoque, financeiro, CRM de leads (Kanban), desempenho/comissão de vendedores e um agente de IA no WhatsApp. Veja o PRD completo em [docs/PRD.md](docs/PRD.md).

## Tech Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js (App Router) |
| UI | React + TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| Backend/DB | Supabase (Postgres + Auth + Storage + RLS) |
| Pagamentos | Stripe (assinatura das agências na plataforma) |
| Hospedagem | Vercel + Supabase |

Sem Prisma e sem tRPC — acesso ao banco é direto via `@supabase/ssr` / `@supabase/supabase-js`, com toda a autorização garantida por Row Level Security (RLS), não por uma camada de ORM.

## Estrutura do Projeto

```
src/
  middleware.ts                 # refresh de sessão + gate de auth/onboarding (não de papel)
  lib/
    supabase/{client.ts, server.ts, middleware.ts}
    auth/get-profile.ts
    types/database.types.ts     # gerado via `supabase gen types typescript --linked`
  app/
    auth/confirm/route.ts
    (auth)/{layout.tsx, login/, signup/, actions.ts}
    onboarding/{page.tsx, actions.ts}
    (dashboard)/
      layout.tsx                # busca profile, redireciona se sem agência, renderiza shell
      dashboard/page.tsx
      estoque/                  # M2
      financeiro/                # M3 — gestor-only
      crm/                       # M4
      desempenho/                # M5 — gestor-only
      settings/team/page.tsx
  components/
    layout/{sidebar.tsx, topbar.tsx, nav-config.ts}
    ui/                          # shadcn
supabase/
  migrations/*.sql
```

## Modelo de Dados (Supabase / Postgres)

Fundação (Milestone 1):

```sql
agencies         (id, name, slug, created_at)
profiles         (id references auth.users, agency_id, role check ('gestor'|'vendedor'), full_name, email, created_at)
agency_invites   (id, agency_id, code unique, role, created_by, used_by, expires_at, created_at)
```

Tabelas futuras (M2–M5) seguem o mesmo padrão de `agency_id` para tenant scoping: `vehicles`, `leads` (+ estágios do funil), `deals`/vendas, `expenses`, `commissions`.

Funções auxiliares `SECURITY DEFINER` — usadas por toda política RLS do projeto, evita recursão de RLS em `profiles`:

```sql
get_my_agency_id() / get_my_role() / is_gestor()
```

## Convenções

**Next.js**
- App Router apenas, sem Pages Router.
- Server Components por padrão; Client Components só quando precisar de interatividade/estado.
- Mutações via Server Actions (`actions.ts` colocado ao lado da página), não API routes, exceto onde um webhook exige rota (`/api/stripe/webhook`, `/api/whatsapp/webhook`).

**Supabase / Banco**
- RLS habilitado em toda tabela, sem exceção.
- Toda política de tenant usa `agency_id = get_my_agency_id()` — nunca reimplementar a lógica inline.
- Papel (`role`) controla visibilidade: Gestor vê tudo da agência; Vendedor vê só o que é dele (`vendedor_id = auth.uid()`) nas tabelas de venda/comissão/lead.
- Migrations são a única forma de alterar schema — nunca editar tabelas manualmente pelo dashboard em produção.

**Autorização**
- `middleware.ts` resolve apenas "autenticado?" e "tem agência (onboarding completo)?" — nunca checagem de papel específico de rota.
- Checagem de papel por página vive no próprio server component/layout, que já busca o profile.
- RLS é a barreira de segurança real; os checks de página são para UX (redirecionamento correto), não a última linha de defesa.

**Stripe** (a partir do M7)
- Assinatura é da agência (tenant), não do usuário individual.
- Webhooks obrigatórios: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.

**shadcn/ui**
- Usar os blocos oficiais quando existirem (ex.: `sidebar`) em vez de construir do zero.
- Tokens de cor customizados (ver Identidade Visual) definidos uma vez em `globals.css`, nunca hex inline nos componentes.

## Monetização

Planos de assinatura por agência via Stripe (a definir em detalhe no M7) — modelo esperado: plano único ou por faixa de veículos/usuários em estoque, com trial inicial. Placeholder até o M7 formalizar preços/limites.

## Identidade Visual

Referências: Kavak / Webmotors (vitrine de veículos — cards com foto, preço, filtros por categoria B) e Pipedrive (funil Kanban simples). Interface limpa, cores neutras com um tom de destaque.

- `--primary`: azul corporativo (confiança).
- `--accent`: laranja (CTAs de alta ênfase: "Novo Lead", "Registrar Venda").
- Cores de status (reutilizadas em Estoque e no Kanban do CRM): disponível/novo = verde, reservado/andamento = âmbar, vendido/ganho = primary, perdido = vermelho neutro.
- Tipografia: `next/font` (Geist) por padrão.

## Restrições-chave

1. RLS habilitado em toda tabela nova — sem exceção, desde a criação da migration.
2. Toda tabela de negócio carrega `agency_id` e usa `get_my_agency_id()`/`is_gestor()` nas políticas — nunca lógica de tenant duplicada.
3. Vendedor nunca acessa dados financeiros da agência nem comissão de outros vendedores — nem por RLS, nem pela UI (nav oculta a mesma coisa que a RLS bloqueia).
4. `middleware.ts` não faz gate de papel — isso é responsabilidade de cada página/layout + RLS.
5. Nomes de tabelas/colunas em inglês; valores de domínio (`'gestor'`, `'vendedor'`) em português, por serem vocabulário de produto.
