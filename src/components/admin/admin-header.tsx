"use client";

import React from "react";
import { Bell, Search } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-between px-6 z-10 sticky top-0">
      {/* Lado izquierdo: Título / Migas de pan / Buscador global */}
      <div className="flex items-center flex-1 gap-4">
        <h2 className="text-sm font-medium text-[var(--foreground)] hidden md:block">
          Panel de Control
        </h2>
        {/* Opcional: Buscador global para el admin */}
        <div className="relative hidden md:flex items-center w-full max-w-xs ml-4">
          <Search className="w-4 h-4 absolute left-3 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Buscar en el panel..." 
            className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-[var(--border-color)] rounded-full pl-9 pr-4 py-1.5 text-sm text-[var(--foreground)] outline-none transition-all"
          />
        </div>
      </div>

      {/* Lado derecho: Acciones y Perfil Minimalista */}
      <div className="flex items-center space-x-4">
        
        {/* Notificaciones */}
        <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--muted)] hover:text-[var(--foreground)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--surface)]"></span>
        </button>

        {/* Zona de Perfil (Elemento Independiente) */}
        <div className="flex items-center space-x-3 pl-4 border-l border-[var(--border-color)] cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--foreground)] leading-none">Admin</p>
            <p className="text-[10px] text-[var(--muted)] mt-1 tracking-wider uppercase">Superusuario</p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-tr from-[#1B4332] to-[#52B788] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white dark:ring-[#070d0b]">
            AD
          </div>
        </div>

      </div>
    </header>
  );
}
