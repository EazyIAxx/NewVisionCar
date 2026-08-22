# NewVisionCar — PRD

## 1. Contexto e Problema

Agências de veículos (categoria B) gerenciam estoque, financeiro e leads de forma manual e dispersa: controle de estoque em planilhas, faturamento e fluxo de caixa sem visibilidade de lucro líquido, leads recebidos por WhatsApp que se perdem sem CRM, comissão dos vendedores calculada manualmente e sem transparência, e nenhum controle de acesso entre gestor e equipe de vendas. Isso gera perda de vendas, falta de controle financeiro real e dificuldade para o gestor avaliar o desempenho de cada vendedor.

## 2. Solução Proposta

NewVisionCar é um SaaS multi-agência (multi-tenant) para gestão completa de revendas de veículos de passeio (categoria B). Cada agência tem seu próprio ambiente com controle de estoque de veículos (cadastro, fotos, status de disponibilidade), faturamento e fluxo de caixa (entradas e saídas de gastos, cálculo automático de lucro líquido por venda e por período), CRM de leads com funil (Kanban) para acompanhar contatos até o fechamento da venda, e um módulo de desempenho de funcionários visível apenas ao gestor, mostrando quanto cada vendedor vendeu e a comissão calculada automaticamente em 0,5% do valor de cada veículo vendido. O sistema tem login multiusuário com permissões por papel (gestor vs vendedor), e conta com um agente de IA integrado ao WhatsApp que atende os leads mostrando os veículos disponíveis, tirando dúvidas sobre preço e disponibilidade, e agendando visitas à loja para fechamento da venda presencial.

## 3. Requisitos Funcionais

Gerais:
- Login e Autenticação
- Kanban
- Dashboards
- Multi usuário
- Multi empresa
- Permissões por usuário
- Calendário
- Notificações
- Relatórios e Exportação
- Integrações (API)
- Upload de Arquivos
- Busca e Filtros
- Landing Page

Módulos:
- **Estoque**: cadastro de veículos (marca, modelo, ano, placa, cor, km, categoria B, fotos, preço, status: disponível/reservado/vendido).
- **Financeiro**: faturamento por venda, controle de entradas e saídas de despesas (aluguel, funcionários, manutenção, marketing), cálculo automático de lucro líquido (por veículo, por vendedor e por período).
- **CRM de Leads**: funil Kanban (novo lead, contato feito, visita agendada, negociação, venda fechada, perdido), histórico de interações, origem do lead (WhatsApp, site, indicação).
- **Desempenho de Funcionários**: painel restrito ao gestor mostrando total vendido por vendedor e comissão automática de 0,5% sobre o valor de cada veículo vendido; vendedores não têm acesso a esse painel.
- **Multi-login com dois papéis**: Gestor (acesso total, financeiro e comissões) e Vendedor (acesso a estoque e aos próprios leads/CRM, sem ver financeiro nem comissão de outros).
- **Agente de IA no WhatsApp**: atende leads automaticamente, consulta o estoque em tempo real, informa disponibilidade e preço dos veículos, e agenda visitas à loja no calendário integrado para fechamento presencial da venda (não faz negociação de preço).

## 4. Personas

- **Lead/Cliente** — Pessoa interessada em comprar um veículo, atendida pela IA no WhatsApp e acompanhada no funil de vendas até a visita à loja.
- **Vendedor** — Funcionário da agência que atende os leads, atualiza o pipeline do CRM, registra vendas e acompanha o próprio desempenho (sem ver comissão de outros vendedores nem dados financeiros da empresa).
- **Gestor/Admin da Agência** — Dono ou gerente da revenda; tem acesso total ao estoque, financeiro (faturamento, gastos, lucro líquido), CRM, e ao painel de desempenho/comissão (0,5% por carro vendido) de todos os vendedores.
- **Admin da Plataforma (SaaS)** — Time do NewVisionCar; gerencia as agências (tenants) cadastradas, assinaturas/planos e suporte técnico.

## 5. Stack Técnica

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Supabase
- Stripe
- TypeScript

## 6. Linguagem de Design

Kavak / Webmotors — referência para vitrine de veículos, cards com foto, preço e filtros por categoria B. Pipedrive — funil Kanban simples para o CRM de leads. Interface limpa, cores neutras com um tom de destaque (laranja/azul), fácil de usar por vendedores sem perfil técnico.

## 7. Processo

- Dividir a construção do app em milestones lógicos
- Cada milestone deve ser um incremento entregável
- Priorizar funcionalidade core primeiro, depois iterar
- Testar cada milestone antes de avançar para o próximo

## 8. Roadmap de Milestones (ver CLAUDE.md para detalhe técnico)

- **M1 — Fundação**: autenticação, multi-tenant, papéis (Gestor/Vendedor), RLS, shell autenticado.
- **M2 — Estoque**: CRUD de veículos, fotos, status, busca/filtros.
- **M3 — Financeiro**: entradas/saídas, lucro líquido por veículo/vendedor/período.
- **M4 — CRM Kanban**: funil de leads, atribuição a vendedores.
- **M5 — Desempenho/Comissões**: cálculo de 0,5% por veículo vendido, ranking.
- **M6 — Landing Page**: site de marketing do NewVisionCar.
- **M7 — Billing Stripe**: assinatura por agência.
- **M8 — Agente de IA no WhatsApp**: atendimento automático de leads e agendamento de visitas.
