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
