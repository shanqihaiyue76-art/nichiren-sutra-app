import { notFound } from "next/navigation";
import { sutras, getSutra } from "@/data";
import TestBody from "@/components/TestBody";

export function generateStaticParams() {
  return sutras.map((s) => ({ id: s.id }));
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sutra = getSutra(id);
  if (!sutra) notFound();
  return <TestBody sutra={sutra} />;
}
