-- ============================================================================
-- NewVisionCar — setup consolidado do banco (Supabase / Postgres)
-- ============================================================================
--
-- Este arquivo é uma FOTOGRAFIA de referência: junta, em ordem, o conteúdo de
-- todas as migrations reais de supabase/migrations/ num único lugar, para
-- leitura rápida do schema completo antes do deploy.
--
-- NÃO é a fonte de verdade do banco. Qualquer alteração de schema continua
-- sendo feita criando uma nova migration em supabase/migrations/ e aplicando
-- via `supabase db push` — nunca editando este arquivo diretamente nem
-- rodando-o manualmente contra um projeto que já tem as migrations aplicadas.
-- Uso real: montar um projeto Supabase novo do zero (ex.: ambiente de
-- deploy), ou consultar o schema inteiro sem abrir 25 arquivos separados.
--
-- Gerado a partir de (nesta ordem):
--   0001_foundation.sql
--   0002_capture_full_name_on_signup.sql
--   0003_profiles_self_select.sql
--   0004_estoque.sql
--   0005_vendas.sql
--   0006_nota_fiscal.sql
--   0007_agencies_update_policy.sql
--   0008_listings.sql
--   0009_service_orders.sql
--   0010_vehicle_cost_function.sql
--   0011_vitrine_backend.sql
--   0012_vehicles_view_vitrine_fields.sql
--   0013_crm_leads.sql
--   0014_leads_created_by_ai.sql
--   0015_renave_transfers.sql
--   0016_financing_requests.sql
--   0017_fix_profiles_privilege_escalation.sql
--   0018_fix_cost_price_column_leak.sql
--   0019_fix_cost_price_table_level_grant.sql
--   0020_revoke_compute_vehicle_cost_anon.sql
--   0021_revoke_compute_vehicle_cost_public.sql
--   0022_billing_stripe.sql
--   0023_protect_agencies_billing_columns.sql
--   0024_billing_plan_tier.sql
--   0025_financeiro_backend.sql
--   0026_fix_view_write_rls_bypass.sql
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0001_foundation.sql
-- ----------------------------------------------------------------------------
-- Milestone 1: Fundação — multi-tenant, papéis (gestor/vendedor), RLS.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  agency_id uuid references public.agencies (id) on delete cascade,
  role text check (role in ('gestor', 'vendedor')),
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create index profiles_agency_id_idx on public.profiles (agency_id);

create table public.agency_invites (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  code text not null unique,
  role text not null default 'vendedor' check (role in ('gestor', 'vendedor')),
  created_by uuid references public.profiles (id),
  used_by uuid references public.profiles (id),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index agency_invites_agency_id_idx on public.agency_invites (agency_id);

-- ---------------------------------------------------------------------------
-- Funções auxiliares RLS-safe (SECURITY DEFINER: evita recursão de RLS ao
-- consultar profiles de dentro da própria política de profiles)
-- ---------------------------------------------------------------------------

create function public.get_my_agency_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select agency_id from public.profiles where id = auth.uid();
$$;

create function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_gestor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.get_my_role() = 'gestor', false);
$$;

-- ---------------------------------------------------------------------------
-- Trigger de signup: cria profile esquelético (agency_id/role nulos) assim
-- que o usuário é criado em auth.users. Onboarding completa via RPC abaixo.
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RPCs atômicas de onboarding
-- ---------------------------------------------------------------------------

