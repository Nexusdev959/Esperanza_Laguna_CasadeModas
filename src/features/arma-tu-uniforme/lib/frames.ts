import type { Vista } from "../types";

// Matemática de la secuencia: los frames son circulares (después del último viene el 0)

export const normalizar = (frame: number, total: number) => ((frame % total) + total) % total;

/** Frame entero que se dibuja para una posición continua del giro. */
export const frameDibujado = (frame: number, total: number) => normalizar(Math.round(frame), total);

/** Diferencia con signo por el camino más corto: de 34 a 1 son +3, no −33. */
export const distanciaCircular = (desde: number, hasta: number, total: number) => {
  const d = normalizar(hasta - desde, total);
  return d > total / 2 ? d - total : d;
};

export const frameDeVista = (vista: Vista, frameFrente: number, total: number, frameEspalda?: number) =>
  normalizar(vista === "frente" ? frameFrente : frameEspalda ?? frameFrente + total / 2, total);

/** Vista más cercana al frame actual (para escribirla en la URL al soltar el giro). */
export const vistaDeFrame = (frame: number, frameFrente: number, total: number, frameEspalda?: number): Vista => {
  const espalda = frameDeVista("espalda", frameFrente, total, frameEspalda);
  return Math.abs(distanciaCircular(frameFrente, frame, total)) <= Math.abs(distanciaCircular(espalda, frame, total)) ? "frente" : "espalda";
};

/**
 * Qué dos fotos se ven y cuánto de la segunda (t, 0–1). Con `ancho` 0 cambia de golpe a mitad de
 * camino (muchas fotos); con ancho > 0 cada foto se sostiene y se funde con la siguiente cerca del medio.
 */
export const mezcla = (frame: number, total: number, ancho: number) => {
  const base = Math.floor(frame);
  const avance = frame - base;
  const t = ancho <= 0 ? (avance >= 0.5 ? 1 : 0) : Math.min(1, Math.max(0, (avance - 0.5) / ancho + 0.5));
  return { a: normalizar(base, total), b: normalizar(base + 1, total), t };
};

/** Orden de carga desde el frame actual hacia afuera: 5, 6, 4, 7, 3… */
export const ordenDeCarga = (desde: number, total: number) => {
  const orden = [normalizar(Math.round(desde), total)];
  for (let paso = 1; orden.length < total; paso++) {
    orden.push(normalizar(orden[0] + paso, total));
    if (orden.length < total) orden.push(normalizar(orden[0] - paso, total));
  }
  return orden;
};
