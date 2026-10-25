"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

export type PanelUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  club?: string | null;
  avatar?: string | null;
};

export const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Cliente",
  WORKER: "Taller",
  ADMIN: "Administrador",
  SUPERADMIN: "Super Admin",
};

export const ADMIN_ROLES = ["ADMIN", "SUPERADMIN"];

/** Rutas con panel propio (menú lateral): ocultan el header, el footer y la transición de la tienda. */
export const isPanelRoute = (pathname?: string | null) =>
  !!pathname && (pathname.startsWith("/admin") || pathname.startsWith("/account"));

const homeFor = (role: string) => (ADMIN_ROLES.includes(role) ? "/admin" : "/account");

const PanelUserContext = createContext<{ user: PanelUser; setUser: (u: PanelUser) => void } | null>(null);

export const usePanelUser = () => {
  const ctx = useContext(PanelUserContext);
  if (!ctx) throw new Error("usePanelUser debe usarse dentro de <PanelUserProvider>");
  return ctx;
};

/**
 * Puerta de entrada a los paneles: no muestra nada hasta confirmar la sesión.
 * El rol se pide al backend (/auth/profile lo lee de la BD), así que escribir /admin en la URL
 * o editar el token del navegador no da acceso. Los datos igual los protege el backend con requireRole.
 */
export function PanelUserProvider({ allowedRoles, children }: { allowedRoles?: string[]; children: ReactNode }) {
  const [user, setUser] = useState<PanelUser | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("jwt_token")) {
      window.location.replace("/login");
      return;
    }
    api
      .get("/auth/profile")
      .then((res) => {
        const profile: PanelUser = res.data;
        if (allowedRoles && !allowedRoles.includes(profile.role)) {
          window.location.replace(homeFor(profile.role));
          return;
        }
        setUser(profile);
      })
      .catch(() => window.location.replace("/login"));
  }, [allowedRoles?.join()]); // join: el arreglo llega nuevo en cada render

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]" role="status" aria-label="Verificando sesión">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2ec4a6]" />
      </div>
    );
  }

  return <PanelUserContext.Provider value={{ user, setUser }}>{children}</PanelUserContext.Provider>;
}
