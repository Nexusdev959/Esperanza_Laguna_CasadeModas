"use client";

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, User, Users } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { showNotification } = useNotification();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fromLogin, setFromLogin] = useState(false);
  const [club, setClub] = useState("");
  // Credencial de Google guardada por el login cuando ese correo no tenía cuenta
  const [pendingGoogle, setPendingGoogle] = useState<{ credential: string; email: string } | null>(null);
  const clubReady = club.trim().length >= 2;

  useEffect(() => {
    setMounted(true);
    const origen = new URLSearchParams(window.location.search).get("origen");
    if (origen === "google") {
      try {
        const credential = sessionStorage.getItem("google_credential");
        sessionStorage.removeItem("google_credential");
        if (credential) {
          const payload = JSON.parse(atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
          setPendingGoogle({ credential, email: payload.email });
        }
      } catch {}
    }
    // Llega desde el login con un correo sin cuenta: se prellena el correo
    if (origen === "login") {
      setFromLogin(true);
      try {
        const saved = sessionStorage.getItem("register_email");
        if (saved) setEmail(saved);
        sessionStorage.removeItem("register_email");
      } catch {}
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, club });
      localStorage.setItem('jwt_token', res.data.token);
      showNotification("Cuenta creada exitosamente. Redirigiendo...", "success");
      setTimeout(() => {
        router.replace("/account");
      }, 1000);
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Error al crear cuenta", "error");
      setLoading(false);
    }
  };

  const registerWithGoogle = async (credential: string) => {
    if (!clubReady) {
      showNotification("Indica el club al que perteneces para crear tu cuenta", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { token: credential, club });
      localStorage.setItem('jwt_token', res.data.token);
      showNotification("Cuenta creada exitosamente. Redirigiendo...", "success");
      const role = res.data.user.role;
      setTimeout(() => {
        if (role === 'ADMIN' || role === 'SUPERADMIN') {
          router.replace("/admin");
        } else {
          router.replace("/account");
        }
      }, 1000);
    } catch (err: any) {
      // Credencial vencida (dura 1 h): se vuelve al botón normal de Google
      setPendingGoogle(null);
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

            {pendingGoogle && mounted && (
              <div role="status" className="w-full mb-8 p-4 rounded-2xl ring-2 ring-primary/60 bg-primary/5 flex flex-col gap-3">
                <p className="text-sm text-[var(--foreground)] text-center">
                  <strong>{pendingGoogle.email}</strong> aún no tiene cuenta. Indica tu club y créala en un paso.
                </p>
                <ClubInput club={club} setClub={setClub} />
                <Button type="button" variant="primary" disabled={loading || !clubReady} onClick={() => registerWithGoogle(pendingGoogle.credential)} className="w-full flex justify-between items-center group">
                  {loading ? "Creando cuenta..." : "Crear cuenta con Google"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {fromLogin && mounted && (
              <div role="status" className="w-full mb-8 p-4 rounded-2xl ring-2 ring-primary/60 bg-primary/5">
                <p className="text-sm text-[var(--foreground)] text-center">
                  No encontramos una cuenta con ese correo. Completa el formulario o regístrate con Google más abajo.
                </p>
              </div>
            )}

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

              {!pendingGoogle && <ClubInput club={club} setClub={setClub} />}

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
            
            <div className="flex justify-center w-full min-h-[44px]">
              {/* El club es obligatorio también con Google: el botón aparece cuando ya lo escribió */}
              {mounted && !pendingGoogle && (clubReady ? (
                <GoogleOAuthProvider clientId="886916002371-9a1rl4kal3f70ddhdq5117s23b4bdejf.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={(r) => r.credential && registerWithGoogle(r.credential)}
                    onError={() => {
                      showNotification("Fallo al registrarse con Google", "error");
                    }}
                    theme="outline"
                    size="large"
                    text="signup_with"
                    shape="rectangular"
                  />
                </GoogleOAuthProvider>
              ) : (
                <p className="text-xs text-[var(--muted)] text-center self-center">Escribe tu club arriba para registrarte con Google.</p>
              ))}
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

/** Club obligatorio en el registro (con correo o con Google). */
function ClubInput({ club, setClub }: { club: string; setClub: (v: string) => void }) {
  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor="club" className="text-sm font-medium text-[var(--foreground)] ml-1">Club al que perteneces</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Users className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <input
          id="club"
          type="text"
          required
          minLength={2}
          maxLength={120}
          value={club}
          onChange={e => setClub(e.target.value)}
          placeholder="Ej. Conquistadores Orión"
          className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
    </div>
  );
}
