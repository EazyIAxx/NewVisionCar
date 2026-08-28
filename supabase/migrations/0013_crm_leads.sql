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
