"use client";

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";

import { useState } from "react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const { showNotification } = useNotification();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('jwt_token', res.data.token);
      showNotification("Cuenta creada exitosamente. Redirigiendo...", "success");
      setTimeout(() => {
        window.location.href = "/account";
      }, 1000);
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Error al crear cuenta", "error");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      localStorage.setItem('jwt_token', res.data.token);
      showNotification("Cuenta creada exitosamente. Redirigiendo...", "success");
      const role = res.data.user.role;
      setTimeout(() => {
        if (role === 'ADMIN' || role === 'SUPERADMIN') {
          window.location.href = "/admin";
        } else {
          window.location.href = "/account";
        }
      }, 1000);
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Error al registrarse con Google", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[var(--background)]">
        {/* Aurora Background */}
        <div className="absolute top-[20%] -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
        
        <AnimateIn className="w-full max-w-md relative z-10 pt-20">
          <div className="bg-[var(--surface)]/60 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center">
            
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--foreground)] mb-2 text-center tracking-tight">Crear Cuenta</h1>
            <p className="text-[var(--muted)] text-sm mb-8 text-center leading-relaxed">Únete a Pilypage y descubre una nueva forma de comprar.</p>
            
            <form className="w-full space-y-5" onSubmit={handleRegister}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--foreground)] ml-1">Nombre Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <User className="w-5 h-5 text-[var(--muted)]" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="María López"
                    className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

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
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--foreground)] ml-1">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock className="w-5 h-5 text-[var(--muted)]" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              
              <Button type="submit" variant="primary" disabled={loading} className="w-full mt-6 flex justify-between items-center group">
                {loading ? "Cargando..." : "Registrarme"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            
            <div className="w-full my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-medium">O continúa con</span>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
            </div>
            
            <div className="flex justify-center w-full">
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      showNotification("Fallo al registrarse con Google", "error");
                    }}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="signup_with"
                    shape="rectangular"
                  />
                </GoogleOAuthProvider>
              ) : (
                <div className="text-sm text-[var(--muted)] text-center p-3 border border-dashed border-[var(--border-color)] rounded-xl w-full">
                  Registro con Google no configurado
                </div>
              )}
            </div>
            
            <p className="mt-8 text-sm text-[var(--muted)] text-center">
              ¿Ya tienes una cuenta? <Link href="/login" className="text-[var(--foreground)] font-medium hover:underline underline-offset-4">Inicia Sesión</Link>
            </p>
          </div>
        </AnimateIn>
      </main>
    </>
  );
}
