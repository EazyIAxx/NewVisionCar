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
