import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Veículos em estoque</CardDescription>
          <CardTitle className="text-3xl">—</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Leads em aberto</CardDescription>
          <CardTitle className="text-3xl">—</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Vendas no mês</CardDescription>
          <CardTitle className="text-3xl">—</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
