"use client";

import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";
import { useState, Suspense } from "react";
import { api } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const { showNotification } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showNotification("El enlace de recuperación no es válido o está incompleto", "error");
      return;
    }
    if (password !== confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      showNotification("¡Contraseña actualizada con éxito!", "success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Error al restablecer contraseña", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface)]/60 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center">
      <div className="mb-6 flex justify-center w-full relative">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <ShieldCheck className="w-8 h-8" />
        </div>
      </div>
      
      <h1 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-2 text-center tracking-tight">Crear nueva contraseña</h1>
      <p className="text-[var(--muted)] text-sm mb-8 text-center leading-relaxed">
        Ingresa tu nueva contraseña a continuación.
      </p>
      
      <form className="w-full space-y-5" onSubmit={handleReset}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--foreground)] ml-1">Nueva Contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="w-5 h-5 text-[var(--muted)]" />
            </div>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--foreground)] ml-1">Confirmar Contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="w-5 h-5 text-[var(--muted)]" />
            </div>
            <input 
              type="password" 
              required
              minLength={6}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
        
        <Button type="submit" variant="primary" disabled={loading} className="w-full mt-6 group flex items-center justify-center">
          {loading ? "Actualizando..." : "Actualizar Contraseña"}
          {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[var(--background)]">
      <div className="absolute top-[20%] -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      
      <AnimateIn className="w-full max-w-md relative z-10">
        <Suspense fallback={<div className="p-10 text-center">Cargando formulario...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </AnimateIn>
    </main>
  );
}
