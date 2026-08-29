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
