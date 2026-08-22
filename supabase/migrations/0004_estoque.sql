-- Milestone 2: Estoque — CRUD de veículos, fotos, status.

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  brand text not null,
  model text not null,
  year integer not null,
  plate text not null,
  color text not null,
  km integer not null default 0,
  price numeric(12, 2) not null,
  cost_price numeric(12, 2),
  status text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido')),
  photos text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index vehicles_agency_id_idx on public.vehicles (agency_id);

alter table public.vehicles enable row level security;

-- Todos os membros da agência podem ler e gerenciar o estoque (Gestor e Vendedor).
create policy vehicles_select on public.vehicles
  for select
  using (agency_id = public.get_my_agency_id());

create policy vehicles_insert on public.vehicles
  for insert
  with check (agency_id = public.get_my_agency_id());

create policy vehicles_update on public.vehicles
  for update
  using (agency_id = public.get_my_agency_id());

create policy vehicles_delete on public.vehicles
  for delete
  using (agency_id = public.get_my_agency_id());

-- View usada para leitura no app: esconde cost_price de quem não é gestor.
-- RLS não faz restrição por coluna nativamente, então a visibilidade do
-- custo é resolvida aqui, não na policy da tabela base.
create view public.vehicles_view
with (security_invoker = true)
as
select
  id,
  agency_id,
  brand,
  model,
  year,
  plate,
  color,
  km,
  price,
  case when public.is_gestor() then cost_price else null end as cost_price,
  status,
  photos,
  created_at
from public.vehicles;

-- ---------------------------------------------------------------------------
-- Storage: bucket de fotos dos veículos.
-- Caminho dos objetos: {agency_id}/{vehicle_id}/{arquivo}. Leitura pública
-- (fotos de veículo não são dado sensível e futuramente alimentam a vitrine
-- pública), escrita restrita a membros da mesma agência.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

create policy vehicle_photos_public_read on storage.objects
  for select
  using (bucket_id = 'vehicle-photos');

create policy vehicle_photos_insert on storage.objects
  for insert
  with check (
    bucket_id = 'vehicle-photos'
    and (storage.foldername(name))[1] = public.get_my_agency_id()::text
  );

create policy vehicle_photos_delete on storage.objects
  for delete
  using (
    bucket_id = 'vehicle-photos'
    and (storage.foldername(name))[1] = public.get_my_agency_id()::text
  );
