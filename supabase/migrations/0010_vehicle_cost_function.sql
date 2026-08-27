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
