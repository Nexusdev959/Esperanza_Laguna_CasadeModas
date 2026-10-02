"use client";

import { ChevronDown, ShoppingBag, Plus, Minus, Package, Tag, ArrowLeft, Star, ThumbsUp } from "lucide-react";
import { useState, use } from "react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";
import { Button } from "@/components/ui/button";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [purchaseMode, setPurchaseMode] = useState<"unidad" | "lote">("unidad");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const { showNotification } = useNotification();

  const basePrice = 250;
  const currentPrice = purchaseMode === "lote" ? basePrice * 0.8 : basePrice; // 20% discount for batches
  const lotSize = 12; // A batch contains 12 units

  const handleAddToCart = () => {
    const totalUnits = purchaseMode === "lote" ? quantity * lotSize : quantity;
    showNotification(`Añadido al carrito: ${totalUnits} unidad(es) de Abrigo Oversize`, "success");
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <>
      <main className="container max-w-5xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a la tienda
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <AnimateIn delay={0.1} className="space-y-4">
            <div className="aspect-[4/5] bg-[var(--surface)] overflow-hidden rounded-2xl border border-[var(--border-color)]">
              <img 
                src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=1200&q=80" 
                alt="Abrigo de Lana Oversize" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="aspect-[4/5] bg-[var(--surface)] overflow-hidden rounded-xl border border-[var(--border-color)]">
                <img 
                  src="https://images.unsplash.com/photo-1539533018408-ebcd5ee823f6?w=800&q=80" 
                  alt="Detail 1" 
                  className="w-full h-full object-cover"
                />
              </div>
               <div className="aspect-[4/5] bg-[var(--surface)] overflow-hidden rounded-xl border border-[var(--border-color)]">
                <img 
                  src="https://images.unsplash.com/photo-1542838686-37ed7a5efaf7?w=800&q=80" 
                  alt="Detail 2" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimateIn>

          {/* Product Info */}
          <AnimateIn delay={0.2} className="flex flex-col">
            <div className="mb-6">
              <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-medium tracking-widest uppercase mb-3">
                Colección Exclusiva
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] mb-2">Abrigo de Lana Oversize</h1>
              <div className="flex items-end gap-3">
                <p className="text-xl text-[var(--foreground)] font-medium">{currentPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                {purchaseMode === "lote" && (
                  <p className="text-xs text-[var(--muted)] line-through mb-0.5">{basePrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Abrigo largo de lana premium con corte oversize y hombros caídos. Diseño minimalista sin solapas con cierre frontal invisible.
              </p>
            </div>

            {/* Compra por Lote o Unidad */}
            <div className="mb-6 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-1.5 flex">
              <button 
                onClick={() => setPurchaseMode("unidad")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${purchaseMode === "unidad" ? "bg-[var(--background)] shadow-sm border border-[var(--border-color)] text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                <Tag className="w-3 h-3" /> Por Unidad
              </button>
              <button 
                onClick={() => setPurchaseMode("lote")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${purchaseMode === "lote" ? "bg-primary/10 border border-primary/20 text-primary shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                <Package className="w-3 h-3" /> Al Mayor (Lote x{lotSize})
              </button>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
               <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-[var(--foreground)]">Talla</span>
                <button className="text-[10px] text-[var(--muted)] hover:text-primary transition-colors underline underline-offset-4">Guía de tallas</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                      selectedSize === size 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-[var(--border-color)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-[var(--border-color)] rounded-xl p-1 bg-[var(--surface)]">
                <button onClick={decrement} className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button onClick={increment} className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <Button onClick={handleAddToCart} variant="primary" className="flex-1 py-2 flex justify-center items-center gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir a la bolsa</span>
              </Button>
            </div>

            {/* Accordion */}
            <div className="border-t border-[var(--border-color)] divide-y divide-[var(--border-color)]">
              <div className="py-4">
                <button className="flex justify-between items-center w-full text-left text-[var(--foreground)] hover:text-primary transition-colors group">
                  <span className="text-xs font-medium tracking-wide">Detalles y Composición</span>
                  <ChevronDown className="w-4 h-4 text-[var(--muted)] group-hover:text-primary transition-colors" />
                </button>
              </div>
              <div className="py-4">
                <button className="flex justify-between items-center w-full text-left text-[var(--foreground)] hover:text-primary transition-colors group">
                  <span className="text-xs font-medium tracking-wide">Envío y Devoluciones</span>
                  <ChevronDown className="w-4 h-4 text-[var(--muted)] group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Ratings and Reviews Section */}
        <AnimateIn delay={0.3} className="mt-24 pt-12 border-t border-[var(--border-color)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating Summary (Like Google Apps) */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-serif text-[var(--foreground)]">Calificaciones y reseñas</h2>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-medium text-[var(--foreground)]">4.8</p>
                  <div className="flex text-yellow-400 my-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star === 5 ? 'fill-yellow-400/30 text-yellow-400/30' : 'fill-yellow-400'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--muted)]">128 reseñas</p>
                </div>
                
                <div className="flex-1 space-y-2">
                  {[
                    { stars: 5, pct: 85 },
                    { stars: 4, pct: 10 },
                    { stars: 3, pct: 3 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 1 },
                  ].map(bar => (
                    <div key={bar.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-2 font-medium text-[var(--muted)]">{bar.stars}</span>
                      <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border-color)]">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${bar.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">Escribir una reseña</Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="lg:col-span-2 space-y-8">
              {[
                { name: "Carlos Ruiz", date: "24 Septiembre 2026", rating: 5, text: "Excelente calidad, la tela es muy resistente. Compramos el lote para todo el club de Conquistadores y llegó en perfecto estado y muy rápido." },
                { name: "Elena Gómez", date: "15 Agosto 2026", rating: 5, text: "Muy bonitos acabados. Las tallas corresponden exactamente a la guía. A mis Aventureros les encantó." },
                { name: "David Torres", date: "02 Julio 2026", rating: 4, text: "Buen producto en general, aunque me gustaría que tuvieran más opciones de color para las pañoletas. El abrigo sin embargo, 10/10." }
              ].map((review, i) => (
                <div key={i} className="border-b border-[var(--border-color)] pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${review.name.replace(' ', '+')}&background=random`} alt={review.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{review.name}</p>
                        <p className="text-xs text-[var(--muted)]">{review.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400' : 'fill-transparent text-[var(--border-color)]'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--muted)] mb-3 leading-relaxed">
                    {review.text}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="w-3 h-3" /> ¿Te resultó útil?
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="text-sm font-medium text-primary hover:underline">Ver todas las reseñas</button>
            </div>
          </div>
        </AnimateIn>

      </main>
    </>
  );
}
