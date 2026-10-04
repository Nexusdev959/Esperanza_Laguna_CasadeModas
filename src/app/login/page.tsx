"use client";

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";
import { AuthTransitionCurtain } from "./AuthTransitionCurtain";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");

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
      <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[var(--background)]">
        {/* Aurora Background */}
        <div className="absolute top-[20%] -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
        
        <AnimateIn className="w-full max-w-md relative z-10 pt-20">
          <div className="bg-[var(--surface)]/60 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center">
            
            <div className="mb-6 flex justify-center">
              <Link href="/">
                <img src="/logos/log1.png" alt="Logo Pilypage" className="h-[104px] w-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
              </Link>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--foreground)] mb-2 text-center tracking-tight">Bienvenido de vuelta</h1>
            <p className="text-[var(--muted)] text-sm mb-8 text-center leading-relaxed">Ingresa a tu cuenta para continuar tu experiencia Pilypage.</p>
            
            <form className="w-full space-y-5" onSubmit={handleLogin}>
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
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-[var(--foreground)]">Contraseña</label>
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
                    className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              
              <Button type="submit" variant="primary" disabled={loading} className="w-full mt-6 flex justify-between items-center group">
                {loading ? "Cargando..." : "Iniciar Sesión"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            
            <div className="w-full my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-medium">O continúa con</span>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
            </div>
            
            <div className="flex justify-center w-full min-h-[44px]">
              {mounted && (
                <GoogleOAuthProvider clientId="886916002371-9a1rl4kal3f70ddhdq5117s23b4bdejf.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      showNotification("Fallo al iniciar sesión con Google", "error");
                    }}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                  />
                </GoogleOAuthProvider>
              )}
            </div>
            
            <p className="mt-8 text-sm text-[var(--muted)] text-center">
              ¿No tienes una cuenta? <Link href="/register" className="text-[var(--foreground)] font-medium hover:underline underline-offset-4">Regístrate</Link>
            </p>
          </div>
        </AnimateIn>

        <AuthTransitionCurtain 
          isAuthenticated={isAuthenticated} 
          onTransitionComplete={handleTransitionComplete}
          lightLogoSrc="/logos/log2.png"
          darkLogoSrc="/logos/log3.png"
        />
      </main>
    </>
  );
}
