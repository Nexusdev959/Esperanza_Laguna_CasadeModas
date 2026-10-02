"use client";

import { Search, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OrderList({ orders, selectedOrder, setSelectedOrder }: any) {
  return (
    <div className="md:col-span-5 lg:col-span-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--background)]/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Buscar pedido..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {orders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-[var(--muted)] flex flex-col items-center">
              <Bell className="w-12 h-12 mb-3 opacity-20" />
              <p>No hay pedidos nuevos por revisar.</p>
            </motion.div>
          ) : (
            orders.map((order: any) => (
              <motion.button
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedOrder === order.id 
                    ? "bg-primary/5 border-primary/30 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-[var(--background)]"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-[var(--foreground)]">{order.clientName}</span>
                  <span className="text-xs text-primary font-medium">{order.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[var(--muted)]">
                  <span>{order.id}</span>
                  <span className="font-semibold text-[var(--foreground)]">{order.total}</span>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
