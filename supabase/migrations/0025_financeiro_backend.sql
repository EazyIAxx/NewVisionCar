-- Milestone 3 (Backend): financeiro — despesas reais + regras de comissão
-- reais. Nunca tinha sido implementado (despesas eram 100% mock desde o M3
-- de interface; a taxa de comissão configurada pelo gestor nunca persistia).

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  category text not null check (category in ('aluguel', 'funcionarios', 'manutencao', 'marketing')),
  description text not null,
  amount numeric(12, 2) not null,
  date date not null,
  created_at timestamptz not null default now()
);

create index expenses_agency_id_idx on public.expenses (agency_id);

alter table public.expenses enable row level security;

-- Dado financeiro — mesma regra de Nota Fiscal/Ordem de Serviço: gestor-only,
-- nem por RLS nem pela UI o vendedor vê (Financeiro já é um módulo inteiro
-- gestor-only, ver financeiro/layout.tsx).
create policy expenses_select on public.expenses
  for select
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy expenses_insert on public.expenses
  for insert
  with check (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy expenses_delete on public.expenses
  for delete
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

-- ---------------------------------------------------------------------------

create table public.commission_rates (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  payment_method text not null check (payment_method in ('a_vista', 'financiado', 'cartao', 'consorcio')),
  rate numeric(6, 4) not null,
  updated_at timestamptz not null default now(),
  unique (agency_id, payment_method)
);

create index commission_rates_agency_id_idx on public.commission_rates (agency_id);

alter table public.commission_rates enable row level security;

-- Diferente de expenses: vendedor precisa ver a taxa que se aplica à própria
-- comissão em "Meu desempenho" — só a edição é gestor-only.
create policy commission_rates_select on public.commission_rates
  for select
  using (agency_id = public.get_my_agency_id());

create policy commission_rates_insert on public.commission_rates
  for insert
  with check (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy commission_rates_update on public.commission_rates
  for update
  using (agency_id = public.get_my_agency_id() and public.is_gestor());
