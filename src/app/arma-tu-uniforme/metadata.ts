import type { Metadata } from "next";
import { rutaFrame } from "@/features/arma-tu-uniforme/config";
import { PROGRAMAS, buscarUniforme } from "@/features/arma-tu-uniforme/data";
import { escribirEstado, leerEstado } from "@/features/arma-tu-uniforme/lib/url-state";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Título, descripción e imagen para compartir propios de cada programa y variante. */
export async function generarMetadata({ searchParams }: Props): Promise<Metadata> {
  const estado = leerEstado(await searchParams, PROGRAMAS);
  const uniforme = buscarUniforme(estado.programa, estado.variante);
  const title = uniforme ? `Arma tu uniforme · ${uniforme.nombre}` : "Arma tu uniforme";
  const description = uniforme
    ? `Gira el ${uniforme.nombre.toLowerCase()} en 360° y conoce cada pieza: significado, uso reglamentario, tallas y precio.`
    : "Gira el uniforme y toca cada pieza para conocerla.";
  const url = `/arma-tu-uniforme${escribirEstado({ ...estado, pieza: null, vista: "frente" })}`;
  const imagen =
    uniforme?.visor.tipo === "secuencia" ? rutaFrame(uniforme.visor.carpeta, "alta", uniforme.visor.frameFrente) : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: imagen ? [{ url: imagen, alt: uniforme?.nombre }] : undefined },
  };
}
