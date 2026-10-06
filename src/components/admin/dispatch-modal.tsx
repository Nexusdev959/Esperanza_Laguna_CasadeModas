"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Bus, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DispatchModal({ 
  isOpen, 
  onClose, 
  orderId, 
  onConfirm 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  orderId: string,
  onConfirm: (data: any) => void 
}) {
  const [shippingMethod, setShippingMethod] = useState<"COURIER" | "TERMINAL">("COURIER");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [terminalName, setTerminalName] = useState("");
  const [busCompany, setBusCompany] = useState("");
  const [instructions, setInstructions] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      orderId,
      shippingMethod,
      courierName: shippingMethod === "COURIER" ? courierName : busCompany,
      trackingNumber,
      terminalName: shippingMethod === "TERMINAL" ? terminalName : null,
      instructions
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--background)]/50">
            <div>
              <h2 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Registrar Despacho</h2>
              <p className="text-sm text-[var(--muted)]">Orden {orderId}</p>
            </div>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-full hover:bg-black/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Selector de Método */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setShippingMethod("COURIER")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${shippingMethod === 'COURIER' ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--border-color)] text-[var(--muted)] hover:border-primary/50'}`}
              >
                <Truck className="w-6 h-6" />
                <span className="text-sm font-medium">Transportadora</span>
              </button>
              <button 
                type="button"
                onClick={() => setShippingMethod("TERMINAL")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${shippingMethod === 'TERMINAL' ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--border-color)] text-[var(--muted)] hover:border-primary/50'}`}
              >
                <Bus className="w-6 h-6" />
                <span className="text-sm font-medium">Terminal de Buses</span>
              </button>
            </div>

            {/* Formulario Dinámico */}
            <div className="space-y-4">
              {shippingMethod === "COURIER" ? (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">Empresa Transportadora</label>
                    <input required type="text" value={courierName} onChange={e => setCourierName(e.target.value)} placeholder="Ej. Servientrega, Interrapidísimo" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">Número de Guía</label>
                    <input required type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Ej. SRV-10293847" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">Empresa de Buses</label>
                    <input required type="text" value={busCompany} onChange={e => setBusCompany(e.target.value)} placeholder="Ej. Expreso Bolivariano, Copetran" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">Terminal de Destino</label>
                    <input required type="text" value={terminalName} onChange={e => setTerminalName(e.target.value)} placeholder="Ej. Terminal Salitre, Bogotá" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">Número de Guía / Remesa</label>
                    <input required type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Ej. 99887766" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">Instrucciones para el Cliente (Opcional)</label>
                <textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Ej. Reclamar en taquilla con documento de identidad..." className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none h-20 resize-none"></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">Cancelar</Button>
              <Button type="submit" variant="primary" className="flex-1 gap-2 shadow-lg shadow-primary/20">
                <CheckCircle className="w-4 h-4" /> Confirmar Despacho
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
