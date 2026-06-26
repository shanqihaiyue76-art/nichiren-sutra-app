import { notFound } from "next/navigation";
import { sources, getSource } from "@/data";
import SourcePlayer from "@/components/SourcePlayer";

export function generateStaticParams() {
  return sources.map((s) => ({ id: s.id }));
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const source = getSource(id);
  if (!source) notFound();
  return <SourcePlayer source={source} />;
}
