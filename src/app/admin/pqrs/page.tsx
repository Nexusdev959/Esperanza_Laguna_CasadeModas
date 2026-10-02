"use client";

import { useState, useEffect } from "react";
import { Mailbox, Search, Filter, Image as ImageIcon, Send, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/components/ui/notification-provider";
import { api } from "@/lib/api";

export default function AdminPqrsPage() {
  const { showNotification } = useNotification();
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState("ALL"); // ALL, OPEN, RESOLVED
  const [isLoading, setIsLoading] = useState(true);

  const loadPqrs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/pqrs');
      setCases(res.data);
    } catch (error) {
      console.error('Error fetching PQRS:', error);
      showNotification("No se pudieron cargar los casos PQRS", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPqrs();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim()) {
      showNotification("La respuesta no puede estar vacía", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await api.put(`/pqrs/${selectedCase.id}/reply`, { replyText });
      showNotification("Respuesta enviada y PDF generado correctamente", "success");
      
      // Update local state
      setCases(cases.map(c => c.id === selectedCase.id ? res.data : c));
      setSelectedCase(res.data);
      setReplyText("");
    } catch (error: any) {
      console.error(error);
      showNotification(error.response?.data?.error || "Error al procesar la respuesta", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'OPEN': <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-xs font-medium">Abierto</span>,
      'IN_PROGRESS': <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full text-xs font-medium">En Progreso</span>,
      'RESOLVED': <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-medium">Resuelto</span>,
      'CLOSED': <span className="px-2.5 py-1 bg-gray-500/10 text-gray-600 border border-gray-500/20 rounded-full text-xs font-medium">Cerrado</span>,
    };
    return badges[status] || badges['OPEN'];
  };

  const getTypeLabel = (type: string) => {
    const types: any = {
      'PETITION': 'Petición',
      'COMPLAINT': 'Queja',
      'CLAIM': 'Reclamo',
      'SUGGESTION': 'Sugerencia'
    };
    return types[type] || type;
  };

  const filteredCases = cases.filter(c => {
    if (filter === "OPEN") return c.status === "OPEN" || c.status === "IN_PROGRESS";
    if (filter === "RESOLVED") return c.status === "RESOLVED" || c.status === "CLOSED";
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)] flex items-center gap-2">
            <Mailbox className="w-6 h-6 text-primary" /> Buzón PQRS
          </h1>
          <p className="text-sm text-[var(--muted)]">Gestiona las peticiones, quejas, reclamos y sugerencias de los clientes.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Left Column: List of PQRS */}
        <div className="lg:col-span-1 bg-[var(--surface)] rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input type="text" placeholder="Buscar por número de caso..." className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFilter("ALL")} className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === 'ALL' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--background)] text-[var(--muted)] border border-[var(--border-color)] hover:text-[var(--foreground)]'}`}>Todos</button>
              <button onClick={() => setFilter("OPEN")} className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === 'OPEN' ? 'bg-amber-500 text-white' : 'bg-[var(--background)] text-[var(--muted)] border border-[var(--border-color)] hover:text-[var(--foreground)]'}`}>Pendientes</button>
              <button onClick={() => setFilter("RESOLVED")} className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === 'RESOLVED' ? 'bg-emerald-500 text-white' : 'bg-[var(--background)] text-[var(--muted)] border border-[var(--border-color)] hover:text-[var(--foreground)]'}`}>Resueltos</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {isLoading ? (
              <div className="p-8 text-center text-[var(--muted)] text-sm">Cargando buzón...</div>
            ) : filteredCases.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted)] text-sm">No hay casos en esta categoría.</div>
            ) : (
              filteredCases.map(pqrs => (
                <button 
                  key={pqrs.id}
                  onClick={() => setSelectedCase(pqrs)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCase?.id === pqrs.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-[var(--border-color)] hover:border-[var(--foreground)]/30 hover:bg-[var(--background)]'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[var(--muted)]">#{pqrs.caseNumber}</span>
                    {getStatusBadge(pqrs.status)}
                  </div>
                  <h4 className="font-medium text-sm text-[var(--foreground)] mb-1 truncate">{getTypeLabel(pqrs.type)}</h4>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{pqrs.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--muted)]">
                    <span>{new Date(pqrs.createdAt).toLocaleDateString()}</span>
                    {pqrs.user?.name && <span>{pqrs.user.name}</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Case Details & Reply */}
        <div className="lg:col-span-2 bg-[var(--surface)] rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col overflow-hidden">
          {selectedCase ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-serif text-[var(--foreground)]">Caso #{selectedCase.caseNumber}</h2>
                    {getStatusBadge(selectedCase.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                    <span><strong>Tipo:</strong> {getTypeLabel(selectedCase.type)}</span>
                    <span><strong>Fecha:</strong> {new Date(selectedCase.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedCase.user && (
                    <div className="mt-2 text-sm text-[var(--muted)]">
                      <strong>Cliente:</strong> {selectedCase.user.name} ({selectedCase.user.email})
                    </div>
                  )}
                  {selectedCase.order && (
                    <div className="mt-1 text-sm text-[var(--muted)]">
                      <strong>Pedido Relacionado:</strong> #{selectedCase.order.id.slice(0,8).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* User's message */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">Descripción del Cliente</h3>
                  <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                    {selectedCase.description}
                  </div>
                </div>

                {/* Attachments */}
                {selectedCase.attachments && selectedCase.attachments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Evidencias Adjuntas
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {selectedCase.attachments.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 w-32 h-32 rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-primary transition-colors">
                          <img src={url} alt={`Evidencia ${idx+1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* System/Admin Reply Area */}
                {selectedCase.status === 'RESOLVED' || selectedCase.status === 'CLOSED' ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      <h3 className="font-semibold">Caso Resuelto</h3>
                    </div>
                    <div className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                      {selectedCase.replyText}
                    </div>
                    {selectedCase.replyPdfUrl && (
                      <div className="pt-4 mt-4 border-t border-emerald-500/10">
                        <a 
                          href={selectedCase.replyPdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                        >
                          <FileText className="w-4 h-4" /> Ver PDF de Respuesta Oficial
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Dar Tratamiento al Caso</h3>
                    <p className="text-xs text-[var(--muted)] mb-4">Escribe la respuesta oficial. Al enviar, el sistema generará automáticamente un PDF con el membrete de la empresa y se lo enviará al cliente por correo electrónico.</p>
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escribe aquí la resolución del caso..."
                      className="w-full h-40 p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleReply}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isSubmitting ? (
                          <>Procesando y generando PDF...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Responder y Generar PDF
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[var(--muted)] space-y-4">
              <Mailbox className="w-16 h-16 opacity-20" />
              <p>Selecciona un caso del buzón para ver los detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
