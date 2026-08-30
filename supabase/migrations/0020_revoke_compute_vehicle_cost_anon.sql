-- Higiene (não é vulnerabilidade — verificado que sempre retorna null pra
-- anon, já que a função filtra por get_my_agency_id(), que é null sem
-- sessão). compute_vehicle_cost só é chamada de dentro de createSale, uma
-- Server Action que exige sessão autenticada — visitante anônimo nunca
-- precisa executá-la.

revoke execute on function public.compute_vehicle_cost(uuid) from anon;
