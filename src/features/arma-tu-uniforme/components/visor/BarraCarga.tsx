"use client";

/** Línea fina de progreso al pie del visor; se desvanece al completar. */
export function BarraCarga({ progreso }: { progreso: number }) {
  const listo = progreso >= 1;
  return (
    <div
      role="progressbar"
      aria-label="Cargando vistas del uniforme"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progreso * 100)}
      aria-hidden={listo}
      className={`absolute inset-x-10 bottom-6 h-px bg-foreground/10 transition-opacity duration-700 ${listo ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-transparent via-[#2ec4a6] to-[#d4af37] transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${progreso})` }}
      />
    </div>
  );
}