create function public.create_agency_and_set_gestor(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agency_id uuid;
begin
  insert into public.agencies (name) values (p_name) returning id into v_agency_id;
  update public.profiles set agency_id = v_agency_id, role = 'gestor' where id = auth.uid();
  return v_agency_id;
end;
$$;

create function public.join_agency_with_invite(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.agency_invites%rowtype;
begin
  select * into v_invite
  from public.agency_invites
  where code = p_code
    and used_by is null
    and (expires_at is null or expires_at > now());

  if not found then
    raise exception 'invalid_or_expired_invite';
  end if;

  update public.profiles set agency_id = v_invite.agency_id, role = v_invite.role where id = auth.uid();
  update public.agency_invites set used_by = auth.uid() where id = v_invite.id;

  return v_invite.agency_id;
end;
$$;

create function public.create_agency_invite(p_role text default 'vendedor')
returns public.agency_invites
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.agency_invites%rowtype;
begin
  if not public.is_gestor() then
    raise exception 'only_gestor_can_invite';
  end if;

  insert into public.agency_invites (agency_id, code, role, created_by)
  values (
    public.get_my_agency_id(),
    upper(substr(md5(random()::text), 1, 6)),
    p_role,
    auth.uid()
  )
  returning * into v_invite;

  return v_invite;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.agencies enable row level security;
alter table public.profiles enable row level security;
alter table public.agency_invites enable row level security;

create policy agencies_select on public.agencies
  for select
  using (id = public.get_my_agency_id());

create policy profiles_select_same_agency on public.profiles
  for select
  using (agency_id = public.get_my_agency_id());

create policy profiles_update_self on public.profiles
  for update
  using (id = auth.uid());

create policy profiles_update_by_gestor on public.profiles
  for update
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy invites_select_gestor on public.agency_invites
  for select
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy invites_insert_gestor on public.agency_invites
  for insert
  with check (agency_id = public.get_my_agency_id() and public.is_gestor());

-- ----------------------------------------------------------------------------
-- 0002_capture_full_name_on_signup.sql
-- ----------------------------------------------------------------------------
-- Captura full_name (enviado via signUp options.data) no profile criado pelo trigger de signup.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 0003_profiles_self_select.sql
-- ----------------------------------------------------------------------------
-- Antes do onboarding, agency_id é NULL tanto na linha do usuário quanto no
-- retorno de get_my_agency_id() — e `null = null` não é true em SQL, então a
-- policy original escondia o próprio profile esquelético do usuário logado.
-- Garante que o usuário sempre pode ler a própria linha, mesmo sem agência.

drop policy profiles_select_same_agency on public.profiles;

create policy profiles_select_same_agency_or_self on public.profiles
  for select
  using (agency_id = public.get_my_agency_id() or id = auth.uid());

-- ----------------------------------------------------------------------------
-- 0004_estoque.sql
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 0005_vendas.sql
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 0006_nota_fiscal.sql
-- ----------------------------------------------------------------------------
-- Milestone 10 (Backend): dados fiscais da agência + tabela `invoices`.
-- Sem provedor de NF-e real integrado ainda (Focus NFe/NFE.io — TODO na
-- Server Action) — o fluxo fica pendente até a chave de API existir.

alter table public.agencies
  add column cnpj text,
  add column inscricao_estadual text,
  add column inscricao_municipal text,
  add column regime_tributario text
    check (regime_tributario in ('simples_nacional', 'lucro_presumido', 'lucro_real', 'mei'));

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  sale_id uuid not null references public.sales (id) on delete cascade,
  status text not null default 'pendente' check (status in ('pendente', 'emitida', 'cancelada')),
  numero text,
  chave_acesso text,
  emitted_at timestamptz,
  created_at timestamptz not null default now()
);

create index invoices_agency_id_idx on public.invoices (agency_id);
create unique index invoices_sale_id_idx on public.invoices (sale_id);

alter table public.invoices enable row level security;

-- Nota fiscal é dado financeiro — restrito a Gestor, nem por RLS nem pela UI
-- o Vendedor tem acesso (mesma regra do Financeiro/comissão).
create policy invoices_select on public.invoices
  for select
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy invoices_insert on public.invoices
  for insert
  with check (agency_id = public.get_my_agency_id() and public.is_gestor());

create policy invoices_update on public.invoices
  for update
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

-- ----------------------------------------------------------------------------
-- 0007_agencies_update_policy.sql
-- ----------------------------------------------------------------------------
-- `agencies` só tinha policy de SELECT — sem uma de UPDATE, salvar os dados
-- fiscais (M10) silenciosamente não afetaria nenhuma linha (RLS filtra tudo
-- por padrão quando não há policy permissiva pra aquele comando).

create policy agencies_update_gestor on public.agencies
  for update
  using (id = public.get_my_agency_id() and public.is_gestor());

-- ----------------------------------------------------------------------------
-- 0008_listings.sql
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 0009_service_orders.sql
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 0010_vehicle_cost_function.sql
-- ----------------------------------------------------------------------------
-- Milestone 13 (Backend): RPC para apurar o custo total de um veículo
-- (cost_price + soma das ordens de serviço) na hora de registrar uma venda.
--
-- `service_orders` (e `cost_price`) são dado financeiro restrito a Gestor —
-- Vendedor não pode ler essas tabelas via RLS. Mas Vendedor PODE registrar
-- vendas, e a venda precisa herdar o custo real do veículo para o cálculo de
-- lucro (M3) funcionar mesmo quando quem vende é o Vendedor. Por isso essa
-- função é SECURITY DEFINER: devolve só o total agregado (nunca o
-- detalhamento das OS) para qualquer membro da agência do veículo, sem abrir
-- select direto nas tabelas de custo.

create function public.compute_vehicle_cost(p_vehicle_id uuid)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(v.cost_price, 0) + coalesce(
    (select sum(so.amount) from public.service_orders so where so.vehicle_id = v.id),
    0
  )
  from public.vehicles v
  where v.id = p_vehicle_id
    and v.agency_id = public.get_my_agency_id();
$$;

-- ----------------------------------------------------------------------------
-- 0011_vitrine_backend.sql
-- ----------------------------------------------------------------------------
-- Milestone 12 (Backend): vitrine pública da revenda.
--
-- RLS não filtra coluna, só linha — então não dá pra simplesmente abrir
-- `agencies`/`vehicles` pra leitura anônima (vazaria CNPJ e cost_price pra
-- qualquer visitante). Em vez disso, duas funções SECURITY DEFINER devolvem
-- só os campos seguros, igual ao padrão já usado em `compute_vehicle_cost`.

-- ---------------------------------------------------------------------------
-- agencies: slug (endereço da vitrine) + configurações públicas.
-- ---------------------------------------------------------------------------

alter table public.agencies
  add column vitrine_accent_color text not null default '#2596e0',
  add column vitrine_whatsapp text;

create extension if not exists unaccent with schema extensions;

create function public.slugify(p_text text)
returns text
language sql
immutable
set search_path = public, extensions
as $$
  select trim(both '-' from regexp_replace(lower(extensions.unaccent(p_text)), '[^a-z0-9]+', '-', 'g'));
$$;

create function public.generate_unique_agency_slug(p_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base text := public.slugify(p_name);
  v_slug text;
  v_suffix int := 0;
begin
  if v_base = '' then
    v_base := 'revenda';
  end if;
  v_slug := v_base;
  while exists (select 1 from public.agencies where slug = v_slug) loop
    v_suffix := v_suffix + 1;
    v_slug := v_base || '-' || v_suffix;
  end loop;
  return v_slug;
end;
$$;

-- Backfill: revendas criadas antes deste milestone nunca tiveram slug.
update public.agencies
set slug = public.generate_unique_agency_slug(name)
where slug is null;

-- Onboarding passa a gerar o slug automaticamente (gestor pode trocar depois
-- em Configurações > Vitrine).
create or replace function public.create_agency_and_set_gestor(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agency_id uuid;
begin
  insert into public.agencies (name, slug)
  values (p_name, public.generate_unique_agency_slug(p_name))
  returning id into v_agency_id;
  update public.profiles set agency_id = v_agency_id, role = 'gestor' where id = auth.uid();
  return v_agency_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- vehicles: campos exibidos na ficha pública (todos opcionais — veículo já
-- cadastrado continua aparecendo na vitrine sem eles).
-- ---------------------------------------------------------------------------

alter table public.vehicles
  add column transmission text check (transmission in ('manual', 'automatico')),
  add column fuel_type text check (fuel_type in ('flex', 'gasolina', 'diesel', 'hibrido', 'eletrico')),
  add column description text,
  add column features text[] not null default '{}';

-- ---------------------------------------------------------------------------
-- Leitura pública (sem autenticação) via funções SECURITY DEFINER — nunca
-- expõem cost_price nem dados fiscais de `agencies`.
-- ---------------------------------------------------------------------------

create function public.get_vitrine_agency(p_slug text)
returns table (
  id uuid,
  name text,
  slug text,
  accent_color text,
  whatsapp text
)
language sql
stable
security definer
set search_path = public
as $$
  select a.id, a.name, a.slug, a.vitrine_accent_color, a.vitrine_whatsapp
  from public.agencies a
  where a.slug = p_slug;
$$;

create function public.get_vitrine_vehicles(p_slug text)
returns table (
  id uuid,
  brand text,
  model text,
  year integer,
  km integer,
  price numeric,
  color text,
  transmission text,
  fuel_type text,
  description text,
  features text[],
  photos text[]
)
language sql
stable
security definer
set search_path = public
as $$
  select v.id, v.brand, v.model, v.year, v.km, v.price, v.color,
         v.transmission, v.fuel_type, v.description, v.features, v.photos
  from public.vehicles v
  join public.agencies a on a.id = v.agency_id
  where a.slug = p_slug
    and v.status = 'disponivel'
  order by v.created_at desc;
$$;

-- ----------------------------------------------------------------------------
-- 0012_vehicles_view_vitrine_fields.sql
-- ----------------------------------------------------------------------------
-- vehicles_view lista colunas explicitamente (não usa select *) — precisa
-- incluir os novos campos da vitrine (M12) pra aparecerem no app.

create or replace view public.vehicles_view
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
  created_at,
  transmission,
  fuel_type,
  description,
  features
from public.vehicles;

-- ----------------------------------------------------------------------------
-- 0013_crm_leads.sql
-- ----------------------------------------------------------------------------
-- Milestone 4 (Backend): CRM Kanban — leads e histórico de interações.
-- Nunca tinha sido implementado (buraco na Fase B original) até virar
-- pré-requisito pra vitrine (M12) conseguir criar lead real no "Tenho
-- interesse".
--
-- vendedor_id é opcional: lead vindo da vitrine pública não tem vendedor
-- atribuído (ninguém logado). Fica visível a todos os vendedores da agência
-- até alguém "pegar" (atribuição automática na primeira interação/mudança de
-- estágio feita por um vendedor — ver crm/actions.ts).

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  vendedor_id uuid references public.profiles (id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  origin text not null check (origin in ('whatsapp', 'site', 'indicacao')),
  vehicle_interest text,
  stage text not null default 'novo' check (
    stage in ('novo', 'contato_feito', 'visita_agendada', 'negociacao', 'venda_fechada', 'perdido')
  ),
  visit_date timestamptz,
  created_at timestamptz not null default now()
);

create index leads_agency_id_idx on public.leads (agency_id);
create index leads_vendedor_id_idx on public.leads (vendedor_id);

alter table public.leads enable row level security;

create policy leads_select on public.leads
  for select
  using (
    agency_id = public.get_my_agency_id()
    and (public.is_gestor() or vendedor_id = auth.uid() or vendedor_id is null)
  );

create policy leads_insert on public.leads
  for insert
  with check (agency_id = public.get_my_agency_id());

create policy leads_update on public.leads
  for update
  using (
    agency_id = public.get_my_agency_id()
    and (public.is_gestor() or vendedor_id = auth.uid() or vendedor_id is null)
  );

create policy leads_delete on public.leads
  for delete
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  type text not null check (type in ('nota', 'ligacao', 'mensagem', 'visita')),
  description text not null,
  date timestamptz not null default now()
);

create index lead_activities_lead_id_idx on public.lead_activities (lead_id);

alter table public.lead_activities enable row level security;

create policy lead_activities_select on public.lead_activities
  for select
  using (
    agency_id = public.get_my_agency_id()
    and exists (
      select 1 from public.leads l
      where l.id = lead_activities.lead_id
        and (public.is_gestor() or l.vendedor_id = auth.uid() or l.vendedor_id is null)
    )
  );

create policy lead_activities_insert on public.lead_activities
  for insert
  with check (
    agency_id = public.get_my_agency_id()
    and exists (
      select 1 from public.leads l
      where l.id = lead_activities.lead_id
        and (public.is_gestor() or l.vendedor_id = auth.uid() or l.vendedor_id is null)
    )
  );

-- ---------------------------------------------------------------------------
-- "Tenho interesse" na vitrine pública (M12): visitante anônimo não tem
-- sessão, então não pode inserir em `leads` mesmo com a policy acima (não
-- tem agency_id nem auth.uid()). SECURITY DEFINER resolve a agência pelo
-- slug e cria o lead com origem "site", sem abrir insert público na tabela.
-- ---------------------------------------------------------------------------

create function public.create_vitrine_lead(
  p_slug text,
  p_vehicle_interest text,
  p_name text,
  p_email text,
  p_phone text,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agency_id uuid;
  v_lead_id uuid;
begin
  select id into v_agency_id from public.agencies where slug = p_slug;
  if v_agency_id is null then
    raise exception 'agency_not_found';
  end if;

  insert into public.leads (agency_id, name, phone, email, origin, vehicle_interest)
  values (v_agency_id, p_name, p_phone, nullif(p_email, ''), 'site', p_vehicle_interest)
  returning id into v_lead_id;

  if p_message is not null and p_message <> '' then
    insert into public.lead_activities (agency_id, lead_id, type, description)
    values (v_agency_id, v_lead_id, 'mensagem', p_message);
  end if;
end;
$$;

-- ----------------------------------------------------------------------------
-- 0014_leads_created_by_ai.sql
-- ----------------------------------------------------------------------------
-- Registra se o lead foi cadastrado pelo agente de IA no WhatsApp (M8) em vez
-- de um vendedor humano — puramente informativo, não muda RLS/visibilidade
-- (continua null/não atribuído até alguém "pegar", igual lead da vitrine).

alter table public.leads
  add column created_by_ai boolean not null default false;

-- ----------------------------------------------------------------------------
-- 0015_renave_transfers.sql
-- ----------------------------------------------------------------------------
-- Milestone 14 (Backend): transferência de propriedade via RENAVE.
-- Sem integração real com a API do RENAVE/DETRAN ainda — "Iniciar
-- transferência" grava um registro real como "em_andamento" (representa a
-- intenção real de iniciar, não confirmação do órgão); "Simular conclusão"
-- (mesmo padrão já usado na Nota Fiscal) atualiza pra "concluída" com um
-- protocolo gerado. "pendente" é a ausência de registro (nada foi iniciado).
--
-- Visibilidade segue o mesmo padrão de `sales` (não o de invoices/nota
-- fiscal): a coluna RENAVE na tabela de Vendas já era visível ao Vendedor,
-- então aqui também — Vendedor gerencia a RENAVE das próprias vendas.

create table public.renave_transfers (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  sale_id uuid not null references public.sales (id) on delete cascade,
  status text not null default 'em_andamento' check (status in ('em_andamento', 'concluida', 'erro')),
  buyer_document text not null,
  buyer_rg text not null,
  buyer_address text not null,
  protocol text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sale_id)
);

create index renave_transfers_agency_id_idx on public.renave_transfers (agency_id);
create index renave_transfers_sale_id_idx on public.renave_transfers (sale_id);

alter table public.renave_transfers enable row level security;

create policy renave_transfers_select on public.renave_transfers
  for select
  using (
    agency_id = public.get_my_agency_id()
    and exists (
      select 1 from public.sales s
      where s.id = renave_transfers.sale_id
        and (public.is_gestor() or s.vendedor_id = auth.uid())
    )
  );

create policy renave_transfers_insert on public.renave_transfers
  for insert
  with check (
    agency_id = public.get_my_agency_id()
    and exists (
      select 1 from public.sales s
      where s.id = renave_transfers.sale_id
        and (public.is_gestor() or s.vendedor_id = auth.uid())
    )
  );

create policy renave_transfers_update on public.renave_transfers
  for update
  using (
    agency_id = public.get_my_agency_id()
    and exists (
      select 1 from public.sales s
      where s.id = renave_transfers.sale_id
        and (public.is_gestor() or s.vendedor_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- 0016_financing_requests.sql
-- ----------------------------------------------------------------------------
-- Milestone 15 (Backend): solicitação de financiamento.
-- Sem parceiro financeiro real ainda — mesmo padrão honesto de Nota Fiscal
-- (M10) e RENAVE (M14): "Solicitar financiamento" grava um pedido real como
-- "pendente"; só o Gestor pode simular a decisão (Aprovado/Recusado), já que
-- é uma decisão de crédito. Vendedor vê o status (como em RENAVE), só não
-- decide.

create table public.financing_requests (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  status text not null default 'pendente' check (status in ('pendente', 'aprovado', 'recusado')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  down_payment numeric(12, 2) not null,
  term_months integer not null,
  installment_estimate numeric(12, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index financing_requests_agency_id_idx on public.financing_requests (agency_id);
create index financing_requests_vehicle_id_idx on public.financing_requests (vehicle_id);

alter table public.financing_requests enable row level security;

-- Mesmo padrão de `vehicles`/`listings`: todo mundo da agência vê e gerencia.
create policy financing_requests_select on public.financing_requests
  for select
  using (agency_id = public.get_my_agency_id());

create policy financing_requests_insert on public.financing_requests
  for insert
  with check (agency_id = public.get_my_agency_id());

-- Decisão de crédito (aprovar/recusar) é só do Gestor.
create policy financing_requests_update on public.financing_requests
  for update
  using (agency_id = public.get_my_agency_id() and public.is_gestor());

-- ---------------------------------------------------------------------------
-- Vitrine pública: visitante anônimo solicita financiamento sem sessão —
-- mesmo padrão SECURITY DEFINER de `create_vitrine_lead`. Cria o pedido e um
-- lead (sinal forte de compra deve cair no funil de vendas).
-- ---------------------------------------------------------------------------

create function public.request_vitrine_financing(
  p_slug text,
  p_vehicle_id uuid,
  p_name text,
  p_phone text,
  p_email text,
  p_down_payment numeric,
  p_term_months integer,
  p_installment_estimate numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agency_id uuid;
  v_vehicle_interest text;
  v_lead_id uuid;
begin
  select a.id, v.brand || ' ' || v.model
    into v_agency_id, v_vehicle_interest
  from public.agencies a
  join public.vehicles v on v.agency_id = a.id
  where a.slug = p_slug
    and v.id = p_vehicle_id
    and v.status = 'disponivel';

  if v_agency_id is null then
    raise exception 'vehicle_not_found';
  end if;

  insert into public.leads (agency_id, name, phone, email, origin, vehicle_interest)
  values (v_agency_id, p_name, p_phone, nullif(p_email, ''), 'site', v_vehicle_interest)
  returning id into v_lead_id;

  insert into public.financing_requests (
    agency_id, vehicle_id, lead_id, customer_name, customer_phone, customer_email,
    down_payment, term_months, installment_estimate
  )
  values (
    v_agency_id, p_vehicle_id, v_lead_id, p_name, p_phone, nullif(p_email, ''),
    p_down_payment, p_term_months, p_installment_estimate
  );
end;
$$;

-- ----------------------------------------------------------------------------
-- 0017_fix_profiles_privilege_escalation.sql
-- ----------------------------------------------------------------------------
-- CRÍTICO: `profiles_update_self` e `profiles_update_by_gestor` não tinham
-- WITH CHECK — a policy de UPDATE do Postgres, quando WITH CHECK é omitido,
-- reusa a expressão do USING como check, que só restringe QUAL linha pode
-- ser tocada (`id = auth.uid()`), nunca QUAIS COLUNAS podem mudar. Isso
-- permitia qualquer usuário autenticado, via chamada direta à REST API
-- (`PATCH /profiles?id=eq.<próprio id>`), setar `role` pra 'gestor' e
-- `agency_id` pra QUALQUER outra agência — escalação de privilégio completa
-- e bypass total do isolamento multi-tenant. Confirmado com teste real.
--
-- Nenhum código da aplicação usa `.from("profiles").update(...)` — toda
-- mutação de profile passa por RPC SECURITY DEFINER (create_agency_and_set_gestor,
-- join_agency_with_invite) ou pelo trigger de signup (handle_new_user), que
-- bypassam RLS e já validam a lógica de negócio internamente. Remover essas
-- duas policies não quebra nada existente — só fecha a brecha.

drop policy if exists profiles_update_self on public.profiles;
drop policy if exists profiles_update_by_gestor on public.profiles;

-- ----------------------------------------------------------------------------
-- 0018_fix_cost_price_column_leak.sql
-- ----------------------------------------------------------------------------
-- ALTO: `vehicles_view`/`sales_view` mascaravam `cost_price` pra quem não é
-- gestor, mas RLS do Postgres só filtra LINHA, nunca COLUNA — a tabela base
-- (`vehicles`/`sales`) continuava com `cost_price` totalmente legível por
-- qualquer membro autenticado da agência via chamada direta à REST API
-- (fora da UI, que só usa as views). Confirmado com teste real: Vendedor lia
-- o custo de aquisição de veículo/venda que a própria UI nunca mostra a ele.
--
-- Correção: revoga SELECT da coluna `cost_price` de `authenticated` nas
-- tabelas base (nenhum código da aplicação lê essa coluna direto da tabela
-- base — só via view — então isso não quebra nada; INSERT/UPDATE que
-- gravam a coluna continuam funcionando, revoke de SELECT não afeta escrita).
--
-- Como `security_invoker = true` faz a view rodar com os privilégios de
-- quem chama, e Postgres exige privilégio de SELECT em toda coluna
-- REFERENCIADA na query (mesmo dentro de um CASE que só devolve o valor
-- pro gestor), revogar a coluna quebraria a view pra todo mundo, inclusive
-- gestor. Por isso as views passam a rodar com privilégio do dono (sem
-- security_invoker), e o filtro de tenant/papel que a RLS da tabela base
-- fazia automaticamente é replicado explicitamente no WHERE da view —
-- usando as mesmas funções SECURITY DEFINER (get_my_agency_id/is_gestor),
-- que resolvem pelo usuário que está chamando de verdade, não pelo dono da
-- view.

-- `authenticated` tinha SELECT concedido em nível de TABELA (não de coluna)
-- — `revoke select (cost_price) ... from authenticated` sozinho não
-- sobrepõe um grant de tabela inteira, então revoga o SELECT geral e
-- reconcede só as colunas que não são `cost_price`.
revoke select on public.vehicles from authenticated;
grant select (
  id, agency_id, brand, model, year, plate, color, km, price, status,
  photos, created_at, transmission, fuel_type, description, features
) on public.vehicles to authenticated;

revoke select on public.sales from authenticated;
grant select (
  id, agency_id, vehicle_id, vendedor_id, customer_name, vehicle_brand,
  vehicle_model, amount, payment_method, sale_date, created_at
) on public.sales to authenticated;

create or replace view public.vehicles_view
with (security_invoker = false)
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
  created_at,
  transmission,
  fuel_type,
  description,
  features
from public.vehicles
where agency_id = public.get_my_agency_id();

create or replace view public.sales_view
with (security_invoker = false)
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
join public.profiles p on p.id = s.vendedor_id
where s.agency_id = public.get_my_agency_id()
  and (public.is_gestor() or s.vendedor_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 0019_fix_cost_price_table_level_grant.sql
-- ----------------------------------------------------------------------------
-- A 0018 tentou `revoke select (cost_price) ... from authenticated`, mas
-- `authenticated` tinha SELECT concedido em nível de TABELA inteira
-- (`arwdDxtm` no relacl, não uma entrada de coluna) — revoke de coluna não
-- sobrepõe um grant de tabela. Confirmado com teste real: a coluna
-- continuava 100% legível depois da 0018. Corrige revogando o SELECT geral
-- e reconcedendo só as colunas que não são `cost_price`.

revoke select on public.vehicles from authenticated;
grant select (
  id, agency_id, brand, model, year, plate, color, km, price, status,
  photos, created_at, transmission, fuel_type, description, features
) on public.vehicles to authenticated;

revoke select on public.sales from authenticated;
grant select (
  id, agency_id, vehicle_id, vendedor_id, customer_name, vehicle_brand,
  vehicle_model, amount, payment_method, sale_date, created_at
) on public.sales to authenticated;

-- ----------------------------------------------------------------------------
-- 0020_revoke_compute_vehicle_cost_anon.sql
-- ----------------------------------------------------------------------------
-- Higiene (não é vulnerabilidade — verificado que sempre retorna null pra
-- anon, já que a função filtra por get_my_agency_id(), que é null sem
-- sessão). compute_vehicle_cost só é chamada de dentro de createSale, uma
-- Server Action que exige sessão autenticada — visitante anônimo nunca
-- precisa executá-la.

revoke execute on function public.compute_vehicle_cost(uuid) from anon;

-- ----------------------------------------------------------------------------
-- 0021_revoke_compute_vehicle_cost_public.sql
-- ----------------------------------------------------------------------------
-- A 0020 revogou de `anon` especificamente, mas toda função ganha EXECUTE
-- pra PUBLIC por padrão na criação (visível no proacl como `=X`) — um
-- revoke por role não sobrepõe o grant de PUBLIC, exatamente como o
-- problema de grant em nível de tabela na 0019. `authenticated` e
-- `service_role` têm entradas próprias no ACL (não dependem de PUBLIC), não
-- são afetados por revogar de PUBLIC.

revoke execute on function public.compute_vehicle_cost(uuid) from public;

-- ----------------------------------------------------------------------------
-- 0022_billing_stripe.sql
-- ----------------------------------------------------------------------------
-- Milestone 7 (Backend): assinatura da revenda via Stripe. Plano único —
-- sem faixa de veículos/usuários (decisão do usuário, substitui os 3 planos
-- do mock da fase de interface).

alter table public.agencies
  add column stripe_customer_id text,
  add column stripe_subscription_id text,
  add column plan_status text not null default 'trial'
    check (plan_status in ('trial', 'active', 'past_due', 'canceled')),
  add column trial_ends_at timestamptz;

create unique index agencies_stripe_customer_id_idx
  on public.agencies (stripe_customer_id)
  where stripe_customer_id is not null;

-- Toda revenda nova nasce em trial de 14 dias, sem precisar tocar no Stripe
-- ainda — só quando o gestor efetivamente assina (checkout.session.completed)
-- é que stripe_customer_id/subscription_id são preenchidos de verdade.
create or replace function public.create_agency_and_set_gestor(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agency_id uuid;
begin
  insert into public.agencies (name, slug, trial_ends_at)
  values (p_name, public.generate_unique_agency_slug(p_name), now() + interval '14 days')
  returning id into v_agency_id;
  update public.profiles set agency_id = v_agency_id, role = 'gestor' where id = auth.uid();
  return v_agency_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- 0023_protect_agencies_billing_columns.sql
-- ----------------------------------------------------------------------------
-- As colunas de billing (stripe_customer_id, stripe_subscription_id,
-- plan_status, trial_ends_at) só devem ser escritas pelo webhook do Stripe
-- (roda como service_role, que ignora GRANT/RLS) — nunca pelo próprio
-- gestor via API direta, senão ele poderia setar plan_status = 'active' sem
-- pagar. RLS não filtra coluna (mesma lição do cost_price — ver 0018/0019),
-- então a proteção é via GRANT de coluna: revoga o UPDATE geral de
-- `authenticated` e reconcede só nas colunas que o gestor legitimamente
-- edita (nome, slug, dados fiscais, config da vitrine).

revoke update on public.agencies from authenticated;
grant update (
  name, slug, cnpj, inscricao_estadual, inscricao_municipal, regime_tributario,
  vitrine_accent_color, vitrine_whatsapp
) on public.agencies to authenticated;

-- ----------------------------------------------------------------------------
-- 0024_billing_plan_tier.sql
-- ----------------------------------------------------------------------------
-- Dois planos, diferenciados pelo agente de IA no WhatsApp (M8 — ainda sem
-- backend real; essa coluna só registra qual plano a revenda pagou, o
-- travamento de fato da feature de IA fica pro M8). Não precisa repetir o
-- revoke/grant de coluna da 0023 — uma coluna nova não herda nenhum grant
-- explícito automaticamente, então já nasce protegida (só service_role
-- escreve, igual as outras colunas de billing).

alter table public.agencies
  add column plan_tier text check (plan_tier in ('basico', 'com_ia'));

-- ----------------------------------------------------------------------------
-- 0025_financeiro_backend.sql
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 0026_fix_view_write_rls_bypass.sql
-- ----------------------------------------------------------------------------
-- Auditoria de segurança pós-deploy: vehicles_view e sales_view são views
-- SEM security_invoker (rodam como dono, postgres) — decisão deliberada das
-- migrations 0018/0019 pra permitir que a view mascare cost_price mesmo com
-- a coluna revogada na tabela base. Efeito colateral não percebido até agora:
-- Postgres concede INSERT/UPDATE/DELETE por padrão a anon/authenticated em
-- toda view nova, e vehicles_view (view simples, sem JOIN) é automaticamente
-- "updatable" pelo Postgres. Como o dono (postgres) tem BYPASSRLS, um INSERT
-- via `vehicles_view` reescrito pelo Postgres ignora a RLS de `vehicles`
-- inteiramente — confirmado empiricamente: um usuário autenticado de uma
-- agência conseguiu inserir um veículo com agency_id de OUTRA agência
-- chamando `supabase.from("vehicles_view").insert(...)` direto, sem passar
-- pela Server Action. UPDATE cross-tenant já era bloqueado (a view não
-- enxerga a linha da outra agência pra localizar o que atualizar), mas
-- INSERT não passa pelo WHERE da view (não há WITH CHECK OPTION) — só a
-- RLS da tabela base pegaria isso, e ela é ignorada pelo dono bypassRLS.
--
-- Nenhum código do app escreve nessas views (toda escrita real é direto em
-- vehicles/sales, via Server Action, com RLS aplicada normalmente) — só
-- SELECT é necessário. Revogar todo privilégio de escrita fecha o buraco
-- sem precisar mexer em security_invoker (que quebraria a máscara de
-- cost_price pro vendedor, problema já resolvido nas migrations anteriores).

revoke insert, update, delete, truncate, references, trigger
  on public.vehicles_view
  from anon, authenticated;

revoke insert, update, delete, truncate, references, trigger
  on public.sales_view
  from anon, authenticated;
