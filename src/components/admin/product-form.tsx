"use client";

import { Tag, Ruler, Box, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductForm({ formData, setFormData, handleCreate, onCancel }: any) {
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
        <h2 className="text-xl font-serif text-[var(--foreground)] flex items-center gap-2">
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
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Nombre del Producto</label>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required type="text" placeholder="Ej. Pantalón Oficial..." className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Precio (COP)</label>
            <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Público / Género</label>
            <select value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
              <option>Damas</option>
              <option>Caballeros</option>
              <option>Niños</option>
              <option>Niñas</option>
              <option>Unisex</option>
            </select>
          </div>
        </div>

        {/* Detalles Logísticos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--border-color)]">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Categoría / Familia</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option>Moda Damas</option>
                <option>Moda Caballeros</option>
                <option>Conquistadores</option>
                <option>Aventureros</option>
                <option>Insignias y Parches</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Modalidad de Venta</label>
              <div className="grid grid-cols-1 gap-2">
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${formData.saleMode === 'unidad' ? 'border-primary bg-primary/5 text-primary' : 'border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--background)]'}`}>
                  <input type="radio" name="saleMode" value="unidad" checked={formData.saleMode === 'unidad'} onChange={() => setFormData({...formData, saleMode: 'unidad'})} className="hidden" />
                  <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">{formData.saleMode === 'unidad' && <span className="w-2 h-2 bg-current rounded-full"></span>}</span>
                  <span className="text-sm font-medium">Por Unidad Individual</span>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${formData.saleMode === 'uniforme_completo' ? 'border-primary bg-primary/5 text-primary' : 'border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--background)]'}`}>
                  <input type="radio" name="saleMode" value="uniforme_completo" checked={formData.saleMode === 'uniforme_completo'} onChange={() => setFormData({...formData, saleMode: 'uniforme_completo'})} className="hidden" />
                  <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">{formData.saleMode === 'uniforme_completo' && <span className="w-2 h-2 bg-current rounded-full"></span>}</span>
                  <span className="text-sm font-medium">Combo (Uniforme Completo)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"><Ruler className="w-4 h-4" /> Variaciones de Talla</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(formData.sizes) as Array<keyof typeof formData.sizes>).map(size => (
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
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"><Box className="w-4 h-4" /> Modelo de Producción</label>
              <div className="flex bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-1">
                <button type="button" onClick={() => setFormData({...formData, productionType: 'stock'})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.productionType === 'stock' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}>En Stock</button>
                <button type="button" onClick={() => setFormData({...formData, productionType: 'encargo'})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.productionType === 'encargo' ? 'bg-[var(--surface)] text-amber-600 dark:text-amber-500 shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}>Bajo Encargo</button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {formData.productionType === 'stock' ? (
                <motion.div key="stock" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                  <p className="text-xs text-[var(--muted)]">El stock se calculará sumando las cantidades que ingresaste en cada talla seleccionada arriba.</p>
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
