"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArchiveX, X } from "lucide-react";
import { ProductCard, Product, toCardProduct, PRODUCT_CATEGORIES } from "@/components/product-card";

const CATEGORIES = [{ id: "all", label: "Colección Completa" }, ...PRODUCT_CATEGORIES];

// Sin tildes ni mayúsculas: "insignia" encuentra "Insígnia" y viceversa
const normalize = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// useSearchParams exige Suspense para que el build pueda prerenderizar la página
export default function CataloguePage() {
  return (
    <Suspense>
      <Catalogue />
    </Suspense>
  );
}

function Catalogue() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [activeCategory, setActiveCategory] = useState("all");

  const [products, setProducts] = useState<Product[]>([]);
  // Mientras carga no se muestra "Colección en Preparación": parecería una tienda vacía
  const [loaded, setLoaded] = useState(false);

  // Enlaces como /catalogo?categoria=Insignias%20y%20Parches abren la categoría ya filtrada
  const categoryFromUrl = searchParams.get("categoria");
  useEffect(() => {
    if (categoryFromUrl && CATEGORIES.some((c) => c.id === categoryFromUrl)) setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts((res.data || []).map(toCardProduct)))
      .catch((err) => console.error('Error cargando el catálogo', err))
      .finally(() => setLoaded(true));
  }, []);

  // En móvil la barra se desplaza: la categoría activa (p. ej. llegada desde el hero) siempre queda a la vista
  useEffect(() => {
    // Se mueve solo la barra: scrollIntoView también desplazaba el <main> (overflow-hidden) y corría toda la página
    const btn = document.querySelector(`[data-category="${CSS.escape(activeCategory)}"]`);
    const bar = btn?.closest('.overflow-x-auto');
    if (!btn || !bar) return;
    const b = btn.getBoundingClientRect();
    const r = bar.getBoundingClientRect();
    bar.scrollLeft += b.left - r.left - (r.width - b.width) / 2;
  }, [activeCategory]);

  const q = normalize(query);
  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === "all" || p.category === activeCategory) &&
      (!q || normalize(p.name).includes(q) || normalize(p.category).includes(q))
  );

  return (
    <main className="min-h-screen bg-[#f4f7f5] dark:bg-[#050807] pt-40 pb-24 text-stone-900 dark:text-white overflow-hidden selection:bg-[#2ec4a6]/30 transition-colors duration-700">
      
      {/* ================= HEADER CINEMÁTICO ================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mb-16">
        
        {/* Luces de fondo sutiles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/10 dark:bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none transition-colors duration-700" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#2ec4a6]/10 dark:bg-[#2ec4a6]/5 blur-[100px] rounded-full pointer-events-none transition-colors duration-700" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2 text-[#b48c28] dark:text-[#d4af37] mb-6 transition-colors duration-700"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
            Nuevas Llegadas
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-light tracking-tight mb-12 text-[#1a2b22] dark:text-[#f2f6f4] transition-colors duration-700"
        >
          Descubre nuestra <span className="font-serif italic text-[#3c5246] dark:text-[#c8d4cf] transition-colors duration-700">Selección</span>
        </motion.h1>

        {/* ================= BARRA DE FILTROS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full overflow-x-auto pb-4 hide-scrollbar flex"
        >
          {/* mx-auto en vez de justify-center en el padre: con scroll, justify-center dejaba las primeras categorías fuera de alcance */}
          <div className="mx-auto flex items-center gap-1.5 p-1.5 bg-black/5 dark:bg-[#0a0f0d]/80 backdrop-blur-md border border-black/[0.04] dark:border-white/[0.06] rounded-full min-w-max shadow-xl transition-colors duration-700">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  data-category={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-5 py-2.5 rounded-full text-[13px] font-sans font-medium tracking-wide transition-all duration-500 outline-none
                    ${isActive ? "text-white dark:text-[#050807]" : "text-[#5a6c65] dark:text-[#7a8c85] hover:text-[#1a2b22] dark:hover:text-[#d4dcd9]"}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#1a2b22] dark:bg-[#fdfbf7] rounded-full shadow-md dark:shadow-[0_2px_10px_rgba(255,255,255,0.1)] transition-colors duration-700"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {query && (
          <div className="mt-4 inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full border border-[#2ec4a6]/30 bg-[#2ec4a6]/10 text-[13px] text-[#1a2b22] dark:text-[#d4dcd9]">
            <span>
              Resultados para <strong className="font-semibold">“{query}”</strong>
            </span>
            <button
              onClick={() => router.replace("/catalogo")}
              aria-label="Quitar búsqueda"
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* ================= GRILLA DE PRODUCTOS ================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 min-h-[40vh]">
        {!loaded ? (
          <div className="flex justify-center py-24" role="status" aria-label="Cargando productos">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2ec4a6]" />
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* ================= ESTADO VACÍO (EMPTY STATE) ================= */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-tr from-[#e5ebe7] to-[#f4f7f5] dark:from-[#111916] dark:to-[#0a0f0d] border border-black/[0.05] dark:border-white/[0.05] flex items-center justify-center shadow-[0_0_40px_rgba(46,196,166,0.1)] dark:shadow-[0_0_40px_rgba(46,196,166,0.05)] transition-colors duration-700">
                <ArchiveX className="w-8 h-8 text-[#5a6c65] dark:text-[#5d6f68] transition-colors duration-700" />
              </div>
              <h3 className="text-xl font-serif text-[#2a3b32] dark:text-[#c8d4cf] mb-3 transition-colors duration-700">
                {query ? "Sin resultados" : "Colección en Preparación"}
              </h3>
              <p className="text-[#5a6c65] dark:text-[#7a8c85] font-sans text-[13px] max-w-md mx-auto leading-relaxed transition-colors duration-700">
                {query
                  ? `No encontramos prendas para “${query}”. Prueba con otra palabra, como “insignia” o “uniforme”.`
                  : "Nuestros sastres están trabajando meticulosamente en las nuevas prendas para esta categoría. Vuelve pronto para descubrir la excelencia de nuestra manufactura nacional."}
              </p>

              <button
                onClick={() => {
                  setActiveCategory("all");
                  if (query) router.replace("/catalogo");
                }}
                className="mt-8 px-6 py-2.5 rounded-full bg-transparent border border-black/10 dark:border-white/10 text-[#2a3b32] dark:text-[#d4dcd9] text-xs font-medium tracking-[0.15em] uppercase hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300"
              >
                Ver Colección Completa
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </section>
      
    </main>
  );
}
