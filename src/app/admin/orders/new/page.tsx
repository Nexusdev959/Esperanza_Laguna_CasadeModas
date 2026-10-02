"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { OrderList } from "@/components/admin/order-list";
import { OrderDetails } from "@/components/admin/order-details";

const MOCK_NEW_ORDERS = [];

export default function NewOrdersPage() {
  const [orders, setOrders] = useState(MOCK_NEW_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isTelegramConnected, setIsTelegramConnected] = useState(false);

  const activeOrder = orders.find(o => o.id === selectedOrder);

  const handleAccept = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    if (selectedOrder === id) setSelectedOrder(orders[0]?.id || null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header & Telegram Integration */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)]">Bandeja de Entrada: Pedidos</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Acepta nuevos pedidos y contacta a los clientes inmediatamente.</p>
        </div>
        
        {/* Telegram Integration Pill */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${isTelegramConnected ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-[var(--surface)] border-[var(--border-color)] text-[var(--muted)]'}`}>
          <Send className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider">Telegram Bot</span>
            <span className="text-xs">{isTelegramConnected ? 'Conectado - Recibiendo Alertas' : 'Desconectado'}</span>
          </div>
          <button 
            onClick={() => setIsTelegramConnected(!isTelegramConnected)}
            className={`ml-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${isTelegramConnected ? 'bg-blue-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            {isTelegramConnected ? 'Desconectar' : 'Vincular'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        <OrderList 
          orders={orders} 
          selectedOrder={selectedOrder} 
          setSelectedOrder={setSelectedOrder} 
        />
        
        <OrderDetails 
          activeOrder={activeOrder} 
          handleAccept={handleAccept} 
        />
      </div>
    </div>
  );
}
