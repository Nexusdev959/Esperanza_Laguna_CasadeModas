// Pruebas de la lógica pura del visor: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, frameDibujado, distanciaCircular, frameDeVista, vistaDeFrame, ordenDeCarga, mezcla } from "./frames.ts";
import { posicionEnTramo, posicionHotspot, mejorFrame } from "./hotspots.ts";
import { leerEstado, escribirEstado } from "./url-state.ts";

test("frames: normaliza, redondea y toma el camino corto", () => {
  assert.equal(normalizar(-1, 36), 35);
  assert.equal(normalizar(37, 36), 1);
  assert.equal(frameDibujado(35.6, 36), 0);
  assert.equal(distanciaCircular(34, 1, 36), 3);
  assert.equal(distanciaCircular(1, 34, 36), -3);
  assert.equal(frameDeVista("espalda", 0, 36), 18);
  assert.equal(vistaDeFrame(30, 0, 36), "frente");
  assert.equal(vistaDeFrame(16, 0, 36), "espalda");
  // 4 fotos con la espalda en la última (frente, tres cuartos, perfil, espalda)
  assert.equal(frameDeVista("espalda", 0, 4, 3), 3);
  assert.equal(vistaDeFrame(1, 0, 4, 3), "frente");
  assert.equal(vistaDeFrame(2, 0, 4, 3), "espalda");
});

test("frames: con pocas fotos cada una se sostiene y se funde cerca del medio", () => {
  assert.deepEqual(mezcla(1.1, 4, 0.6), { a: 1, b: 2, t: 0 });
  assert.deepEqual(mezcla(1.5, 4, 0.6), { a: 1, b: 2, t: 0.5 });
  assert.deepEqual(mezcla(3.9, 4, 0.6), { a: 3, b: 0, t: 1 });
  assert.equal(mezcla(10.4, 36, 0).t, 0);
  assert.equal(mezcla(10.6, 36, 0).t, 1);
});

test("frames: el orden de carga cubre todo desde el actual hacia afuera", () => {
  const orden = ordenDeCarga(5, 36);
  assert.deepEqual(orden.slice(0, 5), [5, 6, 4, 7, 3]);
  assert.equal(new Set(orden).size, 36);
});

const tramo = [
  { frame: 33, x: 40, y: 30 },
  { frame: 35, x: 50, y: 30 },
  { frame: 3, x: 60, y: 40 },
];

test("hotspots: interpola dentro de un tramo que cruza el frame 0", () => {
  assert.deepEqual(posicionEnTramo(tramo, 34, 36, 0), { x: 45, y: 30, opacidad: 1 });
  const p = posicionEnTramo(tramo, 1, 36, 0);
  assert.equal(p.x, 55);
  assert.equal(p.y, 35);
  assert.equal(posicionEnTramo(tramo, 10, 36, 0), null);
});

test("hotspots: se desvanece al salir del tramo y elige el mejor frame", () => {
  assert.equal(posicionEnTramo(tramo, 33, 36, 1).opacidad, 1);
  assert.deepEqual(posicionEnTramo(tramo, 3.5, 36, 1), { x: 60, y: 40, opacidad: 0.5 });
  assert.deepEqual(posicionEnTramo(tramo, 32.5, 36, 1), { x: 40, y: 30, opacidad: 0.5 });
  assert.equal(posicionHotspot([tramo], 5, 36, 1), null);
  assert.equal(posicionHotspot([tramo], 70, 36, 1).x, 45);
  // Un tramo de un solo punto se ve en su foto y se apaga antes de la vecina
  assert.equal(posicionEnTramo([{ frame: 2, x: 10, y: 10 }], 2, 4, 0.45).opacidad, 1);
  assert.equal(posicionEnTramo([{ frame: 2, x: 10, y: 10 }], 2.5, 4, 0.45), null);
  assert.equal(mejorFrame([tramo, [{ frame: 10, x: 1, y: 1 }]], 36), 0);
  assert.equal(mejorFrame([], 36), null);
});

const programas = [
  { id: "conquistadores", nombre: "C", variantes: [{ id: "nino", nombre: "Niño" }, { id: "nina", nombre: "Niña" }] },
  { id: "guias-mayores", nombre: "G", variantes: [{ id: "dama", nombre: "Dama" }] },
];

test("url-state: lee, valida y vuelve a escribir", () => {
  const estado = leerEstado(new URLSearchParams("programa=conquistadores&variante=nina&pieza=falda&vista=espalda"), programas);
  assert.deepEqual(estado, { programa: "conquistadores", variante: "nina", pieza: "falda", vista: "espalda" });
  assert.equal(escribirEstado(estado), "?programa=conquistadores&variante=nina&pieza=falda&vista=espalda");
});

test("url-state: valores desconocidos caen a valores válidos", () => {
  assert.deepEqual(leerEstado({ programa: "x", variante: ["dama"], vista: "lado" }, programas), {
    programa: "conquistadores", variante: "nino", pieza: null, vista: "frente",
  });
  assert.equal(leerEstado({ programa: "guias-mayores", variante: "nino" }, programas).variante, "dama");
});
