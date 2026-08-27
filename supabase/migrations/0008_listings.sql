-- Milestone 11 (Backend): integrador de anúncios (OLX, Webmotors).
-- Sem acesso real às APIs dos portais ainda (exige parceria comercial) — o
-- status representa a intenção da revenda de publicar, não uma confirmação
-- do portal. A sincronização (veículo vendido/removido despublica) é real.

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  portal text not null check (portal in ('olx', 'webmotors')),
  status text not null default 'nao_publicado' check (status in ('nao_publicado', 'publicado', 'erro')),
  external_id text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (vehicle_id, portal)
);

create index listings_agency_id_idx on public.listings (agency_id);
create index listings_vehicle_id_idx on public.listings (vehicle_id);

alter table public.listings enable row level security;

-- Mesma regra do Estoque: todo mundo da agência (Gestor e Vendedor) vê e
-- gerencia os anúncios.
create policy listings_select on public.listings
  for select
  using (agency_id = public.get_my_agency_id());

create policy listings_insert on public.listings
  for insert
  with check (agency_id = public.get_my_agency_id());

create policy listings_update on public.listings
  for update
  using (agency_id = public.get_my_agency_id());

create policy listings_delete on public.listings
  for delete
  using (agency_id = public.get_my_agency_id());
