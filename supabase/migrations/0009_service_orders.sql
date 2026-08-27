-- Milestone 13 (Backend): ordens de serviço (revisão, higienização, funilaria
-- etc.) feitas em um veículo antes da venda. O valor entra no custo do
-- veículo para o cálculo de lucro (M3) — por isso é dado financeiro, restrito
-- a Gestor como Nota Fiscal (nem por RLS, nem pela UI o Vendedor vê).

create table public.service_orders (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  type text not null check (type in ('revisao', 'higienizacao', 'funilaria', 'mecanica', 'pneus', 'outros')),
  supplier text not null,
  amount numeric(12, 2) not null,
  status text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'concluida')),
  date date not null,
  created_at timestamptz not null default now()
);

create index service_orders_agency_id_idx on public.service_orders (agency_id);
create index service_orders_vehicle_id_idx on public.service_orders (vehicle_id);

alter table public.service_orders enable row level security;

create policy service_orders_select on public.service_orders
  for select
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy service_orders_insert on public.service_orders
  for insert
  with check (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy service_orders_update on public.service_orders
  for update
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy service_orders_delete on public.service_orders
  for delete
  using (agency_id = public.get_my_agency_id() and public.is_gestor());
