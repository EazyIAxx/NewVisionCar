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
