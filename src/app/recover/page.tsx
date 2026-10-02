"use client";

import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";
import { useState } from "react";

export default function RecoverPage() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular el tiempo de red
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      showNotification("Si el correo existe, hemos enviado un enlace de recuperación.", "success");
    }, 1500);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[var(--background)]">
      {/* Aurora Background */}
      <div className="absolute top-[20%] -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      
      <AnimateIn className="w-full max-w-md relative z-10">
        <div className="bg-[var(--surface)]/60 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center">
          
          <div className="mb-6 flex justify-center w-full relative">
            <Link href="/login" className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-full text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-2 text-center tracking-tight">Recuperar Contraseña</h1>
          
          {!sent ? (
            <>
              <p className="text-[var(--muted)] text-sm mb-8 text-center leading-relaxed">
                Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace seguro para restablecer tu contraseña.
              </p>
              
              <form className="w-full space-y-5" onSubmit={handleRecover}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--foreground)] ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="w-5 h-5 text-[var(--muted)]" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="hola@ejemplo.com"
                      className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>
                
                <Button type="submit" variant="primary" disabled={loading} className="w-full mt-6">
                  {loading ? "Procesando..." : "Enviar Enlace de Recuperación"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center w-full py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">Revisa tu bandeja de entrada</h3>
              <p className="text-sm text-[var(--muted)] mb-6">Hemos enviado instrucciones a <span className="font-bold">{email}</span></p>
              <Button onClick={() => window.location.href='/login'} variant="outline" className="w-full">
                Volver al Inicio de Sesión
              </Button>
            </div>
          )}
          
        </div>
      </AnimateIn>
    </main>
  );
}
