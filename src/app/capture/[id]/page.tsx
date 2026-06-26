import { notFound } from "next/navigation";
import { sources, getSource } from "@/data";
import CaptureClient from "@/components/CaptureClient";

export function generateStaticParams() {
  return sources.map((s) => ({ id: s.id }));
}

export default async function CapturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const source = getSource(id);
  if (!source) notFound();
  return <CaptureClient source={source} />;
}
