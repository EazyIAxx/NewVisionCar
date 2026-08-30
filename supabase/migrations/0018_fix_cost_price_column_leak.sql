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
