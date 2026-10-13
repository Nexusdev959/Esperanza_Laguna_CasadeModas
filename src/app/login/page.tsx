"use client";

import { GoogleLogin } from '@react-oauth/google';

import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";
import { AuthTransitionCurtain } from "./AuthTransitionCurtain";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");
  const [googleHint, setGoogleHint] = useState(false);
  const googleRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'ADMIN' || payload.role === 'SUPERADMIN') {
          window.location.href = "/admin";
        } else {
          window.location.href = "/account";
        }
      } catch (e) {
        // Invalid token, do nothing
      }
    }
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (targetRoute) window.location.href = targetRoute;
  }, [targetRoute]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('jwt_token', res.data.token);
      
      const role = res.data.user.role;
      setTargetRoute(role === 'ADMIN' || role === 'SUPERADMIN' ? "/admin" : "/account");
      setIsAuthenticated(true);
    } catch (err: any) {
      const code = err.response?.data?.code;
      if (code === "ACCOUNT_NOT_FOUND") {
        // El correo viaja por sessionStorage, nunca en la URL
        try { sessionStorage.setItem("register_email", email); } catch {}
        router.push("/register?origen=login");
        return;
      }
      if (code === "USE_GOOGLE") {
        setGoogleHint(true);
        googleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      showNotification(err.response?.data?.error || "Error al iniciar sesión", "error");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      localStorage.setItem('jwt_token', res.data.token);
      
      const role = res.data.user.role;
      setTargetRoute(role === 'ADMIN' || role === 'SUPERADMIN' ? "/admin" : "/account");
      setIsAuthenticated(true);
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Error al iniciar sesión con Google", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[var(--background)] transition-colors duration-500">
        {/* Aurora Background */}
        <div className="absolute top-[20%] -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
        
        <AnimateIn className="w-full max-w-md relative z-10 pt-24 sm:pt-28">
          <div className="sm:bg-[var(--surface)]/60 sm:backdrop-blur-2xl sm:border sm:border-[var(--border-color)] sm:rounded-[2rem] p-2 sm:p-10 sm:shadow-2xl flex flex-col items-center">
            
            <div className="mb-4 sm:mb-6 flex justify-center">
              <Link href="/">
                <img src="/logos/log1.png" alt="Logo Pilypage" className="h-[65px] sm:h-[90px] w-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
              </Link>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--foreground)] mb-1 sm:mb-2 text-center tracking-tight drop-shadow-sm">Bienvenido de vuelta</h1>
            <p className="hidden sm:block text-[var(--muted)] text-sm mb-8 text-center leading-relaxed">Ingresa a tu cuenta para continuar tu experiencia Pilypage.</p>
            
            <form className="w-full space-y-4 sm:space-y-5 mt-2 sm:mt-0" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[var(--foreground)] ml-1 tracking-wide">Correo Electrónico</label>
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
                    className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[13px] font-medium text-[var(--foreground)] tracking-wide">Contraseña</label>
                  <Link href="/recover" className="text-xs text-primary hover:text-[var(--primary-dark)] transition-colors">¿Olvidaste tu contraseña?</Link>
                </div>
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
                    className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  />
                </div>
              </div>
              
              <Button type="submit" variant="primary" disabled={loading} className="w-full mt-4 sm:mt-6 flex justify-between items-center group py-4 sm:py-6 rounded-xl shadow-lg shadow-primary/20">
                <span className="font-semibold tracking-wide">{loading ? "Cargando..." : "Iniciar Sesión"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            
            <div className="w-full my-5 sm:my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border-color)]"></div>
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-medium">O continúa con</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border-color)]"></div>
            </div>
            
            <div ref={googleRef} className={`flex flex-col items-center gap-3 w-full min-h-[44px] rounded-2xl transition-all duration-300 ${googleHint ? "p-3 ring-2 ring-primary/60 bg-primary/5" : ""}`}>
              {googleHint && (
                <p role="status" className="text-sm text-[var(--foreground)] text-center">
                  Tu cuenta se creó con Google. Usa este botón para entrar.
                </p>
              )}
              {mounted && (
                <div className="w-full flex justify-center hover:scale-[1.02] transition-transform duration-300">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      showNotification("Fallo al iniciar sesión con Google", "error");
                    }}
                    theme={currentTheme === "dark" ? "filled_black" : "outline"}
                    size="large"
                    text="continue_with"
                    shape="pill"
                  />
                </div>
              )}
            </div>
            
            <p className="mt-5 sm:mt-8 text-sm text-[var(--muted)] text-center">
              ¿No tienes una cuenta? <Link href="/register" className="text-[var(--foreground)] font-medium hover:underline underline-offset-4">Regístrate</Link>
            </p>
          </div>
        </AnimateIn>

        <AuthTransitionCurtain 
          isAuthenticated={isAuthenticated} 
          onTransitionComplete={handleTransitionComplete}
          monogramSrc="/logos/log2.png"
          textLogoSrc="/logos/log3.png"
        />
      </main>
    </>
  );
}
