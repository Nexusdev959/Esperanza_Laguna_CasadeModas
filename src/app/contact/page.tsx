"use client";

import { ArrowLeft, Headphones, Mail, MessageCircle, MapPin, Paperclip, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";
import { motion } from "framer-motion";

export default function Contact() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', message: '', type: 'PETITION'
  });
  const [file, setFile] = useState<File | null>(null);
  const [successData, setSuccessData] = useState<{caseNumber: string, estimatedResponseTime: string} | null>(null);
  const [settings, setSettings] = useState<{phone?: string, supportEmail?: string, address?: string} | null>(null);

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('description', `Nombre: ${formData.name}\nCorreo: ${formData.email}\n\nMensaje:\n${formData.message}`);
      if (file) {
        data.append('attachments', file);
      }

      const response = await api.post('/pqrs', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessData({
        caseNumber: response.data.caseNumber,
        estimatedResponseTime: response.data.estimatedResponseTime || '48 a 72 horas hábiles'
      });
      showNotification('Tu solicitud ha sido registrada exitosamente.', 'success');
      setFormData({ name: '', email: '', message: '', type: 'PETITION' });
      setFile(null);
    } catch (err: any) {
      showNotification(err.response?.data?.error || 'Error al enviar mensaje', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 px-4 relative flex flex-col items-center bg-[var(--background)] overflow-hidden font-sans">
      {/* Luces de fondo (Aura) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 dark:bg-secondary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="w-full max-w-5xl relative z-10">
        <AnimateIn delay={0.1}>
          <Link href="/" className="inline-flex items-center text-[13px] font-medium text-[#5a6c65] dark:text-[#7a8c85] hover:text-[#1c785f] dark:hover:text-[#d4af37] transition-colors mb-8 group uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          
          <div className="group/container relative bg-gradient-to-b from-[#f9fbfaf0] via-white to-[#f4f7f5] dark:from-[#111916]/95 dark:via-[#0a0f0d] dark:to-[#070a09] backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.05] hover:border-[#1c785f]/30 dark:hover:border-[#d4af37]/30 rounded-[2rem] p-8 md:p-14 shadow-2xl shadow-black/[0.03] dark:shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_25px_rgba(46,196,166,0.03)] transition-all duration-700 overflow-hidden">
            
            {/* Spotlight hover effect */}
            <div className="absolute inset-0 opacity-0 group-hover/container:opacity-100 transition-opacity duration-1000 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% -20%, rgba(212, 175, 55, 0.05) 0%, transparent 70%)" }} />

            <div className="flex flex-col items-center text-center mb-16 relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1c785f]/10 to-[#1c785f]/5 dark:from-[#d4af37]/10 dark:to-[#d4af37]/5 border border-[#1c785f]/20 dark:border-[#d4af37]/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(28,120,95,0.15)] dark:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-700">
                <Headphones className="w-8 h-8 text-[#1c785f] dark:text-[#d4af37] drop-shadow-[0_0_8px_rgba(28,120,95,0.4)] dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-medium text-[#1a2b22] dark:text-[#f0f4f2] mb-4 tracking-tight transition-colors duration-700">
                Centro de Asistencia
              </h1>
              <p className="text-[#5a6c65] dark:text-[#7a8c85] text-[15px] max-w-lg leading-relaxed transition-colors duration-700">
                Tu tranquilidad y satisfacción son nuestra máxima prioridad. Déjanos tus consultas y te brindaremos un seguimiento detallado y personalizado de inmediato.
              </p>
            </div>

            {/* Canales de Atención Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
              <a href={`https://wa.me/${settings?.phone?.replace(/\D/g, '') || ''}`} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center text-center gap-4 p-8 rounded-3xl bg-white/40 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 border border-black/5 dark:border-white/5 hover:border-[#1c785f]/20 dark:hover:border-[#d4af37]/20 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="bg-[#1c785f]/10 dark:bg-[#d4af37]/10 p-5 rounded-full text-[#1c785f] dark:text-[#d4af37] group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2b22] dark:text-[#f0f4f2] text-sm uppercase tracking-wider mb-2">WhatsApp</h3>
                  <p className="text-[15px] text-[#5a6c65] dark:text-[#7a8c85] font-medium">{settings?.phone || 'Cargando...'}</p>
                  <p className="text-[11px] text-[#5a6c65]/70 dark:text-[#7a8c85]/70 mt-1 uppercase tracking-widest">Respuestas Rápidas</p>
                </div>
              </a>

              <a href={`mailto:${settings?.supportEmail || ''}`} className="group flex flex-col items-center text-center gap-4 p-8 rounded-3xl bg-white/40 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 border border-black/5 dark:border-white/5 hover:border-[#1c785f]/20 dark:hover:border-[#d4af37]/20 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="bg-[#1c785f]/10 dark:bg-[#d4af37]/10 p-5 rounded-full text-[#1c785f] dark:text-[#d4af37] group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2b22] dark:text-[#f0f4f2] text-sm uppercase tracking-wider mb-2">Correo Electrónico</h3>
                  <p className="text-[15px] text-[#5a6c65] dark:text-[#7a8c85] font-medium">{settings?.supportEmail || 'Cargando...'}</p>
                  <p className="text-[11px] text-[#5a6c65]/70 dark:text-[#7a8c85]/70 mt-1 uppercase tracking-widest">Soporte Detallado</p>
                </div>
              </a>

              <div className="group flex flex-col items-center text-center gap-4 p-8 rounded-3xl bg-white/40 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 border border-black/5 dark:border-white/5 hover:border-[#1c785f]/20 dark:hover:border-[#d4af37]/20 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="bg-[#1c785f]/10 dark:bg-[#d4af37]/10 p-5 rounded-full text-[#1c785f] dark:text-[#d4af37] group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2b22] dark:text-[#f0f4f2] text-sm uppercase tracking-wider mb-2">Sede Principal</h3>
                  <p className="text-[14px] text-[#5a6c65] dark:text-[#7a8c85] font-medium whitespace-pre-line leading-relaxed">{settings?.address || 'Cargando...'}</p>
                </div>
              </div>
            </div>

            {/* Formulario de Mensaje Rápido (Ancho Completo) */}
            <div className="bg-white/60 dark:bg-[#060908]/60 p-8 md:p-12 rounded-[2.5rem] border border-black/[0.06] dark:border-white/[0.06] shadow-inner relative overflow-hidden z-10 w-full mx-auto max-w-4xl">
              {successData ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-200 dark:border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-serif text-[#1a2b22] dark:text-[#f0f4f2] mb-4">¡Solicitud Registrada!</h2>
                  <p className="text-[#5a6c65] dark:text-[#7a8c85] text-[15px] max-w-md mb-10">Hemos recibido tus datos correctamente. Nuestro equipo de atención te responderá lo más pronto posible.</p>
                  
                  <div className="bg-white dark:bg-[#111916] border border-black/10 dark:border-white/10 p-8 rounded-3xl w-full max-w-md text-left space-y-6 shadow-sm mb-10 flex flex-col items-center text-center">
                    <div>
                      <p className="text-[11px] text-[#5a6c65] dark:text-[#7a8c85] uppercase tracking-widest font-bold mb-2">Ticket de Seguimiento</p>
                      <p className="text-2xl font-serif text-[#1c785f] dark:text-[#d4af37]">{successData.caseNumber}</p>
                    </div>
                    <div className="w-16 h-px bg-black/10 dark:bg-white/10"></div>
                    <div>
                      <p className="text-[11px] text-[#5a6c65] dark:text-[#7a8c85] uppercase tracking-widest font-bold mb-2">Tiempo Estimado</p>
                      <p className="text-lg font-medium text-[#1a2b22] dark:text-[#f0f4f2]">{successData.estimatedResponseTime}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSuccessData(null)}
                    className="text-sm font-bold uppercase tracking-wider text-[#1c785f] dark:text-[#d4af37] hover:opacity-80 transition-opacity"
                  >
                    Crear nueva solicitud
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-serif text-[#1a2b22] dark:text-[#f0f4f2] mb-3">Escríbenos Directamente</h2>
                    <p className="text-[#5a6c65] dark:text-[#7a8c85] text-sm max-w-lg mx-auto">Selecciona el tipo de solicitud, llena tus datos y adjunta archivos si es necesario. Te contactaremos en breve.</p>
                  </div>
                  
                  <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-2">
                        <label htmlFor="type" className="text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#1a2b22] dark:text-[#d4af37]/90 ml-2">Clasificación</label>
                        <select 
                          id="type"
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                          className="w-full px-5 py-4 bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm appearance-none"
                        >
                          <option value="PETITION">Petición General</option>
                          <option value="COMPLAINT">Queja sobre el Servicio</option>
                          <option value="CLAIM">Reclamo sobre un Pedido</option>
                          <option value="SUGGESTION">Sugerencia de Mejora</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="name" className="text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#1a2b22] dark:text-[#d4af37]/90 ml-2">Nombre Completo</label>
                        <input 
                          type="text" 
                          id="name"
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Ej. María Esperanza" 
                          className="w-full px-5 py-4 bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#1a2b22] dark:text-[#d4af37]/90 ml-2">Correo Electrónico</label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="tu@correo.com" 
                        className="w-full px-5 py-4 bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#1a2b22] dark:text-[#d4af37]/90 ml-2">Mensaje o Detalle</label>
                      <textarea 
                        id="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Descríbenos en qué te podemos ayudar hoy..." 
                        className="w-full px-5 py-4 bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#1a2b22] dark:text-[#d4af37]/90 ml-2">Archivo Adjunto <span className="opacity-60 normal-case font-medium">(Opcional)</span></label>
                      <label className="w-full cursor-pointer bg-white dark:bg-[#111916] border border-dashed border-black/[0.15] dark:border-white/[0.15] hover:border-[#1c785f] dark:hover:border-[#d4af37] rounded-2xl px-5 py-6 text-sm text-[#5a6c65] dark:text-[#7a8c85] hover:text-[#1c785f] dark:hover:text-[#d4af37] flex flex-col items-center justify-center gap-3 transition-all duration-300 group">
                        <div className="bg-[#1c785f]/5 dark:bg-[#d4af37]/5 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                          <Paperclip className="w-6 h-6 text-[#1c785f] dark:text-[#d4af37]" />
                        </div>
                        {file ? <span className="font-bold text-[15px] text-[#1c785f] dark:text-[#d4af37]">{file.name}</span> : <span className="font-medium text-[#1a2b22] dark:text-[#f0f4f2]">Subir evidencia fotográfica o PDF</span>}
                        <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>

                    <div className="pt-4">
                      <button 
                        disabled={loading} 
                        type="submit" 
                        className="group/btn relative w-full md:w-auto md:min-w-[300px] mx-auto block overflow-hidden rounded-2xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(28,120,95,0.25)] dark:shadow-[0_8px_20px_rgba(212,175,55,0.2)]"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#1c785f] via-[#2ec4a6] to-[#1c785f] dark:from-[#d4af37] dark:via-[#f5e1a4] dark:to-[#d4af37] opacity-80 group-hover/btn:opacity-100 transition-opacity" />
                        <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a6652] to-[#134d3d] dark:from-[#bfa054] dark:to-[#997b2d] px-8 py-4 rounded-[15px] transition-all duration-300">
                          <span className="text-[15px] font-bold tracking-wide text-white dark:text-[#070a09]">
                            {loading ? "Procesando..." : "Enviar Solicitud Segura"}
                          </span>
                        </div>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </AnimateIn>
      </div>
    </main>
  );
}
