"use client";

import { Printer, Plus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/ui/animate-in";
import { motion, AnimatePresence } from "framer-motion";

export function QuoteEditor({ 
  clientInfo, 
  setClientInfo, 
  items, 
  setItems, 
  onPrint,
  isAuthenticated 
}: any) {
  
  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map((item: any) => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item: any) => item.id !== id));
  };

  return (
    <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden">
      <AnimateIn>
        <div className="bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          
          <h1 className="text-2xl font-serif text-[var(--foreground)] mb-1">Cotizador Inteligente</h1>
          <p className="text-sm text-[var(--muted)] mb-6">Generador de última generación</p>

          {/* Botones de Acción */}
          <div className="flex gap-3 mb-8">
            <Button onClick={onPrint} variant="primary" className="flex-1 gap-2 shadow-lg shadow-primary/20">
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </Button>
          </div>

          {/* Formulario de Cliente */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] flex items-center justify-between">
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> Datos del Cliente</span>
              {isAuthenticated && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px]">Cuenta Vinculada</span>
              )}
            </h3>
            
            <div className="space-y-3">
              <input readOnly={isAuthenticated} type="text" placeholder="Nombre completo" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} className={`w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-primary ${isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`} />
              <input readOnly={isAuthenticated} type="text" placeholder="Club / Institución" value={clientInfo.club} onChange={e => setClientInfo({...clientInfo, club: e.target.value})} className={`w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-primary ${isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`} />
              <input readOnly={isAuthenticated} type="text" placeholder="Iglesia o Distrito" value={clientInfo.church} onChange={e => setClientInfo({...clientInfo, church: e.target.value})} className={`w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-primary ${isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`} />
              <div className="grid grid-cols-2 gap-3">
                <input readOnly={isAuthenticated} type="email" placeholder="Correo" value={clientInfo.email} onChange={e => setClientInfo({...clientInfo, email: e.target.value})} className={`w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-primary ${isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`} />
                <input readOnly={isAuthenticated} type="tel" placeholder="Teléfono" value={clientInfo.phone} onChange={e => setClientInfo({...clientInfo, phone: e.target.value})} className={`w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-primary ${isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`} />
              </div>
            </div>
          </div>

          {/* Formulario de Artículos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] flex items-center gap-2">
                Lista de Artículos
              </h3>
              <button onClick={addItem} className="text-xs text-primary hover:text-white transition-colors flex items-center gap-1 font-medium bg-primary/10 px-2 py-1 rounded">
                <Plus className="w-3 h-3" /> Añadir
              </button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              <AnimatePresence>
                {items.map((item: any) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl p-3 space-y-2 relative group"
                  >
                    <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <input type="text" placeholder="Descripción del artículo" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full bg-transparent border-b border-black/10 dark:border-white/10 px-1 py-1 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[var(--muted)] mb-1">Cant.</span>
                        <input type="number" min="1" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-full bg-black/10 dark:bg-black/40 border border-transparent rounded px-2 py-1 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[var(--muted)] mb-1">Precio Unit. ($)</span>
                        <input type="number" step="0.01" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full bg-black/10 dark:bg-black/40 border border-transparent rounded px-2 py-1 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </AnimateIn>
    </div>
  );
}
