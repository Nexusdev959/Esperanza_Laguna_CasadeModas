"use client";

import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { DispatchModal } from "@/components/admin/dispatch-modal";
import { QualityControlModal } from "@/components/admin/quality-control-modal";
import { BellRing } from "lucide-react";

type OrderStage = "Corte/Recolección" | "Empaquetado" | "Listo para Envío";

const INITIAL_ORDERS: any[] = [];

export default function PreparationBoard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<string | null>(null);
  const [workerTasks, setWorkerTasks] = useState<any[]>([]);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('pilypage_admin_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {}
    }

    // Initial load for worker tasks
    const wtSaved = localStorage.getItem('pilypage_worker_tasks');
    if (wtSaved) {
      try {
        setWorkerTasks(JSON.parse(wtSaved));
      } catch (e) {}
    }

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pilypage_admin_orders' && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'pilypage_worker_tasks' && e.newValue) {
        try {
          setWorkerTasks(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveOrders = (newOrders: any[]) => {
    setOrders(newOrders);
    localStorage.setItem('pilypage_admin_orders', JSON.stringify(newOrders));
  };

  const moveOrder = (id: string, newStage: OrderStage) => {
    saveOrders(orders.map(o => o.id === id ? { ...o, stage: newStage } : o));
  };

  const initDispatch = (id: string) => {
    setSelectedOrderForDispatch(id);
  };

  const handleDispatchConfirm = (dispatchData: any) => {
    console.log("Despacho confirmado:", dispatchData);
    saveOrders(orders.filter(o => o.id !== selectedOrderForDispatch));
    setSelectedOrderForDispatch(null);
  };

  const tasksInReview = workerTasks.filter(t => t.status === 'REVIEW');

  const handleApproveTask = (taskId: string) => {
    // Cambiar estado local y localStorage a COMPLETED
    const newTasks = workerTasks.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t);
    setWorkerTasks(newTasks);
    localStorage.setItem('pilypage_worker_tasks', JSON.stringify(newTasks));
    
    // Si no quedan tareas por revisar, cerrar modal opcionalmente
    if (newTasks.filter(t => t.status === 'REVIEW').length === 0) {
      setIsQCModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Tablero de Preparación (Kanban)</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Supervisa el estado logístico de los despachos y asigna tareas a tu equipo.</p>
        </div>
        
        {/* Alertas de Trabajadores */}
        {tasksInReview.length > 0 && (
          <button 
            onClick={() => setIsQCModalOpen(true)}
            className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 flex items-start gap-3 max-w-sm animate-pulse hover:bg-purple-500/20 transition-colors text-left cursor-pointer"
          >
            <BellRing className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-purple-500">¡Tareas por Revisar!</p>
              <p className="text-xs text-[var(--foreground)] mt-1">
                Tus trabajadores han terminado {tasksInReview.length} tarea(s). Requieren revisión de Calidad.
              </p>
            </div>
          </button>
        )}
      </div>

      <KanbanBoard 
        orders={orders} 
        moveOrder={moveOrder} 
        removeOrder={initDispatch} 
      />

      {/* Modal de Despacho */}
      <DispatchModal 
        isOpen={!!selectedOrderForDispatch} 
        orderId={selectedOrderForDispatch || ""} 
        onClose={() => setSelectedOrderForDispatch(null)} 
        onConfirm={handleDispatchConfirm} 
      />

      <QualityControlModal 
        isOpen={isQCModalOpen}
        onClose={() => setIsQCModalOpen(false)}
        tasks={tasksInReview}
        onApprove={handleApproveTask}
      />
    </div>
  );
}
