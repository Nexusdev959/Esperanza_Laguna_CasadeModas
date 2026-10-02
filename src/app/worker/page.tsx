"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, PlayCircle, ClipboardList, AlertCircle, Pickaxe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSocket } from "@/lib/socket";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";

interface WorkerTask {
  id: string;
  orderId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedAt: string;
}

const MOCK_TASKS: WorkerTask[]  = [];

export default function WorkerPanel() {
  const [tasks, setTasks] = useState<WorkerTask[]>(MOCK_TASKS);

  const workerId = "WK-001"; // TODO: Reemplazar con ID del trabajador logueado real

  useEffect(() => {
    // Escuchar actualizaciones en tiempo real
    const socket = getSocket();
    
    socket.emit('join_worker_room');
    
    socket.on('task_update', (updatedTask: any) => {
      setTasks(prev => {
        const exists = prev.find(t => t.id === updatedTask.id);
        if (exists) {
          return prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t);
        }
        return [updatedTask, ...prev];
      });
    });

    // Fallback sync for localStorage if needed
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pilypage_worker_tasks' && e.newValue) {
        try { setTasks(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      socket.off('task_update');
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const saveTasks = (newTasks: WorkerTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('pilypage_worker_tasks', JSON.stringify(newTasks));
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "PENDING": return <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Pendiente</span>;
      case "IN_PROGRESS": return <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><PlayCircle className="w-3 h-3 animate-pulse"/> En Proceso</span>;
      case "REVIEW": return <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> En Revisión</span>;
      case "COMPLETED": return <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Completado</span>;
    }
  };

  const updateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    // Optimistic UI & LocalStorage Sync (Fallback)
    saveTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    try {
      if (newStatus === "IN_PROGRESS") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/tasks/${id}/assign`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workerId })
        });
      } else if (newStatus === "COMPLETED" || newStatus === "REVIEW") {
        // En este caso "REVIEW" es un proxy en UI, el backend lo toma como COMPLETED 
        // o podemos mantenerlo en REVIEW, depende del flujo. Mapeo a complete.
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/tasks/${id}/complete`, {
          method: 'PATCH',
        });
      }
    } catch (e) {
      console.error("Error updating task:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 mt-24">
        
        {/* Header del Colaborador */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
              AM
            </div>
            <div>
              <h1 className="text-2xl font-serif text-[var(--foreground)]">Hola, Andrés (Confección)</h1>
              <p className="text-[var(--muted)] text-sm">Tienes {tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length} tareas activas hoy.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[var(--background)] p-4 rounded-2xl border border-[var(--border-color)]">
            <div className="text-center px-4 border-r border-[var(--border-color)]">
              <p className="text-2xl font-bold text-[var(--foreground)]">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Completadas</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-primary">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">En Proceso</p>
            </div>
          </div>
        </div>

        {/* Lista de Tareas */}
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" /> 
            Mis Tareas Asignadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <div key={task.id} className={`bg-[var(--surface)] border rounded-2xl p-6 flex flex-col shadow-sm transition-all duration-300 ${task.status === 'IN_PROGRESS' ? 'border-primary ring-1 ring-primary/20' : 'border-[var(--border-color)]'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono font-bold bg-[var(--background)] px-2 py-1 rounded border border-[var(--border-color)] text-[var(--muted)]">
                    {task.orderId}
                  </span>
                  {getStatusBadge(task.status)}
                </div>

                <h3 className="font-medium text-[var(--foreground)] text-lg mb-2">{task.title}</h3>
                <p className="text-sm text-[var(--muted)] mb-6 flex-1 leading-relaxed">{task.description}</p>
                
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between mt-auto">
                  <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.assignedAt}
                  </span>
                  
                  {/* Acciones de Estado */}
                  <div className="flex gap-2">
                    {task.status === 'PENDING' && (
                      <Button onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')} variant="primary" size="sm" className="text-xs">
                        Iniciar Tarea
                      </Button>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <Button onClick={() => updateTaskStatus(task.id, 'REVIEW')} variant="outline" size="sm" className="text-xs border-purple-500 text-purple-500 hover:bg-purple-500/10 hover:text-purple-600">
                        Enviar a Revisión
                      </Button>
                    )}
                    {task.status === 'REVIEW' && (
                      <span className="text-xs text-[var(--muted)] italic">Esperando validación de Calidad</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
