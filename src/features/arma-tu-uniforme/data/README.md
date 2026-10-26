# Cargar un uniforme en «Arma tu uniforme»

> **Piezas desde el admin:** en *Panel de Control → Arma tu uniforme* se agregan, editan, ordenan y quitan las piezas (textos, foto de detalle, producto y el punto en cada foto) sin tocar código. Mientras un uniforme no tenga piezas guardadas, el visor usa las de su archivo en esta carpeta; con «Copiar las piezas de ejemplo» se pasan al admin para editarlas. Las fotos del giro y los uniformes nuevos todavía se agregan como se explica abajo.

Cada uniforme es un archivo `.ts` en esta carpeta, más sus fotos en `public/uniformes/`. No hay que tocar código del visor.

## 1. Fotografiar

- Maniquí centrado sobre una base giratoria, con el uniforme completo y bien planchado.
- Fondo liso y uniforme (blanco o marfil claro), sin sombras duras.
- Cámara en trípode, **fija**: la misma altura (a la altura del pecho), la misma distancia y el mismo zoom en todas las tomas.
- La misma luz en todas las fotos: luz continua difusa, sin flash y sin luz de ventana que cambie.
- **36 fotos, una cada 10°**, girando la base siempre en el mismo sentido. La foto 00 es de frente y la 18 de espalda.
- Encuadre vertical 3:4, dejando aire arriba y abajo.

### Con pocas fotos (p. ej. 4 vistas)

También sirve con 4 fotos (frente, tres cuartos, perfil, espalda, en el orden del giro). Con 12 fotos o menos el visor sostiene cada una y la funde con la siguiente al girar. Se ponen `frames: 4` y, si la espalda no está justo a media vuelta, `frameEspalda` con su número (ver `conquistadores-nina.ts`).

## 2. Exportar

Nombres numerados con dos dígitos (`00.webp` … `35.webp`) en dos resoluciones:

| Carpeta | Tamaño        | Uso                                            |
| ------- | ------------- | ---------------------------------------------- |
| `baja/` | 480 × 640 px  | Se cargan todas primero: el giro funciona ya   |
| `alta/` | 1200 × 1600 px | Pantallas grandes y al hacer zoom             |

Formato WebP, calidad 80 aprox. Si se cambia el formato o el ancho de las bajas, ajustar `EXTENSION_FRAMES` y `ANCHO_BAJA` en `../config.ts`.

```
public/uniformes/<programa>/<variante>/baja/00.webp … 35.webp
public/uniformes/<programa>/<variante>/alta/00.webp … 35.webp
```

## 3. Crear el archivo del uniforme

Copiar `conquistadores-nino.ts` con el nombre `<programa>-<variante>.ts` y cambiar:

- `programa`, `variante`, `nombre`, `descripcion`.
- `visor.carpeta` (`/uniformes/<programa>/<variante>`), `frames` (36) y `frameFrente` (el número de la foto de frente).
- `piezas`: una por prenda o accesorio. Por cada una: `id` (sin espacios, va en la URL), `nombre`, `descripcion`, `significado`, `usoReglamentario`, `imagenDetalle` (foto cercana en `public/`, o `null`) y `productoId`.
- `productoId` es el id del producto en el admin de la tienda: de ahí salen precio, tallas y stock. Con `null` la pieza se muestra «Precio por confirmar» y se puede cotizar, pero no agregar al carrito.

Después, agregarlo a la lista `UNIFORMES` en `index.ts`. Programas y variantes nuevos se suman en `PROGRAMAS` del mismo archivo.

## 4. Marcar los hotspots

Cada pieza tiene `tramos`: las rachas de fotos en las que se ve. Un tramo es una lista de puntos `{ frame, x, y }` en orden de giro (puede pasar de 35 a 0). `x` e `y` son el % del ancho y del alto de la foto. Entre dos puntos la posición se interpola, así que basta con marcar un punto cada 2 o 3 fotos. La pieza se desvanece al acercarse a los bordes del tramo.

Para no medir a mano, usar el **editor de hotspots**, que solo aparece con `npm run dev`:

1. Abrir `/arma-tu-uniforme?programa=…&variante=…`.
2. Pulsar «Editar hotspots» en la esquina del visor.
3. Girar hasta la foto deseada (el botón muestra el número de frame), activar el editor y hacer clic sobre la pieza: se copia `{ frame: 12, x: 43.2, y: 31.5 },` al portapapeles.
4. Pegar los puntos en el tramo de la pieza. Una pieza visible de frente y de espalda (camisa) lleva dos tramos.

El visor gira solo hasta el mejor ángulo de cada pieza: el centro de su tramo más largo.

## Vista 3D (a futuro)

`visor: { tipo: "modelo3d", glb: "/uniformes/…/modelo.glb" }` ya está previsto en los tipos. El componente `VisorModelo3D` es por ahora un marcador de lugar.
