import type { Metadata } from "next";
import { ClubesContent } from "@/components/clubes";

export const metadata: Metadata = {
  title: "Uniformes para tu club · Esperanza Laguna",
  description:
    "Uniformes de Conquistadores, Aventureros y Guías Mayores para todo el club: tallas y nombres por integrante, confección en lote y envíos a toda Colombia.",
};

export default function ClubesPage() {
  return <ClubesContent />;
}
