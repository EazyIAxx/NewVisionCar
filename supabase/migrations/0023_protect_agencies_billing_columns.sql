-- As colunas de billing (stripe_customer_id, stripe_subscription_id,
-- plan_status, trial_ends_at) só devem ser escritas pelo webhook do Stripe
-- (roda como service_role, que ignora GRANT/RLS) — nunca pelo próprio
-- gestor via API direta, senão ele poderia setar plan_status = 'active' sem
-- pagar. RLS não filtra coluna (mesma lição do cost_price — ver 0018/0019),
-- então a proteção é via GRANT de coluna: revoga o UPDATE geral de
-- `authenticated` e reconcede só nas colunas que o gestor legitimamente
-- edita (nome, slug, dados fiscais, config da vitrine).

revoke update on public.agencies from authenticated;
grant update (
  name, slug, cnpj, inscricao_estadual, inscricao_municipal, regime_tributario,
  vitrine_accent_color, vitrine_whatsapp
) on public.agencies to authenticated;
