"use client";

import { Printer, Download, Plus, Trash2, User, FileText } from "lucide-react";
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
    <div className="lg:col-span-5 xl:col-span-4 space-y-6 print:hidden">
      <AnimateIn>
        <div className="group relative flex flex-col bg-gradient-to-b from-[#f9fbfaf0] via-white to-[#f4f7f5] dark:from-[#111916]/95 dark:via-[#0a0f0d] dark:to-[#070a09] backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.05] hover:border-[#1c785f]/30 dark:hover:border-[#d4af37]/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-black/[0.03] dark:shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_25px_rgba(46,196,166,0.03)] transition-all duration-700 overflow-hidden font-sans">
          
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#1c785f] via-[#2ec4a6] to-[#1c785f] dark:from-[#d4af37] dark:via-[#f5e1a4] dark:to-[#d4af37]"></div>
          
          <h1 className="text-2xl font-serif text-[#1a2b22] dark:text-[#f0f4f2] mb-1 tracking-tight transition-colors duration-700">Cotizador Inteligente</h1>
          <p className="text-[13px] text-[#5a6c65] dark:text-[#7a8c85] mb-6 transition-colors duration-700">Generador de última generación</p>

          {/* Botones Cinematográficos (Solo Iconos) */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={onPrint} 
              title="Imprimir"
              className="group/btn relative flex-1 overflow-hidden rounded-2xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(28,120,95,0.25)] dark:shadow-[0_8px_20px_rgba(212,175,55,0.2)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#1c785f] via-[#2ec4a6] to-[#1c785f] dark:from-[#d4af37] dark:via-[#f5e1a4] dark:to-[#d4af37] opacity-80 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center bg-gradient-to-br from-[#1a6652] to-[#134d3d] dark:from-[#bfa054] dark:to-[#997b2d] h-12 rounded-[15px] transition-all duration-300">
                <Printer className="w-5 h-5 text-white dark:text-[#070a09]" />
              </div>
            </button>
            <button 
              onClick={onPrint} 
              title="Descargar PDF"
              className="group/btn relative flex-1 overflow-hidden rounded-2xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(28,120,95,0.25)] dark:shadow-[0_8px_20px_rgba(212,175,55,0.2)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#1c785f] via-[#2ec4a6] to-[#1c785f] dark:from-[#d4af37] dark:via-[#f5e1a4] dark:to-[#d4af37] opacity-80 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center bg-gradient-to-br from-[#1a6652] to-[#134d3d] dark:from-[#bfa054] dark:to-[#997b2d] h-12 rounded-[15px] transition-all duration-300">
                <Download className="w-5 h-5 text-white dark:text-[#070a09]" />
              </div>
            </button>
          </div>

          {/* Formulario de Cliente */}
          <div className="space-y-4 mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#5a6c65] dark:text-[#7a8c85] flex items-center justify-between transition-colors duration-700">
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#1c785f] dark:text-[#d4af37] transition-colors duration-700" /> 
                Datos del Cliente
              </span>
              {isAuthenticated && (
                <span className="bg-[#1c785f]/10 dark:bg-[#d4af37]/10 text-[#1c785f] dark:text-[#d4af37] px-2 py-1 rounded text-[9px] border border-[#1c785f]/20 dark:border-[#d4af37]/20">Cuenta Vinculada</span>
              )}
            </h3>
            
            <div className="space-y-3">
              {/* Inputs Cinematográficos */}
              {[
                { placeholder: "Nombre completo", value: clientInfo.name, field: "name", type: "text" },
                { placeholder: "Club / Institución", value: clientInfo.club, field: "club", type: "text" },
                { placeholder: "Iglesia o Distrito", value: clientInfo.church, field: "church", type: "text" },
              ].map((inputProps) => (
                <input 
                  key={inputProps.field}
                  readOnly={isAuthenticated} 
                  type={inputProps.type} 
                  placeholder={inputProps.placeholder} 
                  value={inputProps.value} 
                  onChange={e => setClientInfo({...clientInfo, [inputProps.field]: e.target.value})} 
                  className={`w-full bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-black/5 dark:bg-white/5' : ''}`} 
                />
              ))}
              <div className="grid grid-cols-2 gap-3">
                <input readOnly={isAuthenticated} type="email" placeholder="Correo" value={clientInfo.email} onChange={e => setClientInfo({...clientInfo, email: e.target.value})} className={`w-full bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-black/5 dark:bg-white/5' : ''}`} />
                <input readOnly={isAuthenticated} type="tel" placeholder="Teléfono" value={clientInfo.phone} onChange={e => setClientInfo({...clientInfo, phone: e.target.value})} className={`w-full bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-black/5 dark:bg-white/5' : ''}`} />
              </div>
            </div>
          </div>

          {/* Formulario de Artículos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-t border-black/[0.05] dark:border-white/[0.05] pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#5a6c65] dark:text-[#7a8c85] flex items-center gap-2 transition-colors duration-700">
                <FileText className="w-3.5 h-3.5 text-[#1c785f] dark:text-[#d4af37] transition-colors duration-700" />
                Artículos
              </h3>
              <button 
                onClick={addItem} 
                className="text-[11px] text-[#1c785f] dark:text-[#d4af37] hover:text-white dark:hover:text-[#070a09] hover:bg-[#1c785f] dark:hover:bg-[#d4af37] border border-[#1c785f]/20 dark:border-[#d4af37]/20 transition-all duration-300 flex items-center gap-1 font-bold bg-[#1c785f]/5 dark:bg-[#d4af37]/10 px-3 py-1.5 rounded-lg uppercase tracking-wider"
              >
                <Plus className="w-3 h-3" /> Añadir
              </button>
            </div>
            
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {items.map((item: any) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    className="bg-white/50 dark:bg-[#060908]/50 border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-4 space-y-3 relative group shadow-sm transition-colors duration-700"
                  >
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="absolute top-3 right-3 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <input 
                      type="text" 
                      placeholder="Descripción del artículo..." 
                      value={item.description} 
                      onChange={e => updateItem(item.id, 'description', e.target.value)} 
                      className="w-[90%] bg-transparent border-b border-black/10 dark:border-white/10 px-1 py-1.5 text-[14px] font-medium text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/50 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] transition-colors" 
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#5a6c65] dark:text-[#7a8c85] font-bold uppercase tracking-wider mb-1.5 ml-1 transition-colors duration-700">Cant.</span>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} 
                          className="w-full bg-black/5 dark:bg-[#111916] border border-black/[0.05] dark:border-white/[0.05] rounded-xl px-3 py-2 text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] transition-all" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#5a6c65] dark:text-[#7a8c85] font-bold uppercase tracking-wider mb-1.5 ml-1 transition-colors duration-700">Precio Unit. ($)</span>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={item.unitPrice} 
                          onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} 
                          className="w-full bg-black/5 dark:bg-[#111916] border border-black/[0.05] dark:border-white/[0.05] rounded-xl px-3 py-2 text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] transition-all" 
                        />
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
