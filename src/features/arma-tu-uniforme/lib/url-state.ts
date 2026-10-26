import type { EstadoUrl, Programa, Vista } from "../types";

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

const leer = (params: Params, clave: string) => {
  const valor = params instanceof URLSearchParams ? params.get(clave) : params[clave];
  return (Array.isArray(valor) ? valor[0] : valor) ?? null;
};

/** Lee y valida el estado: un valor desconocido cae al primero de la lista, nunca rompe la página. */
export const leerEstado = (params: Params, programas: Programa[]): EstadoUrl => {
  const programa = programas.find((p) => p.id === leer(params, "programa")) ?? programas[0];
  const variante = programa.variantes.find((v) => v.id === leer(params, "variante")) ?? programa.variantes[0];
  const vista: Vista = leer(params, "vista") === "espalda" ? "espalda" : "frente";
  const pieza = leer(params, "pieza")?.trim() || null;
  return { programa: programa.id, variante: variante.id, pieza, vista };
};

/** Query string en un orden fijo para que los enlaces compartidos sean estables. */
export const escribirEstado = (estado: EstadoUrl) => {
  const params = new URLSearchParams({ programa: estado.programa, variante: estado.variante });
  if (estado.pieza) params.set("pieza", estado.pieza);
  params.set("vista", estado.vista);
  return `?${params.toString()}`;
};
