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
