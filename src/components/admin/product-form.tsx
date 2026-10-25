"use client";

import { useState } from "react";
import { Tag, Ruler, Box, Clock, ListChecks, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT_CATEGORIES } from "@/components/product-card";

// Atajos para cargar las clases; el admin puede quitar o agregar las que quiera
const CLASS_PRESETS = {
  Conquistadores: ["Amigo", "Compañero", "Explorador", "Orientador", "Viajero", "Guía"],
  Aventureros: ["Corderitos", "Castorcitos", "Abejitas Laboriosas", "Rayitos de Sol", "Constructores", "Manos Ayudadoras"],
};
// Las tallas en su orden natural (la base de datos devuelve las llaves desordenadas)
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "Única"];

export function ProductForm({ formData, setFormData, handleCreate, onCancel }: any) {
  const [newOption, setNewOption] = useState("");
  const categories: string[] = formData.categories ?? [];
  const options: string[] = formData.options ?? [];

  const toggleCategory = (id: string) =>
    setFormData({ ...formData, categories: categories.includes(id) ? categories.filter((c) => c !== id) : [...categories, id] });

  const addOptions = (values: string[]) => {
    const clean = values.map((v) => v.trim()).filter(Boolean);
    setFormData({ ...formData, options: [...new Set([...options, ...clean])] });
  };
  const handleSizeToggle = (size: keyof typeof formData.sizes) => {
    setFormData((prev: any) => ({
      ...prev,
      sizes: { 
        ...prev.sizes, 
        [size]: { ...prev.sizes[size], active: !prev.sizes[size].active } 
      }
    }));
  };

  const handleSizeQtyChange = (size: keyof typeof formData.sizes, qty: string) => {
    setFormData((prev: any) => ({
      ...prev,
      sizes: { 
        ...prev.sizes, 
        [size]: { ...prev.sizes[size], qty } 
      }
    }));
  };

  return (
    <div className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-[var(--border-color)] shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)] flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" /> Detalles del Nuevo Producto
        </h2>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-sm font-medium text-[var(--muted)]">Publicar en Catálogo Público</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={formData.isPublished}
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${formData.isPublished ? 'bg-primary' : 'bg-[var(--border-color)]'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isPublished ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>
      
      <form className="space-y-8" onSubmit={handleCreate}>
        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Nombre del Producto</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required type="text" placeholder="Ej. Pantalón Oficial..." className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Descripción y Detalles</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Escribe los detalles del producto, materiales, composición..." className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" />
            </div>
          </div>
          <div className="space-y-4 md:col-span-1">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Precio (COP)</label>
              <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Público / Género</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {['Damas', 'Caballeros', 'Niñas', 'Niños', 'Unisex'].map(a => (
                <label key={a} className={`cursor-pointer px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${formData.audience.includes(a) ? 'bg-primary text-white border-primary' : 'bg-transparent border-[var(--border-color)] text-[var(--foreground)] hover:border-primary/50'}`}>
                  <input type="checkbox" className="hidden" checked={formData.audience.includes(a)} onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, audience: [...formData.audience, a]});
                    } else {
                      setFormData({...formData, audience: formData.audience.filter((item: string) => item !== a)});
                    }
                  }} />
                  {a}
                </label>
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* Detalles Logísticos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--border-color)]">
          
          <div className="space-y-6">
            <fieldset className="space-y-2">
              <legend className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Categorías</legend>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_CATEGORIES.map(c => {
                  const on = categories.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${on ? 'bg-primary text-white border-primary' : 'bg-transparent border-[var(--border-color)] text-[var(--foreground)] hover:border-primary/50'}`}
                    >
                      {on && categories[0] === c.id && <Star className="w-3 h-3 fill-current" aria-label="Principal" />}
                      {c.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[var(--muted)]">Elige todas las que apliquen: el producto aparece en cada una. La primera (con estrella) es la que se muestra en la tarjeta.</p>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2 mb-2"><ListChecks className="w-4 h-4" /> Opciones que elige el cliente</legend>
              <p className="text-xs text-[var(--muted)]">Para productos como las insignias de clase: el cliente indica cuántas unidades quiere de cada opción. Déjalo vacío si el producto no tiene opciones.</p>
              <div className="flex items-center gap-2">
                <label htmlFor="optionLabel" className="text-xs text-[var(--foreground)] shrink-0">Se llama</label>
                <input id="optionLabel" value={formData.optionLabel ?? ""} onChange={e => setFormData({...formData, optionLabel: e.target.value})} maxLength={40} placeholder="Clase" className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              {options.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {options.map((o) => (
                    <li key={o} className="inline-flex items-center gap-1 pl-3 pr-1 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {o}
                      <button type="button" onClick={() => setFormData({ ...formData, options: options.filter((x) => x !== o) })} aria-label={`Quitar ${o}`} className="p-0.5 rounded-full hover:bg-primary/20">
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <input
                  value={newOption}
                  onChange={e => setNewOption(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addOptions([newOption]); setNewOption(""); } }}
                  maxLength={80}
                  placeholder="Agregar opción y Enter"
                  aria-label="Nueva opción"
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-sm outline-none focus:border-primary"
                />
                <button type="button" onClick={() => { addOptions([newOption]); setNewOption(""); }} className="px-3 py-2 rounded-lg border border-[var(--border-color)] text-sm hover:border-primary/50">Agregar</button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {Object.entries(CLASS_PRESETS).map(([club, list]) => (
                  <button key={club} type="button" onClick={() => { addOptions(list); if (!formData.optionLabel) setFormData((prev: any) => ({ ...prev, optionLabel: "Clase" })); }} className="px-2.5 py-1 rounded-full border border-dashed border-[var(--border-color)] text-[var(--muted)] hover:text-primary hover:border-primary/50">
                    + Clases de {club}
                  </button>
                ))}
                {options.length > 0 && (
                  <button type="button" onClick={() => setFormData({ ...formData, options: [] })} className="px-2.5 py-1 rounded-full text-[var(--muted)] hover:text-red-500">Quitar todas</button>
                )}
              </div>
            </fieldset>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"><Ruler className="w-4 h-4" /> Variaciones de Talla</label>
            <div className="grid grid-cols-3 gap-3">
              {(SIZE_ORDER.filter(sz => sz in formData.sizes) as Array<keyof typeof formData.sizes>).map(size => (
                <button
                  key={String(size)}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`py-2 px-3 border rounded-lg text-sm font-medium transition-colors ${formData.sizes[size].active ? 'bg-primary text-white border-primary shadow-sm' : 'bg-[var(--background)] border-[var(--border-color)] text-[var(--muted)] hover:border-primary/50'}`}
                >
                  {String(size)}
                </button>
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <AnimatePresence>
                {(Object.keys(formData.sizes) as Array<keyof typeof formData.sizes>)
                  .filter(size => formData.sizes[size].active)
                  .map(size => (
                    <motion.div 
                      key={`qty-${String(size)}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 bg-[var(--background)] p-2 rounded-xl border border-[var(--border-color)]"
                    >
                      <div className="w-12 text-center font-bold text-xs text-[var(--foreground)]">{String(size)}</div>
                      <input 
                        type="number" 
                        placeholder="Cant. disponible" 
                        value={formData.sizes[size].qty}
                        onChange={(e) => handleSizeQtyChange(size, e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none px-2"
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed mt-2">Agrega el inventario específico para cada talla habilitada.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"><Box className="w-4 h-4" /> Configuración de Producto</label>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[var(--border-color)] rounded-xl hover:bg-[var(--background)] transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary rounded border-[var(--border-color)] focus:ring-primary"
                  checked={formData.requiresPersonalization}
                  onChange={(e) => setFormData({...formData, requiresPersonalization: e.target.checked})}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--foreground)]">Permitir Personalización (Insignias)</span>
                  <span className="text-xs text-[var(--muted)]">El cliente deberá escribir el nombre (club, mediaslunas, etc.).</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[var(--border-color)] rounded-xl hover:bg-[var(--background)] transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary rounded border-[var(--border-color)] focus:ring-primary"
                  checked={formData.requiresUnion}
                  onChange={(e) => setFormData({...formData, requiresUnion: e.target.checked})}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--foreground)]">Insignia de Unión</span>
                  <span className="text-xs text-[var(--muted)]">El cliente elige la unión y su asociación. Solo se fabrican las de la Unión Colombiana del Norte.</span>
                </div>
              </label>

              <div className={`p-3 border rounded-xl transition-colors ${formData.isUniform ? "border-primary/40 bg-primary/5" : "border-[var(--border-color)]"}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary rounded border-[var(--border-color)] focus:ring-primary"
                    checked={formData.isUniform}
                    onChange={(e) => setFormData({...formData, isUniform: e.target.checked})}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[var(--foreground)]">Uniforme completo</span>
                    <span className="text-xs text-[var(--muted)]">Banda y camisa con insignias. Cuenta en el cupo mensual; 10 días hábiles por unidad y 15 en lotes desde 3.</span>
                  </div>
                </label>
                {formData.isUniform && (
                  <div className="mt-3 pl-7 space-y-1.5">
                    <label htmlFor="noInsigniaDiscount" className="text-xs font-medium text-[var(--foreground)]">Rebaja si no lleva ninguna insignia (COP)</label>
                    <input
                      id="noInsigniaDiscount"
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.noInsigniaDiscount}
                      onChange={(e) => setFormData({...formData, noInsigniaDiscount: e.target.value})}
                      placeholder="Ej. 25000"
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-primary"
                    />
                    <p className="text-xs text-[var(--muted)]">Se descuenta solo si quita las insignias de la banda y de la camisa. Quitar una sola pieza no cambia el precio.</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Imágenes del Producto</label>
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center hover:bg-[var(--background)] transition-colors">
                  <input type="file" multiple accept="image/*" className="hidden" id="product-images" onChange={(e) => {
                    if (e.target.files) {
                      setFormData({...formData, images: [...formData.images, ...Array.from(e.target.files)]});
                    }
                  }} />
                  <label htmlFor="product-images" className="cursor-pointer flex flex-col items-center gap-2">
                    <Box className="w-6 h-6 text-[var(--muted)]" />
                    <span className="text-sm text-[var(--foreground)] font-medium">Sube fotos o arrástralas aquí</span>
                    <span className="text-xs text-[var(--muted)]">Seleccionadas: {formData.images?.length || 0}</span>
                  </label>
                </div>
              </div>

            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"><Box className="w-4 h-4" /> Modelo de Producción</label>
              <div className="flex bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-1">
                <button type="button" onClick={() => setFormData({...formData, productionType: 'stock'})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.productionType === 'stock' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}>En Stock</button>
                <button type="button" onClick={() => setFormData({...formData, productionType: 'encargo'})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.productionType === 'encargo' ? 'bg-[var(--surface)] text-amber-600 dark:text-amber-500 shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}>Bajo Encargo</button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {formData.productionType === 'stock' ? (
                <motion.div key="stock" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                  <p className="text-xs text-[var(--muted)]">El inventario es la suma de las cantidades de las tallas activas de arriba. Si el producto no tiene tallas, activa «Única» y escribe ahí la cantidad.</p>
                </motion.div>
              ) : (
                <motion.div key="encargo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"><Clock className="w-3 h-3" /> Tiempo de Confección</label>
                  <select value={formData.estimatedDays} onChange={e => setFormData({...formData, estimatedDays: e.target.value})} className="w-full px-4 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-500 rounded-xl text-sm outline-none font-medium">
                    <option value="3">3 Días Hábiles</option>
                    <option value="7">1 Semana (7 Días)</option>
                    <option value="15">15 Días Hábiles</option>
                    <option value="30">Un Mes (30 Días)</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
          <button type="button" onClick={onCancel} className="px-6 py-3 border border-[var(--border-color)] text-[var(--foreground)] rounded-xl text-sm font-medium hover:bg-[var(--background)] transition-colors">Cancelar</button>
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-transform active:scale-[0.98]">Subir Producto a la Web</button>
        </div>
      </form>
    </div>
  );
}
