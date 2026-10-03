"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Filter } from "lucide-react";
import { OrderDetailsModal } from "@/components/admin/order-details-modal";
import { api } from "@/lib/api";

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)]">Recepción de Pedidos</h1>
          <p className="text-sm text-[var(--muted)]">Gestiona y actualiza el estado de los pedidos de clubes.</p>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por ID, Club o Cliente..." 
              className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm font-medium hover:bg-[var(--border-color)] transition-colors">
            <Filter className="w-4 h-4" /> Filtrar Estado
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--muted)] text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">ID Pedido</th>
                <th className="px-6 py-3 font-medium">Cliente / Club</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--foreground)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[var(--muted)]">Cargando pedidos...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[var(--muted)]">No hay pedidos en la bandeja de entrada.</td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-[var(--background)]/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user?.name || 'Cliente Anónimo'}</p>
                    <p className="text-xs text-[var(--muted)]">{order.user?.club || 'Sin club'}</p>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">${parseFloat(order.totalAmount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'Nuevo' ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-500 dark:border-purple-900' :
                      order.status === 'Preparando' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-900' :
                      order.status === 'Enviado' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-500 dark:border-blue-900' :
                      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-500 dark:border-green-900'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1 ml-auto text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" /> Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailsModal 
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
