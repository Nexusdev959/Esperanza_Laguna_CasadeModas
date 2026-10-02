"use client";

import { CheckCircle2, Box, Truck, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OrderStage = "Corte/Recolección" | "Empaquetado" | "Listo para Envío";

const STAGES: { title: OrderStage, icon: any, color: string }[] = [
  { title: "Corte/Recolección", icon: Box /* Placeholder icon, using Box since Clock is not imported here to avoid extra imports if we can, actually let's import Clock */, color: "text-amber-500" },
  { title: "Empaquetado", icon: Box, color: "text-blue-500" },
  { title: "Listo para Envío", icon: Truck, color: "text-green-500" }
];

export function KanbanBoard({ orders, moveOrder, removeOrder }: any) {
  // Fix imports
  const { Clock, Box, Truck, CheckCircle2, UserCircle } = require("lucide-react");

  const STAGES_FIXED: { title: OrderStage, icon: any, color: string }[] = [
    { title: "Corte/Recolección", icon: Clock, color: "text-amber-500" },
    { title: "Empaquetado", icon: Box, color: "text-blue-500" },
    { title: "Listo para Envío", icon: Truck, color: "text-green-500" }
  ];

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
      {STAGES_FIXED.map((stage) => {
        const stageOrders = orders.filter((o: any) => o.stage === stage.title);
        const Icon = stage.icon;
        
        return (
          <div key={stage.title} className="flex flex-col bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm h-full">
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${stage.color}`} />
                <h3 className="font-medium text-[var(--foreground)]">{stage.title}</h3>
              </div>
              <span className="bg-[var(--background)] px-2 py-1 rounded-full text-xs font-bold border border-[var(--border-color)] text-[var(--muted)]">
                {stageOrders.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <AnimatePresence>
                {stageOrders.map((order: any) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={order.id}
                    className="bg-[var(--background)] border border-[var(--border-color)] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">{order.id}</span>
                      <span className="text-xs text-[var(--muted)]">{order.timeElapsed}</span>
                    </div>
                    <p className="font-medium text-sm text-[var(--foreground)] mb-1">{order.client}</p>
                    <p className="text-xs text-[var(--muted)] mb-4">{order.items}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <UserCircle className="w-4 h-4" />
                        <span className={order.assignedTo === "Pendiente" ? "text-amber-500" : ""}>{order.assignedTo}</span>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {stage.title === "Corte/Recolección" && (
                          <button onClick={() => moveOrder(order.id, "Empaquetado")} className="text-blue-500 hover:text-blue-600 p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg" title="Mover a Empaquetado">
                            <Box className="w-4 h-4" />
                          </button>
                        )}
                        {stage.title === "Empaquetado" && (
                          <button onClick={() => moveOrder(order.id, "Listo para Envío")} className="text-green-500 hover:text-green-600 p-1 bg-green-50 dark:bg-green-900/20 rounded-lg" title="Mover a Envío">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {stage.title === "Listo para Envío" && (
                          <button onClick={() => removeOrder(order.id)} className="text-primary hover:bg-primary hover:text-white transition-colors p-1 bg-primary/10 rounded-lg text-xs font-medium px-2" title="Despachar">
                            Despachar
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {stageOrders.length === 0 && (
                  <div className="text-center p-6 text-[var(--muted)] text-sm border border-dashed border-[var(--border-color)] rounded-xl">
                    Sin pedidos en esta fase.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
