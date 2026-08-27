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
