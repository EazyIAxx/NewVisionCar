-- Backend de Vendas (pré-requisito para M10/M14) — tabela `sales`, RLS e
-- `sales_view` (esconde cost_price de quem não é gestor, mesmo padrão de
-- vehicles_view).

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  vendedor_id uuid not null references public.profiles (id),
  customer_name text not null,
  vehicle_brand text not null,
  vehicle_model text not null,
  cost_price numeric(12, 2) not null default 0,
  amount numeric(12, 2) not null,
  payment_method text not null check (payment_method in ('a_vista', 'financiado', 'cartao', 'consorcio')),
  sale_date date not null,
  created_at timestamptz not null default now()
);

create index sales_agency_id_idx on public.sales (agency_id);
create index sales_vendedor_id_idx on public.sales (vendedor_id);

alter table public.sales enable row level security;

-- Gestor vê todas as vendas da agência; Vendedor só as próprias.
create policy sales_select on public.sales
  for select
  using (
    agency_id = public.get_my_agency_id()
    and (public.is_gestor() or vendedor_id = auth.uid())
  );

create policy sales_insert on public.sales
  for insert
  with check (
    agency_id = public.get_my_agency_id()
    and (public.is_gestor() or vendedor_id = auth.uid())
  );

create policy sales_update on public.sales
  for update
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy sales_delete on public.sales
  for delete
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

-- View usada para leitura no app: esconde cost_price de quem não é gestor, e
-- já traz o nome do vendedor (usado por Vendas/Financeiro/Desempenho pra
-- agrupar sem precisar de join na aplicação).
create view public.sales_view
with (security_invoker = true)
as
select
  s.id,
  s.agency_id,
  s.vehicle_id,
  s.vendedor_id,
  p.full_name as vendedor_name,
  s.customer_name,
  s.vehicle_brand,
  s.vehicle_model,
  case when public.is_gestor() then s.cost_price else null end as cost_price,
  s.amount,
  s.payment_method,
  s.sale_date,
  s.created_at
from public.sales s
join public.profiles p on p.id = s.vendedor_id;
