import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arma tu uniforme · Esperanza Laguna",
};

// shortcut: página temporal hasta que exista el armador de uniformes
export default function ArmaTuUniforme() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-32 min-h-screen flex flex-col items-center justify-center text-center">
      <p className="text-[10px] font-sans font-medium tracking-[0.16em] uppercase text-[var(--muted)]">Arma tu uniforme</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-sans font-semibold text-foreground">Muy pronto</h1>
    </main>
  );
}
