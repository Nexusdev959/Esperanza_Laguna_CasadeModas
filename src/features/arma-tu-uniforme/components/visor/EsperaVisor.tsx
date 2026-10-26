/** Lo que se ve mientras llega el código del visor: el mismo escenario vacío, sin saltos de diseño. */
export function EsperaVisor() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <div className="relative mx-auto aspect-[3/4] w-full max-h-[72vh] max-w-[calc(72vh*0.75)] overflow-hidden rounded-[2rem] bg-[#f4f6f4]">
        <div className="absolute inset-x-10 bottom-6 h-px bg-foreground/10" />
      </div>
      <div className="h-9" />
    </div>
  );
}
