"use client";

import { useState } from "react";
import { Scissors, ClipboardList, CheckCircle2, PackageSearch, Plus, TrendingUp, Clock, X, Briefcase, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WorkerDetails({ activeWorker, onTaskAssigned }: any) {
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    type: "confeccion",
    orderId: "",
  });

  if (!activeWorker) {
    return (
      <div className="md:col-span-8 lg:col-span-9 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--muted)] p-8 text-center shadow-sm">
        <ClipboardList className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-serif text-[var(--foreground)]">Selecciona un trabajador</p>
        <p className="text-sm">Revisa su rendimiento y asigna nuevas tareas de confección o logística.</p>
      </div>
    );
  }

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTaskAssigned) {
      onTaskAssigned(activeWorker.id, {
        title: taskData.title,
        type: taskData.type,
        orderId: taskData.orderId || "Para Stock",
        progress: 0,
        startedAt: "Ahora"
      });
    }
    setIsAssigningTask(false);
    setTaskData({ title: "", type: "confeccion", orderId: "" });
  };

  return (
    <div className="md:col-span-8 lg:col-span-9 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden relative">
      
      {/* Modal de Asignación de Tarea */}
      <AnimatePresence>
        {isAssigningTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[var(--surface)] border border-[var(--border-color)] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--background)]">
                <h3 className="font-serif text-lg text-[var(--foreground)] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Asignar Nueva Tarea
                </h3>
                <button onClick={() => setIsAssigningTask(false)} className="text-[var(--muted)] hover:text-red-500 transition-colors p-1"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAssignTask} className="p-6 space-y-5">
                
                {/* Tipo de Trabajo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Tipo de Trabajo</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${taskData.type === 'confeccion' ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-500' : 'border-[var(--border-color)] hover:bg-[var(--background)]'}`}>
                      <input type="radio" name="taskType" value="confeccion" checked={taskData.type === 'confeccion'} onChange={() => setTaskData({...taskData, type: 'confeccion'})} className="hidden" />
                      <Scissors className="w-4 h-4" /> <span className="text-sm font-medium">Confección</span>
                    </label>
                    <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${taskData.type === 'empaque' ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-500' : 'border-[var(--border-color)] hover:bg-[var(--background)]'}`}>
                      <input type="radio" name="taskType" value="empaque" checked={taskData.type === 'empaque'} onChange={() => setTaskData({...taskData, type: 'empaque'})} className="hidden" />
                      <PackageSearch className="w-4 h-4" /> <span className="text-sm font-medium">Empaque / Logística</span>
                    </label>
                  </div>
                </div>

                {/* Título de la Tarea */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Descripción de la Tarea</label>
                  <input 
                    required 
                    type="text" 
                    value={taskData.title}
                    onChange={e => setTaskData({...taskData, title: e.target.value})}
                    placeholder="Ej. Coser 15 insignias Clase Guía" 
                    className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                {/* Vínculo (Opcional) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Vincular a Pedido (Opcional)</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                    <input 
                      type="text" 
                      value={taskData.orderId}
                      onChange={e => setTaskData({...taskData, orderId: e.target.value})}
                      placeholder="Ej. ORD-0925 (Dejar vacío para Stock)" 
                      className="w-full pl-9 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <p className="text-xs text-[var(--muted)]">Si es ropa para bodega, déjalo en blanco.</p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-color)] mt-6">
                  <button type="button" onClick={() => setIsAssigningTask(false)} className="px-5 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--background)]">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Confirmar Asignación</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Profile */}
      <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--background)]/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--border-color)] shrink-0 shadow-sm">
            {activeWorker.avatar ? (
              <img src={activeWorker.avatar} alt={activeWorker.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--background)] flex items-center justify-center text-xl font-bold text-[var(--muted)]">
                {activeWorker.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-serif text-[var(--foreground)]">{activeWorker.name}</h2>
            <p className="text-sm text-[var(--muted)]">{activeWorker.email} • ID: {activeWorker.id}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm font-medium hover:border-primary transition-colors">
            Editar Perfil
          </button>
          <button onClick={() => setIsAssigningTask(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-transform active:scale-95 shadow-sm">
            <Plus className="w-4 h-4" /> Asignar Tarea
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)] flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Tareas Completadas</p>
              <p className="text-2xl font-serif text-[var(--foreground)] mt-1">{activeWorker.tasksCompleted}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Este mes</p>
            </div>
          </div>
          <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)] flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Horas Trabajadas</p>
              <p className="text-2xl font-serif text-[var(--foreground)] mt-1">{activeWorker.hoursLogged}h</p>
              <p className="text-xs text-[var(--muted)] mt-1">Acumuladas</p>
            </div>
          </div>
          <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)] flex items-start gap-3">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Rendimiento (KPI)</p>
              <p className="text-2xl font-serif text-[var(--foreground)] mt-1">{activeWorker.efficiency}%</p>
              <p className="text-xs text-green-500 font-medium mt-1">Óptimo</p>
            </div>
          </div>
        </div>

        {/* Current Active Tasks */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <Scissors className="w-4 h-4" /> Tareas en Curso
          </h3>
          
          <div className="space-y-3">
            <AnimatePresence>
              {activeWorker.activeTasks.length === 0 ? (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center p-6 text-[var(--muted)] text-sm border border-dashed border-[var(--border-color)] rounded-xl">
                  No tiene tareas asignadas en este momento.
                </motion.div>
              ) : (
                activeWorker.activeTasks.map((task: any, idx: number) => (
                  <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} key={idx} className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)]/50 hover:border-primary/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {task.type === "confeccion" ? <Scissors className="w-4 h-4 text-amber-500" /> : <PackageSearch className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--foreground)]">{task.title}</h4>
                        <p className="text-xs text-[var(--muted)] mt-1">Vinculado a: <span className="font-bold text-primary">{task.orderId}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end">
                      <span className="text-xs font-bold bg-[var(--surface)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--muted)] mb-1">
                        Progreso: {task.progress}%
                      </span>
                      <span className="text-[10px] text-[var(--muted)]">Asignado: {task.startedAt}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recent History */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Historial Reciente
          </h3>
          <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--background)] text-[var(--muted)] text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Tarea</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Duración</th>
                  <th className="px-4 py-3 font-medium text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--foreground)]">
                {activeWorker.history.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-[var(--background)]/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.task}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{item.date}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{item.duration}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-500 rounded text-[10px] font-bold uppercase">
                        Completado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
