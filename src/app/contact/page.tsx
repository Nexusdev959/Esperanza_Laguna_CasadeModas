"use client";

import { ArrowLeft, Headphones, Mail, MessageCircle, MapPin, Paperclip } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";

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
    <>
      <main className="container max-w-4xl mx-auto px-4 py-32 min-h-screen">
        <AnimateIn delay={0.1}>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <Headphones className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-serif text-[var(--foreground)] mb-2">Centro de Soporte (PQRS)</h1>
              <p className="text-[var(--muted)] text-sm max-w-md">
                Estamos aquí para ayudarte. Déjanos tus Peticiones, Quejas, Reclamos o Sugerencias y te asignaremos un número de caso oficial para seguimiento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Información de Contacto Directo */}
              <div className="space-y-8">
                <h2 className="text-xl font-serif text-[var(--foreground)] border-b border-[var(--border-color)] pb-3">Contáctanos Directamente</h2>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--foreground)]">WhatsApp (Respuestas rápidas)</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">{settings?.phone || 'Cargando...'}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">Lunes a Viernes, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--foreground)]">Correo Electrónico</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">{settings?.supportEmail || 'Cargando...'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--foreground)]">Dirección Principal</h3>
                    <p className="text-sm text-[var(--muted)] mt-1 whitespace-pre-line">{settings?.address || 'Cargando...'}</p>
                  </div>
                </div>
              </div>

              {/* Formulario de Mensaje Rápido */}
              <div className="bg-[var(--background)] p-6 md:p-8 rounded-2xl border border-[var(--border-color)]">
                {successData ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-[var(--foreground)]">¡Solicitud Registrada!</h2>
                    <p className="text-[var(--muted)]">Hemos recibido tu solicitud y se ha generado un ticket.</p>
                    <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 rounded-xl inline-block mt-4 text-left space-y-2 mx-auto">
                      <p className="text-sm"><span className="font-medium text-[var(--foreground)]">Número de Caso:</span> {successData.caseNumber}</p>
                      <p className="text-sm"><span className="font-medium text-[var(--foreground)]">Tiempo de Respuesta:</span> {successData.estimatedResponseTime}</p>
                    </div>
                    <div className="pt-6">
                      <Button variant="outline" onClick={() => setSuccessData(null)}>Enviar otra solicitud</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-serif text-[var(--foreground)] mb-6">Escríbenos con tus Peticiones, Quejas y Reclamos</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <label htmlFor="type" className="text-xs font-medium text-[var(--foreground)]">Tipo de Solicitud</label>
                        <select 
                          id="type"
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        >
                          <option value="PETITION">Petición</option>
                          <option value="COMPLAINT">Queja</option>
                          <option value="CLAIM">Reclamo</option>
                          <option value="SUGGESTION">Sugerencia</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-medium text-[var(--foreground)]">Nombre</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Tu nombre" 
                      className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-medium text-[var(--foreground)]">Correo</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="tu@correo.com" 
                      className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-medium text-[var(--foreground)]">Mensaje</label>
                    <textarea 
                      id="message"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="¿En qué podemos ayudarte?" 
                      className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[var(--foreground)]">Archivo Adjunto (Opcional)</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-[var(--surface)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-2 transition-colors">
                        <Paperclip className="w-4 h-4" />
                        {file ? file.name : "Subir archivo o foto"}
                        <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                  </div>

                  <Button disabled={loading} type="submit" variant="primary" className="w-full py-3 text-sm font-medium rounded-xl mt-2 shadow-md hover:shadow-lg transition-shadow">
                    {loading ? "Enviando..." : "Generar Caso"}
                  </Button>
                </form>
                </>
              )}
              </div>
            </div>
          </div>
        </AnimateIn>
      </main>
    </>
  );
}
