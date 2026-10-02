"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App Critical Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Error Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="mx-auto w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/20 relative z-10">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <div className="space-y-3 relative z-10">
          <h2 className="text-3xl font-serif font-bold text-[var(--foreground)] tracking-tight">Ocurrió un Error</h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Hemos encontrado un problema inesperado en el sistema. Nuestro equipo ya ha sido notificado.
          </p>
          {error.message && (
             <div className="mt-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--border-color)] text-xs font-mono text-left overflow-hidden text-ellipsis whitespace-nowrap">
               {error.message}
             </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 relative z-10">
          <Button onClick={() => reset()} variant="primary" className="w-full flex gap-2">
            <RefreshCcw className="w-4 h-4" /> Reintentar Operación
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full flex gap-2">
            <Home className="w-4 h-4" /> Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
