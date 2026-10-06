"use client";

import { useState, useRef, useEffect } from "react";
import { ProductCard } from "./product-card";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

const CATEGORIES = [
  { id: "Todos", label: "Colección Completa" },
  { id: "Uniformes", label: "Uniformes Oficiales" },
  { id: "Moda Damas", label: "Moda para Damas" },
  { id: "Moda Caballeros", label: "Moda para Caballeros" },
  { id: "Insignias", label: "Insignias y Accesorios" },
];

const FALLBACK_PRODUCTS: any[] = [];

export function ProductGallery() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setAllProducts(res.data);
        } else {
          setAllProducts(FALLBACK_PRODUCTS);
        }
      })
      .catch((err) => {
        console.error("Error cargando productos, usando fallback", err);
        setAllProducts(FALLBACK_PRODUCTS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 800 : 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const currentProducts = allProducts.filter(p => 
    (activeCategory === "Todos" || p.category === activeCategory) && p.isPublished !== false
  );

  return (
    <div className="w-full relative text-stone-900 dark:text-white transition-colors duration-500">
      <div className="relative z-10 w-full">
        
        {/* Cabecera Cinemática de Galería */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-amber-400/80 uppercase tracking-[0.3em] text-xs font-semibold mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>Nuevas Llegadas</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-light tracking-tight mb-6"
          >
            Descubre nuestra <span className="italic text-stone-500 dark:text-stone-400">Selección</span>
          </motion.h2>
          
          {/* Filtros de Cristal Oscuro / Claro */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 p-2 rounded-3xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-xl border border-black/5 dark:border-white/10"
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                    active 
                      ? "text-white dark:text-stone-950" 
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border-color)]"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="galleryFilterBg"
                      className="absolute inset-0 bg-primary dark:bg-white rounded-full shadow-md"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Galería de Productos Horizontal (Estilo Lookbook) */}
        <div className="relative group/gallery">
          {/* Botones de Navegación Cinemáticos */}
          <button 
            aria-label="Producto anterior"
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-stone-900/60 backdrop-blur-xl border border-black/5 dark:border-white/10 text-stone-900 dark:text-white p-4 rounded-full shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:bg-white dark:hover:bg-white/10 hover:scale-110 -ml-6"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            aria-label="Siguiente producto"
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-stone-900/60 backdrop-blur-xl border border-black/5 dark:border-white/10 text-stone-900 dark:text-white p-4 rounded-full shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:bg-white dark:hover:bg-white/10 hover:scale-110 -mr-6"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-12 pt-4 snap-x snap-mandatory scrollbar-none w-full px-4 md:px-8"
          >
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center py-20 text-[var(--muted)] animate-pulse font-light tracking-widest uppercase"
                >
                  Cargando Colección...
                </motion.div>
              ) : currentProducts.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center py-20 text-[var(--muted)] font-light tracking-widest uppercase"
                >
                  No hay piezas disponibles en esta categoría.
                </motion.div>
              ) : (
                currentProducts.map((product, idx) => (
                  <motion.div
                    key={`product-${product.id}`}
                    layout
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="min-w-[85vw] sm:min-w-[320px] max-w-[320px] snap-center shrink-0"
                  >
                    <ProductCard product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image || product.images?.[0] || 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
                      status: product.status || (product.stock > 0 ? '' : '')
                    }} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
