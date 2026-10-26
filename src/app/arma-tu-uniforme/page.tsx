import { ArmaTuUniforme } from "@/features/arma-tu-uniforme/components/ArmaTuUniforme";
import { PROGRAMAS } from "@/features/arma-tu-uniforme/data";
import { leerEstado } from "@/features/arma-tu-uniforme/lib/url-state";
import { generarMetadata } from "./metadata";

export const generateMetadata = generarMetadata;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ArmaTuUniformePage({ searchParams }: Props) {
  const inicial = leerEstado(await searchParams, PROGRAMAS);
  return (
    <main className="container mx-auto max-w-7xl px-4 pt-36 sm:pt-40">
      <header className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">
          <span className="italic text-[#1a2b22] dark:text-[#f2f5f3]">Arma tu </span>
          <span className="font-sans text-2xl font-normal uppercase tracking-[0.28em] text-[#1c785f] dark:text-[#e2c275] sm:text-3xl">uniforme</span>
        </h1>
        <p className="mt-3 font-sans text-sm text-foreground/60">Gira el uniforme y toca cada pieza para conocerla.</p>
      </header>
      <ArmaTuUniforme inicial={inicial} />
    </main>
  );
}
