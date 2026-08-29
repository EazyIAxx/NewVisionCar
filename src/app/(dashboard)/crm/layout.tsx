import { CrmTabs } from "@/components/crm/crm-tabs";

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
        <p className="text-sm text-muted-foreground">
          Funil de leads, do primeiro contato até a venda fechada.
        </p>
      </div>
      <CrmTabs />
      {children}
    </div>
  );
}
