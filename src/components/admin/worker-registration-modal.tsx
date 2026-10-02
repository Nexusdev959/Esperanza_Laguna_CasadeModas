"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, X, CheckCircle, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkerRegistrationModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (data: any) => void 
}) {
  const [mode, setMode] = useState<"SEARCH" | "CREATE">("SEARCH");
  
  // Para Búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Para Creación (Mocks temporales)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("Confección");

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulación de búsqueda en Base de Datos (MOCK)
    setTimeout(() => {
      setSearchResults([
        { id: "USR-001", name: "Carlos Miranda", email: "carlos@example.com" },
        { id: "USR-002", name: "Andrés Felipe", email: "andres@example.com" }
      ]);
      setIsSearching(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "SEARCH") {
      const selectedUser = searchResults.find(u => u.id === selectedUserId);
      if (selectedUser) {
        onConfirm({ ...selectedUser, specialty, isNewUser: false });
      }
    } else {
      onConfirm({ name, email, specialty, isNewUser: true, id: `WK-${Date.now()}` });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--background)]/50 shrink-0">
            <div>
              <h2 className="text-xl font-serif text-[var(--foreground)]">Registrar Trabajador</h2>
              <p className="text-sm text-[var(--muted)]">Agrega talento a tu equipo de producción.</p>
            </div>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-full hover:bg-black/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
            {/* Pestañas (Modo) */}
            <div className="flex p-1 bg-[var(--background)] rounded-xl border border-[var(--border-color)] mb-6">
              <button 
                onClick={() => setMode("SEARCH")} 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'SEARCH' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
              >
                <Search className="w-4 h-4" /> Buscar Existente
              </button>
              <button 
                onClick={() => setMode("CREATE")} 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'CREATE' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
              >
                <UserPlus className="w-4 h-4" /> Crear Nuevo
              </button>
            </div>

            <form id="worker-form" onSubmit={handleSubmit} className="space-y-6">
              
              {mode === "SEARCH" ? (
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">
                      Si el trabajador ya se registró previamente en Pilypage (ej. hizo una cotización o tiene cuenta de cliente), búscalo aquí para ascender su rol a <strong>Trabajador</strong>.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Correo o Nombre..." 
                      className="flex-1 bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                    />
                    <Button type="button" onClick={handleSearch} variant="outline" className="px-4" disabled={!searchQuery || isSearching}>
                      {isSearching ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Resultados</p>
                      {searchResults.map(user => (
                        <div 
                          key={user.id} 
                          onClick={() => setSelectedUserId(user.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedUserId === user.id ? 'border-primary bg-primary/10' : 'border-[var(--border-color)] bg-[var(--background)] hover:border-primary/50'}`}
                        >
                          <div>
                            <p className="font-medium text-sm text-[var(--foreground)]">{user.name}</p>
                            <p className="text-xs text-[var(--muted)]">{user.email}</p>
                          </div>
                          {selectedUserId === user.id && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 mb-4">
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">
                      Crea un perfil de trabajador desde cero. Al hacerlo, el sistema generará una cuenta oficial para que pueda iniciar sesión en su panel.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 flex items-center gap-2"><User className="w-3 h-3"/> Nombre Completo</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Ana Gómez" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 flex items-center gap-2"><Mail className="w-3 h-3"/> Correo Electrónico</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ana.gomez@taller.com" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                  </div>
                </div>
              )}

              {/* Especialidad (Compartido en ambos modos) */}
              {(mode === "CREATE" || (mode === "SEARCH" && selectedUserId)) && (
                <div className="pt-4 border-t border-[var(--border-color)]">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2 block">Asignar Especialidad Principal</label>
                  <select 
                    value={specialty} 
                    onChange={e => setSpecialty(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 outline-none text-[var(--foreground)]"
                  >
                    <option value="Confección">Corte y Confección</option>
                    <option value="Bordado">Bordado</option>
                    <option value="Logística">Logística y Empaque</option>
                    <option value="Calidad">Control de Calidad</option>
                  </select>
                </div>
              )}

            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border-color)] flex gap-3 shrink-0">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">Cancelar</Button>
            <Button 
              type="submit" 
              form="worker-form" 
              variant="primary" 
              disabled={mode === "SEARCH" && !selectedUserId}
              className="flex-1 shadow-lg shadow-primary/20"
            >
              Registrar Colaborador
            </Button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
