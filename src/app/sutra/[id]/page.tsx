import { notFound } from "next/navigation";
import { sutras, getSutra } from "@/data";
import SutraHub from "@/components/SutraHub";

export function generateStaticParams() {
  return sutras.map((s) => ({ id: s.id }));
}

export default async function SutraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sutra = getSutra(id);
  if (!sutra) notFound();
  return <SutraHub sutra={sutra} />;
}
