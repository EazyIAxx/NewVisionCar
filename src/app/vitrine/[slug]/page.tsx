import { VitrineGrid } from "@/components/vitrine/vitrine-grid";
import { mockVitrineVehicles } from "@/lib/mock/vitrine";

export default async function VitrinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Veículos disponíveis
        </h1>
        <p className="mt-2 text-slate-500">
          Confira nosso estoque atualizado.
        </p>
      </div>
      <VitrineGrid slug={slug} vehicles={mockVitrineVehicles} />
    </div>
  );
}
