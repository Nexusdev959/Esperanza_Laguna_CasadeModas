"use client";

import { Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomerList({ customers, selectedCustomer, setSelectedCustomer }: any) {
  return (
    <div className="md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--background)]/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Buscar cliente, ID o email..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {customers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-[var(--muted)] flex flex-col items-center">
              <Users className="w-12 h-12 mb-3 opacity-20" />
              <p>No hay clientes registrados.</p>
            </motion.div>
          ) : (
            customers.map((customer: any) => (
              <motion.button
                key={customer.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedCustomer(customer.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedCustomer === customer.id 
                    ? "bg-primary/5 border-primary/30 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-[var(--background)]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden shrink-0 text-primary font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-medium text-[var(--foreground)] truncate">{customer.name}</h3>
                    <p className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">ID: {customer.id}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mt-3">
                  <span className="text-[var(--muted)]">{customer.totalOrders} Pedidos</span>
                  <span className="font-medium text-[var(--foreground)]">Total: {customer.totalSpent}</span>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
