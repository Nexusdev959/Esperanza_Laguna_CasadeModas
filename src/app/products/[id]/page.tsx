"use client";

import { ShoppingBag, Plus, Minus, ArrowLeft, Star, Loader2, Check, Clock, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import useSWR, { useSWRConfig } from "swr";
import { useCartStore, InsigniaOption, ClubMember, LOT_MIN_UNIFORMS, LEAD_DAYS, RH_OPTIONS } from "@/store/cart";
import { toCardProduct } from "@/components/product-card";

// Valor del selector para quien no es de la Unión Colombiana del Norte
const OTHER_UNION = "__otra__";

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [personalization, setPersonalization] = useState("");
  const [selectedUnion, setSelectedUnion] = useState("");
  const [otherUnion, setOtherUnion] = useState("");
  const [selectedAssociation, setSelectedAssociation] = useState("");
  // Especificaciones exactas que el cliente pide para este producto
  const [specs, setSpecs] = useState("");
  const [showSpecs, setShowSpecs] = useState(false);
  // Productos con lista de opciones (ej. clases): unidades por cada una
  const [optionQty, setOptionQty] = useState<Record<string, number>>({});
  // Insignias del uniforme: las dos piezas vienen con insignias; el cliente puede quitarlas
  const [insigniaBanda, setInsigniaBanda] = useState(true);
  const [insigniaCamisa, setInsigniaCamisa] = useState(true);
  // Cada uniforme lleva insignia de nombre y de RH: una fila por unidad (en lote se completan en el carrito)
  const [wearers, setWearers] = useState<ClubMember[]>([{ name: "", rh: "" }]);
  const { showNotification } = useNotification();

  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { addItem } = useCartStore();
  const { mutate } = useSWRConfig();

  // Fetch product data
  const { data: product, error, isLoading } = useSWR(`/products/${id}`, async (url) => {
    const res = await api.get(url);
    return res.data;
  });
  // La lista de uniones vive en la configuración de la tienda (por ahora solo la Unión Colombiana del Norte)
  const { data: settings } = useSWR("/settings", async (url) => (await api.get(url)).data);
  const unions: string[] = settings?.unions ?? [];
  const associations: string[] = settings?.associations ?? [];
  // null = sin límite configurado; el servidor vuelve a comprobarlo al crear el pedido
  const madeToOrderLeft: number | null = settings?.madeToOrderRemaining ?? null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Ocurrió un Error</h2>
        <p className="text-[var(--muted)]">No se pudo cargar el producto. Verifica que el enlace sea correcto.</p>
        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const sizes = toCardProduct(product).sizes ?? [];
  const isUniform = !!product.isUniform;
  // En lote (3 o más) la talla se anota por integrante en el carrito
  const lotMode = isUniform && quantity >= LOT_MIN_UNIFORMS;
  // Con una sola talla, unión o asociación no hay nada que elegir: se asignan solas
  const size = selectedSize || (sizes.length === 1 ? sizes[0] : "");
  const union = selectedUnion || (unions.length === 1 ? unions[0] : "");
  // Asociación o misión: texto libre; la lista del admin solo sugiere mientras escribe
  const association = selectedAssociation.trim();
  const isOtherUnion = selectedUnion === OTHER_UNION;

  const insignias: InsigniaOption | undefined = !isUniform ? undefined
    : insigniaBanda && insigniaCamisa ? "COMPLETAS" : insigniaBanda ? "SOLO_BANDA" : insigniaCamisa ? "SOLO_CAMISA" : "NINGUNA";
  const discount = Number(product.noInsigniaDiscount) || 0;
  const unitPrice = insignias === "NINGUNA" ? Math.max(0, product.price - discount) : product.price;
  // Sin insignias no hay insignia de unión que elegir
  const needsUnion = product.requiresUnion && insignias !== "NINGUNA";
  const money = (n: number) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  const options: string[] = !isUniform && Array.isArray(product.options) ? product.options : [];
  const optionLabel: string = product.optionLabel && product.optionLabel !== 'Opción' ? product.optionLabel : 'Opción';
  const optionUnits = options.reduce((sum, o) => sum + (optionQty[o] ?? 0), 0);
  const setOption = (o: string, q: number) => setOptionQty((prev) => ({ ...prev, [o]: Math.max(0, Math.min(999, q)) }));

  const handleAddToCart = () => {
    if (!lotMode && sizes.length > 0 && !sizes.includes(size)) {
      showNotification("Elige una talla", "error");
      return;
    }
    const name = personalization.trim();
    if (product.requiresPersonalization && !name) {
      showNotification("Escribe el nombre que llevará la insignia", "error");
      return;
    }
    if (options.length > 0 && optionUnits === 0) {
      showNotification(`Elige cuántas unidades quieres de cada ${optionLabel.toLowerCase()}`, "error");
      return;
    }
    if (isUniform && !lotMode && wearers.some((w) => w.name.trim().length < 2 || !w.rh)) {
      showNotification(quantity > 1 ? "Escribe el nombre y el RH de cada uniforme" : "Escribe el nombre para la insignia y el RH", "error");
      return;
    }
    const unionValue = isOtherUnion ? otherUnion.trim() : union;
    if (needsUnion && unionValue.length < 2) {
      showNotification(isOtherUnion ? "Escribe el nombre de tu unión" : "Elige la unión", "error");
      return;
    }
    if (needsUnion && !isOtherUnion && association.length < 2) {
      showNotification("Escribe tu asociación o misión", "error");
      return;
    }

    const details = {
      size: !lotMode && sizes.length > 0 ? size : undefined,
      personalization: product.requiresPersonalization ? name : undefined,
      union: needsUnion ? unionValue : undefined,
      association: needsUnion && !isOtherUnion ? association : undefined,
      details: specs.trim() || undefined,
      insignias,
    };
    const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/800x1000?text=Sin+Imagen';
    // Con opciones, cada una con cantidad es una línea propia del pedido (ej. 3 Amigo y 2 Compañero)
    const lines = options.length > 0
      ? options.filter((o) => (optionQty[o] ?? 0) > 0).map((o) => ({ option: o, qty: optionQty[o] }))
      : [{ option: undefined as string | undefined, qty: quantity }];
    for (const line of lines) {
      addItem({
        // Cada combinación de opción, talla, insignias, nombre y unión es una línea distinta del pedido
        id: [product.id, line.option, details.size ?? (lotMode ? "lote" : ""), details.insignias, details.personalization, details.union, details.association, details.details].filter(Boolean).join("|"),
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: line.qty,
        image,
        isUniform,
        sizes: isUniform ? sizes : undefined,
        members: isUniform && !lotMode ? wearers.map((w) => ({ name: w.name.trim(), rh: w.rh })) : undefined,
        option: line.option,
        optionLabel: line.option ? optionLabel : undefined,
        ...details,
      });
    }

    showNotification(
      lotMode
        ? `Añadiste ${quantity} uniformes. En el carrito completa la lista del club (nombre, RH y talla).`
        : options.length > 0
          ? `Añadiste ${optionUnits} unidad(es) de ${product.name}`
          : `Añadido al carrito: ${quantity} unidad(es) de ${product.name}`,
      "success"
    );
    setOptionQty({});
    setPersonalization("");
    setSpecs("");
    setWearers(Array.from({ length: quantity }, () => ({ name: "", rh: "" })));
  };

  const setQty = (q: number) => {
    setQuantity(q);
    setWearers((w) => Array.from({ length: q }, (_, n) => w[n] ?? { name: "", rh: "" }));
  };
  const increment = () => setQty(quantity + 1);
  const decrement = () => setQty(Math.max(1, quantity - 1));

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        showNotification("Debes iniciar sesión para calificar", "error");
        return;
      }
      if (!comment.trim()) {
        showNotification("Escribe un comentario", "error");
        return;
      }
      setIsSubmittingReview(true);
      await api.post('/reviews', {
        productId: product.id,
        rating,
        comment,
        title: "Reseña de Producto"
      });
      showNotification("¡Reseña publicada con éxito!", "success");
      setIsReviewing(false);
      setComment("");
      setRating(5);
      mutate(`/products/${id}`);
    } catch (e: any) {
      showNotification(e?.response?.data?.error || "Error al enviar la reseña", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Determine main image and additional images
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/800x1000?text=Sin+Imagen'];
  
  const mainImage = images[0];
  const detailImages = images.slice(1, 3); // Get up to 2 extra images

  return (
    <>
      <main className="container max-w-5xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a la tienda
        </Link>
        
        {/* Móvil: imagen, compra, especificaciones. Escritorio: imagen y especificaciones a la izquierda, compra a la derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] gap-x-10 lg:gap-x-16 gap-y-8">
          {/* Product Images */}
          <AnimateIn delay={0.1} className="space-y-4 md:col-start-1 md:row-start-1">
            <div className="aspect-[4/5] bg-[var(--surface)] overflow-hidden rounded-2xl border border-[var(--border-color)]">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {detailImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {detailImages.map((img: string, index: number) => (
                  <div key={index} className="aspect-[4/5] bg-[var(--surface)] overflow-hidden rounded-xl border border-[var(--border-color)]">
                    <img 
                      src={img} 
                      alt={`Detalle ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </AnimateIn>

          {/* Product Info */}
          <AnimateIn delay={0.2} className="flex flex-col md:col-start-2 md:row-start-1 md:row-span-2">
            <div className="mb-6">
              <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-medium tracking-widest uppercase mb-3">
                {product.category || 'Colección'}
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <p className="text-xl text-[var(--foreground)] font-medium">{money(unitPrice)}</p>
                {unitPrice !== product.price && <p className="text-sm text-[var(--muted)] line-through">{money(product.price)}</p>}
              </div>
              {isUniform && <p className="text-xs text-[var(--muted)] mt-1">{insignias === "NINGUNA" ? "Precio sin insignias" : "Incluye insignias en banda y camisa"}</p>}
            </div>
            
            {sizes.length > 0 && !lotMode && (
              <div className="mb-6">
                <span className="block text-xs font-medium text-[var(--foreground)] mb-3">Talla</span>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      aria-pressed={size === s}
                      className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                        size === s
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-[var(--border-color)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lotMode && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5">
                <Users className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  <span className="font-semibold">Pedido por lote.</span> En el carrito anotarás el nombre del club y, por cada integrante, su nombre, RH y talla. Así cada uniforme llega a la persona correcta.
                </p>
              </div>
            )}

            {isUniform && (
              <fieldset className="mb-6">
                <legend className="block text-xs font-medium text-[var(--foreground)] mb-3">Insignias</legend>
                <div className="grid grid-cols-2 gap-2">
                  {([["Banda", insigniaBanda, setInsigniaBanda], ["Camisa", insigniaCamisa, setInsigniaCamisa]] as const).map(([label, on, toggle]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggle(!on)}
                      aria-pressed={on}
                      aria-label={`Insignias en la ${label.toLowerCase()}`}
                      className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-left transition-all ${on ? 'border-primary bg-primary/5' : 'border-[var(--border-color)] hover:border-[var(--foreground)]/40'}`}
                    >
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${on ? 'bg-primary border-primary text-white' : 'border-[var(--border-color)]'}`}>
                        {on && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
                        <span className="text-[11px] text-[var(--muted)]">{on ? "Con insignias" : "Sin insignias"}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className={`text-[11px] mt-2 ${insignias === "COMPLETAS" ? "text-[var(--muted)]" : "text-amber-700 dark:text-amber-400"}`}>
                  {insignias === "COMPLETAS"
                    ? "Las insignias de banda y camisa están incluidas en el precio."
                    : insignias === "NINGUNA"
                      ? discount > 0 ? `Sin ninguna insignia: ahorras ${money(discount)} por uniforme.` : "Sin ninguna insignia. El precio no cambia para este uniforme."
                      : "Quitar las insignias de una sola pieza no cambia el precio."}
                </p>
              </fieldset>
            )}

            {isUniform && !lotMode && (
              <fieldset className="mb-6">
                <legend className="block text-xs font-medium text-[var(--foreground)] mb-2">
                  {quantity > 1 ? "¿Quiénes lo usarán?" : "¿Quién lo usará?"} <span className="font-normal text-[var(--muted)]">Va en las insignias de nombre y RH</span>
                </legend>
                <div className="space-y-2">
                  {wearers.map((w, n) => (
                    <div key={n} className="grid grid-cols-[1fr_5.5rem] gap-2">
                      <input
                        value={w.name}
                        onChange={(e) => setWearers(wearers.map((x, k) => (k === n ? { ...x, name: e.target.value } : x)))}
                        maxLength={80}
                        placeholder={quantity > 1 ? `Nombre en la insignia (${n + 1})` : "Nombre en la insignia"}
                        aria-label={`Nombre en la insignia del uniforme ${n + 1}`}
                        className="min-w-0 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary transition-colors"
                      />
                      <select
                        value={w.rh}
                        onChange={(e) => setWearers(wearers.map((x, k) => (k === n ? { ...x, rh: e.target.value } : x)))}
                        aria-label={`RH del uniforme ${n + 1}`}
                        className="px-3 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary transition-colors"
                      >
                        <option value="">RH</option>
                        {RH_OPTIONS.map((rh) => <option key={rh} value={rh}>{rh}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </fieldset>
            )}

            {product.requiresPersonalization && (
              <div className="mb-6">
                <label htmlFor="personalization" className="block text-xs font-medium text-[var(--foreground)] mb-2">Nombre en la insignia</label>
                <input
                  id="personalization"
                  value={personalization}
                  onChange={e => setPersonalization(e.target.value)}
                  maxLength={80}
                  placeholder="Ej: Club Orión"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary transition-colors"
                />
                <p className="text-[11px] text-[var(--muted)] mt-1.5">Escríbelo tal como debe bordarse. Para varios nombres, añade cada uno por separado.</p>
              </div>
            )}

            {needsUnion && (
              <div className={`mb-6 grid gap-3 ${!isOtherUnion ? "sm:grid-cols-[3fr_2fr]" : ""}`}>
                <div>
                  <label htmlFor="union" className="block text-xs font-medium text-[var(--foreground)] mb-2">Unión</label>
                  <select
                    id="union"
                    value={isOtherUnion ? OTHER_UNION : union}
                    onChange={e => setSelectedUnion(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  >
                    {unions.length !== 1 && <option value="">Elige la unión</option>}
                    {unions.map(u => <option key={u} value={u}>{u}</option>)}
                    {isUniform && <option value={OTHER_UNION}>Otra unión</option>}
                  </select>
                </div>
                {!isOtherUnion && (
                  <div>
                    <label htmlFor="association" className="block text-xs font-medium text-[var(--foreground)] mb-2">Asociación o misión</label>
                    <input
                      id="association"
                      list="association-suggestions"
                      value={selectedAssociation}
                      onChange={e => setSelectedAssociation(e.target.value)}
                      maxLength={120}
                      placeholder="Escríbela"
                      autoComplete="off"
                      className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    />
                    <datalist id="association-suggestions">
                      {associations.map(a => <option key={a} value={a} />)}
                    </datalist>
                  </div>
                )}
                {isOtherUnion && (
                  <div>
                    <label htmlFor="other-union" className="block text-xs font-medium text-[var(--foreground)] mb-2">¿Cuál es tu unión?</label>
                    <input
                      id="other-union"
                      value={otherUnion}
                      onChange={e => setOtherUnion(e.target.value)}
                      maxLength={120}
                      placeholder="Ej: Unión Colombiana del Sur"
                      className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    />
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1.5">Solo fabricamos insignias de la {unions[0] ?? "Unión Colombiana del Norte"}. Tu uniforme irá sin insignia de unión, sin cambio en el precio.</p>
                  </div>
                )}
              </div>
            )}

            {options.length > 0 && (
              <fieldset className="mb-6">
                <legend className="flex w-full items-baseline justify-between text-xs font-medium text-[var(--foreground)] mb-2">
                  <span>¿Cuántas de cada {optionLabel.toLowerCase()}?</span>
                  {optionUnits > 0 && <span className="font-normal text-[var(--muted)]">{optionUnits} en total</span>}
                </legend>
                <ul className="divide-y divide-[var(--border-color)] border border-[var(--border-color)] rounded-xl bg-[var(--surface)] overflow-hidden">
                  {options.map((o) => {
                    const q = optionQty[o] ?? 0;
                    return (
                      <li key={o} className={`flex items-center justify-between gap-3 px-4 py-2 transition-colors ${q > 0 ? 'bg-primary/5' : ''}`}>
                        <span className={`text-sm ${q > 0 ? 'font-medium text-[var(--foreground)]' : 'text-[var(--muted)]'}`}>{o}</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setOption(o, q - 1)} disabled={q === 0} aria-label={`Quitar una de ${o}`} className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"><Minus className="w-3.5 h-3.5" /></button>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={q}
                            onChange={(e) => setOption(o, Number(e.target.value) || 0)}
                            aria-label={`Cantidad de ${o}`}
                            className="w-10 text-center text-sm bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button type="button" onClick={() => setOption(o, q + 1)} aria-label={`Agregar una de ${o}`} className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)]"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            )}

            {/* Detalles plegados: casi nadie los usa y abiertos empujaban el botón de compra fuera de la pantalla */}
            {!showSpecs ? (
              <button
                type="button"
                onClick={() => setShowSpecs(true)}
                className="mb-6 self-start inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-4"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir detalles a tu pedido (opcional)
              </button>
            ) : (
            <div className="mb-6">
              <label htmlFor="product-specs" className="block text-xs font-medium text-[var(--foreground)] mb-2">
                Detalles <span className="font-normal text-[var(--muted)]">(opcional)</span>
              </label>
              <textarea
                autoFocus
                id="product-specs"
                value={specs}
                onChange={e => setSpecs(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder="Escribe exactamente lo que necesitas: manga larga, bordados, colores, medidas…"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            )}

            {/* Cantidad y compra fijas abajo mientras se eligen opciones: el botón siempre está a la vista */}
            <div className="sticky bottom-4 z-10 flex gap-3 mb-8 p-2 -mx-2 rounded-2xl bg-[var(--background)]/90 backdrop-blur-md">
              {options.length === 0 && <div className="flex items-center border border-[var(--border-color)] rounded-xl p-1 bg-[var(--surface)]">
                <button onClick={decrement} aria-label="Restar uno" className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button onClick={increment} aria-label="Sumar uno" className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"><Plus className="w-4 h-4" /></button>
              </div>}
              <Button onClick={handleAddToCart} disabled={isUniform && madeToOrderLeft !== null && quantity > madeToOrderLeft} variant="primary" className="flex-1 py-2 flex justify-center items-center gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>{options.length > 0 && optionUnits > 0 ? `Añadir ${optionUnits} a la bolsa · ${money(optionUnits * unitPrice)}` : 'Añadir a la bolsa'}</span>
              </Button>
            </div>
          </AnimateIn>

          {/* Descripción bajo la imagen: la columna de compra queda corta y el botón a la vista sin hacer scroll */}
          <AnimateIn delay={0.25} className="space-y-4 md:col-start-1 md:row-start-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Descripción</h2>
            <div className="">
              <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {isUniform && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  <span className="text-[var(--foreground)] font-medium">Confección {lotMode ? `en lote: ~${LEAD_DAYS.lot}` : `por unidad: ~${LEAD_DAYS.unit}`} días hábiles</span> desde el pago del anticipo.
                  {lotMode ? "" : ` Pedidos de ${LOT_MIN_UNIFORMS} o más uniformes son lote: ~${LEAD_DAYS.lot} días hábiles.`}
                </p>
              </div>
            )}

            {isUniform && madeToOrderLeft !== null && (
              <div className={`px-4 py-3 rounded-xl border text-xs ${madeToOrderLeft === 0 || quantity > madeToOrderLeft ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400" : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400"}`}>
                <span className="font-semibold">Cupo del taller.</span>{" "}
                {madeToOrderLeft === 0
                  ? "Los uniformes de este mes están completos. Escríbenos para reservar en el próximo mes."
                  : quantity > madeToOrderLeft
                    ? `Este mes solo quedan ${madeToOrderLeft} uniformes; baja la cantidad o escríbenos para el próximo mes.`
                    : `Quedan ${madeToOrderLeft} uniformes disponibles este mes.`}
              </div>
            )}

          </AnimateIn>
        </div>

        {/* Ratings and Reviews Section */}
        <AnimateIn delay={0.3} className="mt-24 pt-12 border-t border-[var(--border-color)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating Summary */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-serif text-[var(--foreground)]">Calificaciones y reseñas</h2>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-medium text-[var(--foreground)]">{product.ratingAvg?.toFixed(1) || '0.0'}</p>
                  <div className="flex text-yellow-400 my-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= (product.ratingAvg || 0) ? 'fill-yellow-400' : 'fill-transparent text-[var(--border-color)]'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--muted)]">{product.reviewsCount || 0} reseñas</p>
                </div>
              </div>
              
              <div className="pt-4">
                {!isReviewing ? (
                  <Button variant="outline" className="w-full" onClick={() => setIsReviewing(true)}>Escribir una reseña</Button>
                ) : (
                  <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Tu Calificación</h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => setRating(star)}
                            className={`w-5 h-5 cursor-pointer transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-[var(--border-color)]'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <textarea 
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="¿Qué te pareció el producto?"
                      className="w-full p-3 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-sm resize-none h-24 outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setIsReviewing(false)}>Cancelar</Button>
                      <Button variant="primary" className="flex-1" disabled={isSubmittingReview} onClick={handleSubmitReview}>
                        {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="lg:col-span-2 space-y-8">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any, i: number) => (
                  <div key={i} className="border-b border-[var(--border-color)] pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${review.user?.name?.replace(' ', '+') || 'Usuario'}&background=random`} alt={review.user?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">{review.user?.name || 'Usuario Anónimo'}</p>
                          <p className="text-xs text-[var(--muted)]">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400' : 'fill-transparent text-[var(--border-color)]'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-3 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[var(--muted)]">
                  Aún no hay reseñas para este producto. ¡Sé el primero en calificarlo!
                </div>
              )}
            </div>
          </div>
        </AnimateIn>

      </main>
    </>
  );
}
