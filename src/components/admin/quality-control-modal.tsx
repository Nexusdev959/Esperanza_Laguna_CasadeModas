"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QualityControlModal({
  isOpen,
  onClose,
  tasks,
  onApprove
}: {
  isOpen: boolean;
  onClose: () => void;
  tasks: any[];
  onApprove: (taskId: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--background)]/50 shrink-0">
            <div>
              <h2 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-500" /> Control de Calidad
              </h2>
              <p className="text-sm text-[var(--muted)]">Revisa y aprueba el trabajo de tus operarios antes del despacho.</p>
            </div>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-full hover:bg-black/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Tasks */}
          <div className="overflow-y-auto p-6 custom-scrollbar flex-1 space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-20" />
                <p className="text-sm text-[var(--muted)]">No hay tareas pendientes de revisión en este momento.</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-purple-500/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold bg-[var(--surface)] px-2 py-1 rounded border border-[var(--border-color)] text-[var(--muted)]">
                        {task.orderId}
                      </span>
                      <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-2 py-1 rounded">Esperando Revisión</span>
                    </div>
                    <h3 className="font-medium text-[var(--foreground)] text-base">{task.title}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1">{task.description}</p>
                    <p className="text-xs text-[var(--muted)] mt-2">Terminado: <span className="font-medium text-[var(--foreground)]">Recientemente</span></p>
                  </div>
                  
                  <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                    <Button 
                      onClick={() => onApprove(task.id)}
                      variant="primary" 
                      className="w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20 bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4" /> Aprobar Calidad
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                    >
                      Rechazar (Rehacer)
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
