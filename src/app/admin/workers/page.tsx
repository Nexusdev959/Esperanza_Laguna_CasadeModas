"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { WorkerList } from "@/components/admin/worker-list";
import { WorkerDetails } from "@/components/admin/worker-details";
import { WorkerRegistrationModal } from "@/components/admin/worker-registration-modal";

const MOCK_WORKERS: any[] = [];

export default function WorkersPage() {
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeWorker = workers.find(w => w.id === selectedWorker);

  const handleTaskAssigned = (workerId: string, newTask: any) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          status: "ocupado",
          activeTasks: [newTask, ...w.activeTasks]
        };
      }
      return w;
    }));
  };

  const handleWorkerAdded = (data: any) => {
    console.log("Nuevo trabajador:", data);
    const newWorker = {
      id: data.id || `WK-${Date.now()}`,
      name: data.name,
      email: data.email,
      specialty: data.specialty,
      status: "activo",
      efficiency: 100,
      tasksCompleted: 0,
      hoursLogged: 0,
      avatar: "https://images.pexels.com/photos/3760371/pexels-photo-3760371.jpeg?auto=compress&cs=tinysrgb&w=150", // placeholder
      activeTasks: [],
      history: []
    };
    setWorkers([newWorker, ...workers]);
    setSelectedWorker(newWorker.id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Administración de Trabajadores</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Supervisa el rendimiento, asigna tareas y gestiona el tiempo de tu equipo de confección y logística.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-transform active:scale-95 shadow-sm"
        >
          <UserPlus className="w-5 h-5" /> Registrar Trabajador
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        <WorkerList 
          workers={workers} 
          selectedWorker={selectedWorker} 
          setSelectedWorker={setSelectedWorker} 
        />
        
        <WorkerDetails 
          activeWorker={activeWorker} 
          onTaskAssigned={handleTaskAssigned}
        />
      </div>

      <WorkerRegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleWorkerAdded}
      />
    </div>
  );
}
