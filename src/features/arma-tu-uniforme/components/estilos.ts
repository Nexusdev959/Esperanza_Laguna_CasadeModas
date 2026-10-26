// Clases compartidas, tomadas de las que ya usa el sitio (navbar y hero)
export const FOCO = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ec4a6]";

export const BOTON_MARCA = `inline-flex items-center justify-center gap-2 rounded-full bg-[#1c785f] hover:bg-[#166450] dark:bg-[#d4af37] dark:hover:bg-[#e2c275] text-white dark:text-[#0b1410] font-sans font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none ${FOCO}`;

export const BOTON_LINEA = `inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 hover:border-foreground/40 text-foreground font-sans font-medium tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none ${FOCO}`;

/** Título pequeño en versalitas, como los de la navbar. */
export const ROTULO = "text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-foreground/50";
