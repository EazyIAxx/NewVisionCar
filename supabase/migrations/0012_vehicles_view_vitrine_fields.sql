-- vehicles_view lista colunas explicitamente (não usa select *) — precisa
-- incluir os novos campos da vitrine (M12) pra aparecerem no app.

create or replace view public.vehicles_view
with (security_invoker = true)
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
from public.vehicles;
