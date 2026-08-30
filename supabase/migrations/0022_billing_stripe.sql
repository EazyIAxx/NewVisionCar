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
