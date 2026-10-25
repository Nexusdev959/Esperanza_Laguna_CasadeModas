"use client";

import { usePanelUser, ROLE_LABELS } from "./panel-user";

/** Barra superior común de los paneles: título de la sección y la persona con sesión iniciada. */
export function PanelHeader({ title }: { title: string }) {
  const { user } = usePanelUser();
  const words = user.name.split(" ").filter(Boolean);
  // Primera y última palabra: igual que el avatar generado del menú lateral
  const initials = ((words[0]?.[0] ?? "?") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-between pl-16 pr-6 md:px-6 z-10 sticky top-0">
      <h2 className="text-sm font-medium text-[var(--foreground)]">{title}</h2>

      <div className="flex items-center space-x-3 pl-4 border-l border-[var(--border-color)]">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-[var(--foreground)] leading-none">{user.name}</p>
          <p className="text-[10px] text-[var(--muted)] mt-1 tracking-wider uppercase">{ROLE_LABELS[user.role] ?? user.role}</p>
        </div>
        <div className="w-9 h-9 bg-gradient-to-tr from-[#1B4332] to-[#52B788] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white dark:ring-[#070d0b]">
          {initials}
        </div>
      </div>
    </header>
  );
}
