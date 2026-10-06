"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";

interface UserProfileCardProps {
  isCollapsed?: boolean;
}

export function UserProfileCard({ isCollapsed = false }: UserProfileCardProps) {
  const [user, setUser] = useState<{ name: string; role: string; avatar?: string } | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      api
        .get("/auth/profile")
        .then((res) => setUser(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const res = await api.put("/auth/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUser(res.data);
        showNotification("Foto de perfil actualizada correctamente", "success");
      } catch (error) {
        console.error("Error al actualizar foto:", error);
        showNotification("Error al actualizar la foto de perfil", "error");
      }
    }
  };

  const displayName = user?.name || "Felipe Miranda";
  const displayRole = user?.role || "SUPERADMIN";
  const displayAvatar =
    user?.avatar ||
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";

  return (
    <div
      className={`relative flex flex-col items-center transition-all select-none overflow-hidden 
        bg-[#fbfdfc] dark:bg-[#070d0b] text-slate-800 dark:text-[#f0f4f2]
        bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(46,196,166,0.15)_0%,rgba(251,253,252,0.98)_75%)]
        dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(46,196,166,0.12)_0%,rgba(7,13,11,0.98)_75%)]
        ${isCollapsed ? "py-4 px-2" : "pt-8 pb-0 px-4"}`}
    >
      {/* Resplandor suave turquesa/esmeralda unificado */}
      <div className="absolute top-6 w-56 h-56 rounded-full bg-[#2ec4a6]/15 dark:bg-[#2ec4a6]/10 blur-3xl pointer-events-none" />

      {/* Contenedor del Marco + Avatar */}
      <div
        className={`relative flex items-center justify-center transition-all ${isCollapsed ? "w-12 h-12 my-1" : "w-60 h-60 my-1"
          }`}
      >
        {!isCollapsed && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] z-10"
            viewBox="0 0 260 260"
            fill="none"
          >
            <defs>
              {/* Oro envejecido noble y homogéneo */}
              <linearGradient id="agedGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5e1a4" />
                <stop offset="25%" stopColor="#d8b15d" />
                <stop offset="50%" stopColor="#9c772e" />
                <stop offset="75%" stopColor="#e2c275" />
                <stop offset="100%" stopColor="#876321" />
              </linearGradient>

              {/* Tono secundario oro sombra */}
              <linearGradient id="darkGold" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5a4316" />
                <stop offset="50%" stopColor="#9c772e" />
                <stop offset="100%" stopColor="#43310d" />
              </linearGradient>

              {/* Acento verde esmeralda / costura */}
              <linearGradient id="emeraldThread" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#2ec4a6" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>

              {/* Patrón trenzado filigrana artesanal */}
              <pattern
                id="artisanBraid"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(35)"
              >
                <line x1="0" y1="0" x2="6" y2="0" stroke="#fceec7" strokeWidth="1.2" opacity="0.6" />
                <line x1="0" y1="3" x2="6" y2="3" stroke="#48350d" strokeWidth="1.4" opacity="0.8" />
              </pattern>
            </defs>

            {/* Anillo de resplandor exterior */}
            <circle cx="130" cy="130" r="95" stroke="url(#emeraldThread)" strokeWidth="1" opacity="0.35" />

            {/* Aro principal texturizado */}
            <circle cx="130" cy="130" r="88" stroke="url(#agedGold)" strokeWidth="14" />
            <circle cx="130" cy="130" r="88" stroke="url(#artisanBraid)" strokeWidth="12" fill="none" />

            {/* Bordes biselados interiores y exteriores */}
            <circle cx="130" cy="130" r="95" stroke="url(#darkGold)" strokeWidth="1.8" fill="none" />
            <circle cx="130" cy="130" r="81" stroke="url(#darkGold)" strokeWidth="2" fill="none" />
            <circle cx="130" cy="130" r="78.5" stroke="url(#emeraldThread)" strokeWidth="1.5" fill="none" />
            <circle cx="130" cy="130" r="76" stroke="url(#agedGold)" strokeWidth="1.2" fill="none" />

            {/* Elemento 1: Aguja de coser con ojo calado (Izquierda) */}
            <g transform="translate(14, 102)">
              <line x1="12" y1="0" x2="12" y2="52" stroke="url(#agedGold)" strokeWidth="2.2" strokeLinecap="round" />
              <ellipse cx="12" cy="7" rx="0.9" ry="4" className="fill-[#fbfdfc] dark:fill-[#070d0b]" />
            </g>

            {/* Elemento 2: Tijera clásica de sastrería (Derecha) */}
            <g transform="translate(208, 98)">
              {/* Hojas */}
              <line x1="10" y1="2" x2="14" y2="32" stroke="url(#agedGold)" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="2" x2="14" y2="32" stroke="url(#agedGold)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="22" r="1.8" fill="#43310d" />
              {/* Anillas de sujeción */}
              <circle cx="8" cy="40" r="5.5" stroke="url(#agedGold)" strokeWidth="2" fill="none" />
              <circle cx="20" cy="40" r="5.5" stroke="url(#agedGold)" strokeWidth="2" fill="none" />
            </g>

            {/* Elemento 3: Carrete de hilo superior derecho */}
            <g transform="translate(186, 38) rotate(32)">
              <rect x="0" y="4" width="13" height="20" rx="1.5" fill="url(#emeraldThread)" />
              {/* Hebras de hilo */}
              <line x1="2" y1="8" x2="11" y2="8" stroke="#042f2e" strokeWidth="1" opacity="0.6" />
              <line x1="2" y1="14" x2="11" y2="14" stroke="#042f2e" strokeWidth="1" opacity="0.6" />
              <ellipse cx="6.5" cy="4" rx="8.5" ry="2.6" fill="url(#agedGold)" />
              <ellipse cx="6.5" cy="24" rx="8.5" ry="2.6" fill="url(#agedGold)" />
            </g>

            {/* Elemento 4: Carrete inferior izquierdo */}
            <g transform="translate(42, 180) rotate(-38)">
              <rect x="0" y="4" width="13" height="20" rx="1.5" fill="url(#darkGold)" />
              <line x1="2" y1="8" x2="11" y2="8" stroke="#231804" strokeWidth="1" opacity="0.7" />
              <line x1="2" y1="14" x2="11" y2="14" stroke="#231804" strokeWidth="1" opacity="0.7" />
              <ellipse cx="6.5" cy="4" rx="8.5" ry="2.6" fill="url(#agedGold)" />
              <ellipse cx="6.5" cy="24" rx="8.5" ry="2.6" fill="url(#agedGold)" />
            </g>
          </svg>
        )}

        {/* Imagen del perfil centrada */}
        <div
          className={`relative rounded-full overflow-hidden transition-all group z-20 ${isCollapsed
              ? "w-11 h-11 ring-2 ring-[#d8b15d]"
              : "w-36 h-36 ring-2 ring-white dark:ring-[#070d0b] shadow-xl dark:shadow-none"
            }`}
        >
          <img
            src={displayAvatar}
            alt="User Profile"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <label
            aria-label="Actualizar foto de perfil"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-[#f5e1a4] drop-shadow" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>
      </div>

      {/* Identidad y Rol */}
      {!isCollapsed && (
        <div className="flex flex-col items-center text-center mt-2.5 w-full z-20">
          <h3 className="text-slate-800 dark:text-[#f7faf8] text-[22px] font-normal tracking-wide drop-shadow-sm">
            {displayName}
          </h3>

          <div className="mt-2.5 inline-flex items-center justify-center px-5 py-1 rounded-full bg-[#3ec7a7] text-[#071a15] text-[11px] font-bold tracking-[0.22em] uppercase shadow-[0_2px_14px_rgba(62,199,167,0.35)]">
            {displayRole}
          </div>
        </div>
      )}

      {/* Cenefa decorativa inferior delgada y compacta */}
      {!isCollapsed && (
        <div className="w-full mt-5 h-6 relative flex items-center justify-center border-t border-[#9c772e]/30 dark:border-[#9c772e]/50 overflow-hidden bg-gradient-to-r from-[#fdfbf5] via-[#f4ead5] to-[#fdfbf5] dark:from-[#171105] dark:via-[#332408] dark:to-[#171105]">
          <div className="absolute inset-0 opacity-15 dark:opacity-25 bg-[radial-gradient(#d8b15d_1px,transparent_1px)] dark:bg-[radial-gradient(#f5e1a4_1px,transparent_1px)] [background-size:5px_5px]" />
          <svg className="h-3.5 w-auto relative z-10" viewBox="0 0 180 14" fill="none">
            <path
              d="M 10 7 L 55 7 M 125 7 L 170 7"
              stroke="#e2c275"
              strokeWidth="1"
              strokeDasharray="3 2"
              opacity="0.8"
            />
            {/* Grabado geométrico central artesanal */}
            <rect x="67" y="2.5" width="9" height="9" rx="1.5" stroke="#e2c275" strokeWidth="1.2" fill="none" />
            <rect x="85.5" y="2.5" width="9" height="9" rx="1.5" stroke="#e2c275" strokeWidth="1.2" fill="none" />
            <rect x="104" y="2.5" width="9" height="9" rx="1.5" stroke="#e2c275" strokeWidth="1.2" fill="none" />
            <circle cx="90" cy="7" r="1.8" fill="#e2c275" />
          </svg>
        </div>
      )}
    </div>
  );
}