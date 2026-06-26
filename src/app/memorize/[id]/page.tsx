import { notFound } from "next/navigation";
import { sutras, getSutra } from "@/data";
import MemorizeBody from "@/components/MemorizeBody";

export function generateStaticParams() {
  return sutras.map((s) => ({ id: s.id }));
}

export default async function MemorizePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sutra = getSutra(id);
  if (!sutra) notFound();
  return <MemorizeBody sutra={sutra} />;
}
